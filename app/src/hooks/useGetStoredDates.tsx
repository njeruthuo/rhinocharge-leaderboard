import { useGetDataPointQuery } from "@/state/storage";

const useGetStoredDates = () => {
  const { data: DateData } = useGetDataPointQuery(1);
  const data = {
    startDate: DateData?.start_date.replace(" ", "T") ?? "2025-05-30T07:30:00",
    endDate: DateData?.end_date.replace(" ", "T") ?? "2025-06-01T17:30:00",
    isBackup: DateData?.backup_status ?? false,
  };
  return { DateData: data, isUpdate: DateData !== undefined };
};
export default useGetStoredDates;
