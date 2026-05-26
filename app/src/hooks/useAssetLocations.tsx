import { useGetAssetLocationsQuery } from "@/state/rhinoApi";
// import type { Poi } from "@/state/types";

const useAssetLocations = () => {
  const { data, isLoading } = useGetAssetLocationsQuery();

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
