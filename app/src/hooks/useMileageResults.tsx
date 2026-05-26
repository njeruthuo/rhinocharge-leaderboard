import { useGetMovementSummaryMutation } from "@/state/rhinoApi";
import { useEffect } from "react";

const useMileageResults = () => {
  const [getMovementSummary, { data }] = useGetMovementSummaryMutation();

  useEffect(() => {
    getMovementSummary();
  }, [getMovementSummary]);

  //   console.log(data, "Movement summary data");

  return { data };
};
export default useMileageResults;
