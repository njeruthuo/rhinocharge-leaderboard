// import useMileageResults from "@/hooks/useMileageResults";

// import useDriverList from "@/hooks/useDriverList";

const MileageResults = () => {
  // const { data } = useDriverList();

  // console.log(data, "data");

  return (
    <div
      className="text-stone-100  px-4"
      // className={`${showHeader ? "min-h-screen py-4" : "max-h-[85vh]"} text-stone-100  px-4`}
      style={{
        background: "#FBFBFB",
        backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(217,119,6,0.025) 39px, rgba(217,119,6,0.025) 40px),
            repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(217,119,6,0.025) 39px, rgba(217,119,6,0.025) 40px),
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(217,119,6,0.07) 0%, transparent 70%)
          `,
        position: "relative",
        zIndex: 2,
      }}
    >
      <h3 className="text-black">MileageResults</h3>
    </div>
  );
};
export default MileageResults;
