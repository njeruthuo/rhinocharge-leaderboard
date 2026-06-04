const ActionButton = ({
  clickHandler,
  isLoading,
  text,
  textLoading,
}: ActionButtonProps) => {
  return (
    <div className="flex items-center space-x-2 shrink-0 sm:mb-6">
      <button
        onClick={clickHandler}
        // onClick={() => setOpenFilter(false)}
        disabled={isLoading}
        className="flex-1 rounded-lg py-2 text-xs font-black tracking-wider uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-4 w-full hover:cursor-pointer bg-amber-600 hover:bg-amber-700 text-white rounded-md py-1.5 font-medium transition-colors shadow-sm px-2"
        style={{
          background: "rgba(217,119,6,0.18)",
          color: "#D97706",
          border: "1px solid rgba(217,119,6,0.3)",
          fontFamily: "'Oswald', sans-serif",
        }}
      >
        {isLoading ? textLoading : text}
      </button>
    </div>
  );
};
export default ActionButton;

type ActionButtonProps = {
  clickHandler: () => void;
  isLoading: boolean;
  text: string;
  textLoading: string;
};
