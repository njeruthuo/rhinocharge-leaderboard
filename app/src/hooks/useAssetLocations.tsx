import { REFETCH_INTERVAL } from "@/constants";
import { useGetAssetLocationsQuery } from "@/state/rhinoApi";
import { useEffect } from "react";
// import type { Poi } from "@/state/types";

const useAssetLocations = () => {
  const { data, isLoading, refetch } = useGetAssetLocationsQuery();

  useEffect(() => {
    refetch();

    const interval = setInterval(() => {
      refetch();
    }, REFETCH_INTERVAL);

    return () => clearInterval(interval);
  }, [refetch]);

  const assetLocations = data?.map((item) => ({
    time: item.fixtime,
    key: item.reg_no,
    location: {
      lat: item?.latitude,
      lng: item?.longitude,
    },
  }));

  return { assetLocations, isLoading };
};
export default useAssetLocations;

export type AssetLocationType = {
  time: string;
  key: string;
  location: {
    lat: number;
    lng: number;
  };
}[];
