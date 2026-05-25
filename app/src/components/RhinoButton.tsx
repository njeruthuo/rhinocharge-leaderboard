const RhinoButton = ({ onClick, loading, disabled }: RhinoButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 rounded-lg py-2 text-xs font-black tracking-wider uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white rounded-md py-1.5 text-sm font-medium transition-colors shadow-sm px-2"
      style={{
        background: "rgba(217,119,6,0.18)",
        color: "#D97706",
        border: "1px solid rgba(217,119,6,0.3)",
        fontFamily: "'Oswald', sans-serif",
      }}
    >
      {loading ? "Generating..." : "Generate report"}
    </button>
  );
};
export default RhinoButton;

interface RhinoButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}
