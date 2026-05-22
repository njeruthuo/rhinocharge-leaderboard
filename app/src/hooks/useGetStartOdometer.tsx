import {
  useGetStartPointOdometerMutation,
} from "@/state/rhinoApi";
import type { OdometerType } from "@/types";
import { useEffect, useState } from "react";

const useGetStartOdometer = ({ unitId }: { unitId: string | number }) => {
  const [getStartOdometer, { isLoading, isError, error }] =
    useGetStartPointOdometerMutation();
  const [odometer, setOdometer] = useState<OdometerType[] | null>(null); // Initialized to null instead of an empty object

  useEffect(() => {
    if (!unitId) return;

    const fetchOdometer = async () => {
      try {
        // .unwrap() extracts the raw server payload directly from the RTK Query promise
        const response = await getStartOdometer({
          unit_id: String(unitId), // Dynamically using the prop passed in
          start_date: "2026-05-20 07:00:00",
          end_date: "2026-05-20 07:05:00",
          user_id: 1263,
          backup: true,
        }).unwrap();

        // This now runs asynchronously AFTER the server responds, which React allows safely!
        setOdometer(response);
      } catch (err) {
        console.error("Failed to fetch odometer data:", err);
      }
    };

    fetchOdometer();
  }, [getStartOdometer, unitId]);

  // Expose loading and error states from RTK Query so your UI can show spinners or errors
  return { odometer, isLoading, isError, error };
};

export default useGetStartOdometer;
