import { REFETCH_INTERVAL } from "@/constants";
import {
  useGetCheckPointsMutation,
  useGetVehicleListQuery,
} from "@/state/rhinoApi";
import { calculateHistory, parseTime } from "@/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import useGetStoredDates from "./useGetStoredDates";

const useDriverList = () => {
  const { DateData: resolvedTime } = useGetStoredDates();

  const DateData = useMemo(
    () => ({
      startDate: resolvedTime.startDate ?? "2025-06-01T7:30:00",
      endDate: resolvedTime.endDate ?? "2025-06-01T17:30:00",
      isBackup: resolvedTime.isBackup,
    }),
    [resolvedTime.startDate, resolvedTime.endDate, resolvedTime.isBackup],
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

  useEffect(() => {
    if (!tokenReady) return;

    // Fire immediately when dates change
    getCheckPoints({
      startDate: DateData.startDate,
      endDate: DateData.endDate,
      backup: DateData.isBackup,
    });

    // Then keep polling
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

  useEffect(() => {
    if (!tokenReady) return;
    const interval = setInterval(() => {
      getCheckPoints({
        backup: DateData.isBackup,
        startDate: DateData.startDate,
        endDate: DateData.endDate,
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

  const driverList = useMemo(() => {
    if (
      LoadingVehicleList ||
      LoadingCheckPoints ||
      !VehicleList ||
      !CheckPoints
    ) {
      return [];
    }

    return VehicleList.map((item, index): DataType => {
      const checkPointList = CheckPoints.filter(
        (checkpoint) => checkpoint.vehicle === item.asset_name,
      );

      console.log(checkPointList, "checkPointList");

      const start_cp =
        item?.more_asset_details?.find(
          (item) => item?.column_name === "start_cp",
        )?.column_value || "";

      const checkPoints = checkPointList.map((checkpoint) => {
        const time = parseTime(checkpoint?.start_time)?.split(":");
        return {
          point: checkpoint?.poi_name?.toUpperCase(),
          odometer: checkpoint?.start_odo,
          time: `${time[0]}:${time[1]}`,
          calculated_odometer: 0,
          distanceFromBase: 0,
          next: "",
        };
      });

      const history = calculateHistory(checkPointList, start_cp);

      const cumulativeOdometer = history.reduce((accumulator, currentItem) => {
        return accumulator + (currentItem.calculated_odometer || 0);
      }, 0);

      return {
        id: index,
        asset_id: item?.asset_id,
        carNo: item?.asset_name,
        mileage: cumulativeOdometer,
        penalties: 0,
        start_cp: start_cp,
        entrantName: item?.last_driver,
        team_name: item?.team_name,
        totalCps: checkPointList.length,
        checkpoints: checkPoints,
        orderedCheckpoints: calculateHistory(checkPointList, start_cp),
      };
    });
  }, [VehicleList, CheckPoints, LoadingVehicleList, LoadingCheckPoints]);

  return { data: driverList, refetch, LoadingVehicleList, LoadingCheckPoints };
};

export default useDriverList;

export const getSpecificTime = (hours = 0, minutes = 0, seconds = 0) => {
  const now = new Date();
  now.setHours(hours, minutes, seconds, 0);

  const datePart = now.toLocaleDateString("en-CA");
  const timePart = now.toTimeString().split(" ")[0];

  return `${datePart} ${timePart}`;
};

export type DataType = {
  id: number | string;
  asset_id: number;
  carNo: string;
  mileage: number;
  penalties: number;
  start_cp: string;
  entrantName: string;
  team_name: string;
  totalCps: number;
  checkpoints: {
    point: string;
    odometer: number;
    time: string;
    calculated_odometer: number;
    distanceFromBase: number | undefined;
    next: string;
  }[];
  orderedCheckpoints: {
    point: string;
    odometer: number;
    time: string;
    calculated_odometer: number;
    next: string;
    startOdometer: number | undefined;
    distanceFromBase: number | undefined;
  }[];
};
