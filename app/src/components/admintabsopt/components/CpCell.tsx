function CpCell({
  isSelected,
  onSelect,
}: {
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <td className="text-center px-1 py-2">
      <div className="flex items-center justify-center">
        <label className="cursor-pointer relative flex items-center justify-center w-6 h-6">
          <input
            type="radio"
            checked={isSelected}
            onChange={() => onSelect()}
            className="sr-only"
          />
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            className="w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center"
            style={{
              borderColor: isSelected ? "#38bdf8" : "rgba(28,25,23,0.7)",
              background: isSelected ? "rgba(28,25,23,0.7)" : "transparent",
            }}
          >
            {isSelected && (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#38bdf8" }}
              />
            )}
          </div>
        </label>
      </div>
    </td>
  );
}

export default CpCell;
