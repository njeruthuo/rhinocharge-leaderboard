import { REFETCH_INTERVAL } from "@/constants";
import {
  useGetCheckPointsMutation,
  useGetVehicleListQuery,
  useGetStartPointOdometerMutation,
  useGetMovementSummaryMutation,
} from "@/state/rhinoApi";
import {
  calculateHistory,
  calculatePointToPointMileage,
  formatDate,
  parseTime,
} from "@/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import useGetStoredDates from "./useGetStoredDates";
import type { DataType } from "@/types";
import { useGetDataPointQuery } from "@/state/storage";
// import useMileageResults from "./useMileageResults";

const useDriverList = () => {
  const { DateData: resolvedTime } = useGetStoredDates();
  const { data } = useGetDataPointQuery();

  // const { data: MileageResults } = useMileageResults();
  const [getMovementSummary] = useGetMovementSummaryMutation();

  const DateData = useMemo(
    () => ({
      startDate: resolvedTime.startDate ?? "2025-06-01T7:30:00",
      endDate: resolvedTime.endDate ?? "2025-06-01T17:30:00",
      isBackup: resolvedTime.isBackup,
      startTime: resolvedTime.startTime ?? "07:30:00",
    }),
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

  // Bring the odometer mutation trigger to the top level
  const [getStartOdometer] = useGetStartPointOdometerMutation();

  // State to store processed drivers and extra loading indicator
  const [driverList, setDriverList] = useState<DataType[]>([]);
  const [loadingOdometers, setLoadingOdometers] = useState(false);

  const dates = useMemo(() => {
    const startDate = new Date(data?.start_date ?? "");
    const endDate = new Date(data?.start_date ?? "");
    startDate.setMinutes(startDate.getMinutes() - 1);

    return { startDate: formatDate(startDate), endDate: formatDate(endDate) };
  }, [data]);

  // Polling for checkpoints (Cleaned up: Only 1 interval setup now)
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
    if (
      LoadingVehicleList ||
      LoadingCheckPoints ||
      !VehicleList ||
      !CheckPoints
    ) {
      return;
    }

    // const fromDate = new Date(DateData?.startDate);
    const startDate = new Date(DateData?.startDate);
    if (DateData?.startTime) {
      // Split "07:31:00" into [7, 31, 0]
      const [hours, minutes, seconds] = DateData.startTime
        .split(":")
        .map(Number);
      // setHours sets hours, minutes, and seconds all at once
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
            );

            let odometerData = null;

            if (item.device_id && checkPointList.length > 0) {
              try {
                odometerData = await getStartOdometer({
                  unit_id: String(item.device_id),
                  end_date: "2026-05-30T07:30:00",
                  start_date: "2026-05-30T07:29:00",
                  // start_date: formatDate(fromDate),
                  // end_date: formatDate(startDate),
                  user_id: 1263,
                  backup: true,
                }).unwrap();
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
                startOdometer: startOdometer,
              };
            });

            const history = calculateHistory(
              checkPointList,
              start_cp_name,
              startOdometer,
            );

            const pointToPointMileage = await calculatePointToPointMileage(
              checkPointList,
              getMovementSummary,
              resolvedTime.isBackup, // get the start time here for the first CP
              String(item.device_id),
              item.asset_name,
            );

            const cumulativeOdometer = history.reduce(
              (accumulator, currentItem) => {
                return accumulator + (currentItem?.calculated_odometer || 0);
              },
              0,
            );

            const isTripComplete =
              start_cp_name.length > 0 && checkPointList.length > 13;

            return {
              id: index,
              asset_id: item?.asset_id,
              carNo: item?.asset_name,
              mileage: cumulativeOdometer,
              penalties: 0,
              start_cp: start_cp_name,
              entrantName: item?.last_driver,
              team_name: item?.team_name,
              totalCps: history.length,
              checkpoints: checkPoints,
              orderedCheckpoints: history,
              complete: isTripComplete,
              // pointToPointMileage: [] as unknown as PointToPointType,
              pointToPointMileage: pointToPointMileage,
              startOdometer: startOdometer,
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
    LoadingVehicleList,
    LoadingCheckPoints,
    getStartOdometer,
    dates.endDate,
    dates.startDate,
    resolvedTime.isBackup,
    getMovementSummary,
    DateData?.startDate,
    DateData.startTime,
  ]);

  return {
    data: driverList,
    refetch,
    LoadingVehicleList: LoadingVehicleList || loadingOdometers,
    LoadingCheckPoints,
  };
};

export default useDriverList;
