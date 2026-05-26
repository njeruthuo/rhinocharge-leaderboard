import { useGetPoisMutation } from "@/state/rhinoApi";
import { useEffect } from "react";

const useGetCheckpointLocations = () => {
  const [getPois, { data, isLoading }] = useGetPoisMutation();

  useEffect(() => {
    getPois();
  }, [getPois]);

  const PoiList = data?.map((item) => ({
    key: item.town_name,
    location: {
      lat: item?.the_geom.coordinates?.[1],
      lng: item?.the_geom.coordinates?.[0],
    },
    // location:  { lat: -33.8567844, lng: 151.213108 },
  }));

  return { data: PoiList, isLoading };
};
export default useGetCheckpointLocations;
