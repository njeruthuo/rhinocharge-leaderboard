import { useUpdateStartTimeMutation } from "@/state/rhinoApi";
import { useMemo, useState } from "react";

interface DateRangePickerProps {
  // Receives an object containing both ISO bounds, or single values managed by parent
  value?: { startDate: string; endDate: string };
  onChange: (range: { startDate: string; endDate: string }) => void;
}

function RaceDatePicker({ value, onChange }: DateRangePickerProps) {
  const [updateStartTime, { isLoading }] = useUpdateStartTimeMutation();
  const [open, setOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(() => {
    if (value?.startDate) {
      return value.startDate.split("T")[0];
    }
    return new Date().toISOString().split("T")[0];
  });

  const displayLabel = useMemo(() => {
    if (!selectedDate) return "Select Race Day";
    try {
      const formatted = new Date(selectedDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      return formatted;
    } catch {
      return selectedDate;
    }
  }, [selectedDate]);

  const computedRange = useMemo(() => {
    if (!selectedDate) return null;
    return {
      startDate: `${selectedDate}T07:30:00`,
      endDate: `${selectedDate}T17:30:00`,
    };
  }, [selectedDate]);

  const handleDateChange = (dateString: string) => {
    setSelectedDate(dateString);
  };

  async function handleConfirm() {
    if (!computedRange) return;

    try {
      // Execute backend API updates passing the full structural payload bounds
      await updateStartTime({
        asset_id: 0,
        column_id: 2,
        column_value: JSON.stringify(computedRange), // stringified or raw depending on API requirements
      }).unwrap();

      // Bubble the calculated range coordinates up to parent states
      onChange(computedRange);
      setOpen(false);
    } catch (error) {
      console.error("Failed to commit race timeline boundaries:", error);
    }
  }

  return (
    <>
      <style>{`
        input[type="date"].dp-input::-webkit-calendar-picker-indicator {
          filter: invert(0.85);
          cursor: pointer;
        }
      `}</style>

      <div className="relative">
        {/* Trigger Display */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-3 px-4 py-2 rounded-full border transition-all"
          style={{
            borderColor: "rgba(217,119,6,0.4)",
            background: "rgba(217,119,6,0.08)",
            fontFamily: "'Oswald', sans-serif",
          }}
        >
          <span
            className="text-xs font-bold tracking-wider"
            style={{ color: "#D97706" }}
          >
            {displayLabel}
          </span>

          <span
            className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded bg-[#D97706] text-stone-900"
            style={{ minWidth: "44px" }}
          >
            7:30-17:30
          </span>
        </button>

        {/* Picker Dropdown Module */}
        {open && (
          <>
            {/* Overlay Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Menu Panel */}
            <div
              className="absolute right-0 top-full mt-2 z-50 rounded-xl border p-4 flex flex-col gap-3"
              style={{
                minWidth: 260,
                background: "#1C1917",
                borderColor: "rgba(217,119,6,0.35)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
              }}
            >
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-1">
                  Competition Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="dp-input rounded-lg px-3 py-2 text-sm outline-none w-full border"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#e7e5e4",
                  }}
                />
              </div>

              {/* Readonly Confirmation Context Banner */}
              <div className="p-2.5 rounded-lg border text-[10px] text-stone-400 bg-stone-900/50 border-stone-800">
                <div className="flex justify-between items-center mb-1">
                  <span>Race Open:</span>
                  <strong className="text-emerald-500 font-mono">
                    07:30 AM
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Race Close:</span>
                  <strong className="text-amber-600 font-mono">05:30 PM</strong>
                </div>
              </div>

              {/* Layout Footer Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg py-2 text-xs font-bold transition-colors hover:bg-white/5"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    color: "#78716c",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={isLoading || !selectedDate}
                  className="flex-1 rounded-lg py-2 text-xs font-black tracking-wider uppercase transition-colors"
                  style={{
                    background: "rgba(217,119,6,0.18)",
                    color: "#D97706",
                    border: "1px solid rgba(217,119,6,0.3)",
                  }}
                >
                  {isLoading ? "Syncing..." : "Lock Date"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default RaceDatePicker;
