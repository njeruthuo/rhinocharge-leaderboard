import { useGetDataPointQuery } from "@/state/storage";
import type { DateDataType } from "@/types";

const useGetStoredDates = () => {
  const { data: DateData } = useGetDataPointQuery();
  const data: DateDataType = {
    startDate: DateData?.start_date.replace(" ", "T"),
    endDate: DateData?.end_date.replace(" ", "T"),
    isBackup: DateData?.backup_status ?? false,
    startTime: DateData?.start_cp_time ?? "",
  };
  return { DateData: data, isUpdate: DateData !== undefined };
};
export default useGetStoredDates;
