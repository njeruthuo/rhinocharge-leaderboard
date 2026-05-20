import { useGetDataPointQuery } from "@/state/storage";

const useGetStoredDates = () => {
  const { data: DateData } = useGetDataPointQuery(1);
  const data = {
    startDate: DateData?.start_date.replace(" ", "T"),
    endDate: DateData?.end_date.replace(" ", "T"),
    isBackup: DateData?.backup_status ?? false,
  };
  return { DateData: data, isUpdate: DateData !== undefined };
};
export default useGetStoredDates;
