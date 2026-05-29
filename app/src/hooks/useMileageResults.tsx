import { useGetMovementSummaryMutation } from "@/state/rhinoApi";
import { useEffect } from "react";
import useGetStoredDates from "./useGetStoredDates";

const useMileageResults = () => {
  const [getMovementSummary, { data }] = useGetMovementSummaryMutation();
  const { DateData } = useGetStoredDates();

  const startDate = DateData?.startDate;
  const endDate = DateData?.endDate;
  const isBackup = DateData?.isBackup;
  const startTime = DateData?.startTime;

  useEffect(() => {
    getMovementSummary({ startDate, endDate, isBackup, startTime });
  }, [getMovementSummary, startDate, endDate, isBackup, startTime]);

  return { data };
};
export default useMileageResults;
