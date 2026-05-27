import useMileageResults from "@/hooks/useMileageResults";

const MileageResults = () => {
  const { data } = useMileageResults();
  console.log(data, "data");

  return <div>MileageResults</div>;
};
export default MileageResults;
