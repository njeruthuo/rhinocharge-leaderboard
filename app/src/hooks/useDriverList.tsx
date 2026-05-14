import { REFETCH_INTERVAL } from "@/constants";
import {
  useGetCheckPointsMutation,
  useGetVehicleListQuery,
} from "@/state/rhinoApi";
import type { GetPoiPayload } from "@/state/types";
import { calculateHistory, parseTime } from "@/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const useDriverList = ({ startDate, endDate }: GetPoiPayload) => {
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
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    if (tokenReady) {
      getCheckPoints({ startDate, endDate });
    }
  }, [tokenReady, getCheckPoints, startDate, endDate]);

  useEffect(() => {
    if (!tokenReady) return;
    const interval = setInterval(() => {
      getCheckPoints({ startDate, endDate });
    }, REFETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [tokenReady, getCheckPoints, startDate, endDate]);

  const refetch = useCallback(() => {
    refetchVehicles();
    getCheckPoints({ startDate, endDate });
  }, [refetchVehicles, getCheckPoints, startDate, endDate]);

  const driverList = useMemo(() => {
    if (
      LoadingVehicleList ||
      LoadingCheckPoints ||
      !VehicleList ||
      !CheckPoints
    ) {
      return [];
    }

    return VehicleList.map((item, index) => {
      const checkPointList = CheckPoints.filter(
        (checkpoint) => checkpoint.vehicle === item.asset_name,
      );

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
          next: "",
        };
      });

      return {
        id: index,
        asset_id: item?.asset_id,
        carNo: item?.asset_name,
        mileage: item?.realOdometer,
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
