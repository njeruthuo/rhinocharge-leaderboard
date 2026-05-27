import { useGetMovementSummaryMutation } from "@/state/rhinoApi";
import { useEffect } from "react";
import useGetStoredDates from "./useGetStoredDates";

const useMileageResults = () => {
  const [getMovementSummary, { data }] = useGetMovementSummaryMutation();
  const { DateData } = useGetStoredDates();

  const startDate = DateData?.startDate;
  const endDate = DateData?.endDate;
  const isBackup = DateData?.isBackup;

  useEffect(() => {
    getMovementSummary({ startDate, endDate, isBackup });
  }, [getMovementSummary, startDate, endDate, isBackup]);

  return { data };
};
export default useMileageResults;
