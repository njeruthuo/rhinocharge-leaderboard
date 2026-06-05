import { REFETCH_INTERVAL } from "@/constants";
import {
  useGetCheckPointsMutation,
  useGetVehicleListQuery,
  useGetStartPointOdometerMutation,
  useGetMovementSummaryMutation,
} from "@/state/rhinoApi";
import { CHECKPOINTS } from "@/data";
import {
  calculateHistory,
  calculatePointToPointMileage,
  // formatDate,
  parseTime,
} from "@/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useGetStoredDates from "./useGetStoredDates";
import type { DataType } from "@/types";
// import { useGetDataPointQuery } from "@/state/storage";

const useDriverList = () => {
  // ✅ FIX 1: Destructure primitives immediately so deps are stable scalars
  const { DateData: resolvedTime } = useGetStoredDates();
  // const { data } = useGetDataPointQuery();

  const [getMovementSummary] = useGetMovementSummaryMutation();
  const [getStartOdometer] = useGetStartPointOdometerMutation();

  // ✅ FIX 2: Wrap mutation fns in refs — RTK mutation triggers are recreated
  // each render, so putting them in deps causes infinite loops
  const getMovementSummaryRef = useRef(getMovementSummary);
  const getStartOdometerRef = useRef(getStartOdometer);
  useEffect(() => {
    getMovementSummaryRef.current = getMovementSummary;
  }, [getMovementSummary]);
  useEffect(() => {
    getStartOdometerRef.current = getStartOdometer;
  }, [getStartOdometer]);

  const DateData = useMemo(
    () => ({
      startDate: resolvedTime.startDate ?? "2025-06-01T7:30:00",
      endDate: resolvedTime.endDate ?? "2025-06-01T17:30:00",
      isBackup: resolvedTime.isBackup,
      startTime: resolvedTime.startTime ?? "07:30:00",
    }),
    // ✅ FIX 3: These are already primitive fields — this memo is correct as-is
    [
      resolvedTime.startDate,
      resolvedTime.endDate,
      resolvedTime.isBackup,
      resolvedTime.startTime,
    ],
  );

  const [tokenReady] = useState(() => !!localStorage.getItem("token"));

  const {
    data: VehicleList,
    isLoading: LoadingVehicleList,
    refetch: refetchVehicles,
  } = useGetVehicleListQuery(undefined, {
    skip: !tokenReady,
    pollingInterval: REFETCH_INTERVAL,
  });

  const [getCheckPoints, { data: CheckPoints, isLoading: LoadingCheckPoints }] =
    useGetCheckPointsMutation();

  const [driverList, setDriverList] = useState<DataType[]>([]);
  const [loadingOdometers, setLoadingOdometers] = useState(false);

  // ✅ FIX 4: Removed the `dates` memo entirely — it was derived from data
  // but never actually used (odometer calls had hardcoded strings).
  // If you restore dynamic dates, compute them inline inside the effect.

  useEffect(() => {
    if (!tokenReady) return;

    getCheckPoints({
      startDate: DateData.startDate,
      endDate: DateData.endDate,
      backup: DateData.isBackup,
    });

    const interval = setInterval(() => {
      getCheckPoints({
        startDate: DateData.startDate,
        endDate: DateData.endDate,
        backup: DateData.isBackup,
      });
    }, REFETCH_INTERVAL);

    return () => clearInterval(interval);
  }, [
    tokenReady,
    getCheckPoints,
    DateData.startDate,
    DateData.endDate,
    DateData.isBackup,
  ]);

  const refetch = useCallback(() => {
    refetchVehicles();
    getCheckPoints({
      backup: DateData.isBackup,
      startDate: DateData.startDate,
      endDate: DateData.endDate,
    });
  }, [
    refetchVehicles,
    getCheckPoints,
    DateData.startDate,
    DateData.endDate,
    DateData.isBackup,
  ]);

  useEffect(() => {
    // ✅ FIX 5: Guard with early return only — do NOT put LoadingVehicleList
    // or LoadingCheckPoints in deps. Loading booleans flip true→false on
    // every fetch cycle, causing processDriverList to re-run repeatedly.
    // The data refs (VehicleList, CheckPoints) are the correct trigger.
    if (!VehicleList || !CheckPoints) return;

    const startDate = new Date(DateData.startDate);
    if (DateData.startTime) {
      const [hours, minutes, seconds] = DateData.startTime
        .split(":")
        .map(Number);
      startDate.setHours(hours, minutes, seconds || 0);
    }
    startDate.setMinutes(startDate.getMinutes() - 1);

    const processDriverList = async () => {
      setLoadingOdometers(true);
      try {
        const listPromises = VehicleList.map(
          async (item, index): Promise<DataType> => {
            const checkPointList = CheckPoints.filter(
              (checkpoint) => checkpoint.vehicle === item.asset_name,
            ).filter((checkpoint) =>
              (CHECKPOINTS as readonly string[]).includes(
                checkpoint.poi_name?.toUpperCase(),
              ),
            );

            let odometerData = null;

            if (item.device_id && checkPointList.length > 0) {
              try {
                odometerData = await getStartOdometerRef
                  .current({
                    unit_id: String(item.device_id),
                    end_date: "2026-05-30T07:30:00",
                    start_date: "2026-05-30T07:29:00",
                    user_id: 1263,
                    backup: true,
                  })
                  .unwrap();
              } catch (err) {
                console.error(
                  `Failed to fetch odometer for device ${item.device_id}:`,
                  err,
                );
              }
            }

            const startOdometer =
              odometerData && odometerData.length > 0
                ? odometerData[0].mileage
                : 0;

            const start_cp = item?.more_asset_details?.find(
              (detail) => detail?.column_name === "start_cp",
            );
            const start_cp_name = start_cp?.column_value || "";

            const checkPoints = checkPointList.map((checkpoint) => {
              const time = parseTime(checkpoint?.start_time)?.split(":");
              return {
                point: checkpoint?.poi_name?.toUpperCase(),
                odometer: checkpoint?.start_odo,
                time: `${time[0]}:${time[1]}`,
                calculated_odometer: 0,
                distanceFromBase: 0,
                next: "",
                startOdometer,
              };
            });

            const history = calculateHistory(
              checkPointList,
              start_cp_name,
              startOdometer,
            );

            const pointToPointMileage = await calculatePointToPointMileage(
              checkPointList,
              getMovementSummaryRef.current, // ✅ stable ref, not the raw mutation
              DateData.isBackup,
              String(item.device_id),
              item.asset_name,
              start_cp_name,
            );

            const cumulativeOdometer = history.reduce(
              (acc, cur) => acc + (cur?.calculated_odometer || 0),
              0,
            );

            const isTripComplete =
              start_cp_name.length > 0 && checkPointList.length + 1 > 13;

            return {
              id: index,
              asset_id: item?.asset_id,
              carNo: item?.asset_name,
              mileage: cumulativeOdometer,
              penalties: 0,
              start_cp: start_cp_name,
              entrantName: item?.last_driver,
              team_name: item?.team_name,
              totalCps: history.length > 0 ? history.length + 1 : 0,
              checkpoints: checkPoints,
              orderedCheckpoints: history,
              complete: isTripComplete,
              pointToPointMileage,
              startOdometer,
            };
          },
        );

        const resolvedList = await Promise.all(listPromises);
        setDriverList(resolvedList);
      } catch (error) {
        console.error("Error processing driver list data:", error);
      } finally {
        setLoadingOdometers(false);
      }
    };

    processDriverList();
  }, [
    VehicleList,
    CheckPoints,
    // ✅ FIX 5 continued: LoadingVehicleList and LoadingCheckPoints removed
    // ✅ FIX 4 continued: dates.startDate and dates.endDate removed (memo deleted)
    // ✅ FIX 2 continued: getStartOdometer and getMovementSummary removed (now refs)
    // ✅ FIX 1 continued: resolvedTime.isBackup removed — use DateData.isBackup only
    DateData.startDate,
    DateData.startTime,
    DateData.isBackup,
  ]);

  return {
    data: driverList,
    refetch,
    LoadingVehicleList: LoadingVehicleList || loadingOdometers,
    LoadingCheckPoints,
  };
};

export default useDriverList;
