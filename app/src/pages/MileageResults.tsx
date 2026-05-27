import useMileageResults from "@/hooks/useMileageResults";

const MileageResults = () => {
  const { data } = useMileageResults();

  const capturedCheckpoints = data?.map((item) => item.currentLocation);

  console.log(new Set(capturedCheckpoints), "capturedCheckpoints");

  return <div>MileageResults</div>;
};
export default MileageResults;
