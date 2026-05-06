import { useState } from "react";

function TimePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (time: string) => void;
}) {
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    setOpen(false);
  }

  return (
    <>
      <style>{`
        input[type="time"].tp-input::-webkit-calendar-picker-indicator {
          filter: invert(0.45);
          cursor: pointer;
        }
      `}</style>

      <div className="relative">
        {/* Trigger */}
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-full border"
          style={{
            borderColor: "rgba(217,119,6,0.4)",
            background: "rgba(217,119,6,0.08)",
            fontFamily: "'Oswald', sans-serif",
          }}
        >
          <span
            className="text-sm font-bold tracking-wider"
            style={{ color: "#D97706" }}
          >
            {value}
          </span>

          <span
            className="text-[9px] uppercase font-bold tracking-widest"
            style={{ color: "#D97706", opacity: 0.7 }}
          >
            Time
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <div
              className="absolute right-0 top-full mt-2 z-50 rounded-xl border p-4"
              style={{
                minWidth: 220,
                background: "#1C1917",
                borderColor: "rgba(217,119,6,0.35)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
              }}
            >
              <input
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="tp-input rounded-lg px-3 py-2 text-sm outline-none w-full"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e7e5e4",
                }}
              />

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg py-2 text-xs font-bold"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    color: "#78716c",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleConfirm}
                  className="flex-1 rounded-lg py-2 text-xs font-bold"
                  style={{
                    background: "rgba(217,119,6,0.18)",
                    color: "#D97706",
                  }}
                >
                  Set
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default TimePicker;
