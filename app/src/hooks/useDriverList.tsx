import { REFETCH_INTERVAL } from "@/constants";
import {
  useGetCheckPointsMutation,
  useGetVehicleListQuery,
} from "@/state/rhinoApi";
import { getParsedTime } from "@/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const useDriverList = () => {
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
      getCheckPoints();
    }
  }, [tokenReady, getCheckPoints]);

  useEffect(() => {
    if (!tokenReady) return;
    const interval = setInterval(() => {
      getCheckPoints();
    }, REFETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [tokenReady, getCheckPoints]);

  const refetch = useCallback(() => {
    refetchVehicles();
    getCheckPoints();
  }, [refetchVehicles, getCheckPoints]);

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

      const checkPoints = checkPointList.map((checkpoint) => ({
        point: checkpoint?.poi_name?.toUpperCase(),
        odometer: checkpoint?.start_odo,
        time: getParsedTime(checkpoint?.start_time),
        next: "",
      }));

      return {
        id: index,
        asset_id: item?.asset_id,
        carNo: item?.asset_name,
        mileage: item?.realOdometer,
        penalties: 0,
        start_cp: item?.more_asset_details?.find(
          (item) => item?.column_name === "start_cp",
        )?.column_value,
        entrantName: item?.last_driver,
        team_name: item?.team_name,
        totalCps: checkPointList.length,
        checkpoints: checkPoints,
      };
    });
  }, [VehicleList, CheckPoints, LoadingVehicleList, LoadingCheckPoints]);

  return { data: driverList, refetch, LoadingVehicleList, LoadingCheckPoints };
};

export default useDriverList;
