import { useState } from "react";
import {
  useCreateDataPointMutation,
  useUpdateDataPointMutation,
} from "@/state/storage";

interface RaceSettingsProps {
  isUpdate: boolean;
  recordId?: number;
  value?: { startDate: string; endDate: string; isBackup: boolean };
  onChange: (name: string, value: string | boolean) => void;
}

function RaceSettingsTrigger({ value, onChange, isUpdate }: RaceSettingsProps) {
  const [updateDataPoint, { isLoading: LoadingUpdatePoint }] =
    useUpdateDataPointMutation();
  const [open, setOpen] = useState(false);

  const [createDataPoint, { isLoading: LoadingCreatingPoint }] =
    useCreateDataPointMutation();

  async function handleConfirm() {
    try {
      if (isUpdate) {
        await updateDataPoint({
          id: 1,
          start_date: value?.startDate,
          end_date: value?.endDate,
          backup_status: value?.isBackup,
        }).unwrap();
      } else {
        await createDataPoint({
          start_date: value?.startDate ?? "",
          end_date: value?.endDate ?? "",
          backup_status: value?.isBackup ?? false,
        }).unwrap();
      }
      // onChange?.({ ...computedRange, isBackup });
      setOpen(false);
    } catch (err) {
      console.error("Failed to update race settings:", err);
    }
  }

  return (
    <>
      <style>{`
        input[type="date"].dp-input::-webkit-calendar-picker-indicator {
          filter: invert(0.85); cursor: pointer;
        }
      `}</style>

      <div className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Race settings"
          className="flex items-center justify-center w-9 h-9 rounded-full border transition-all"
          style={{
            borderColor: "rgba(217,119,6,0.4)",
            background: open ? "rgba(217,119,6,0.2)" : "rgba(217,119,6,0.08)",
            color: "#D97706",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            <div
              className="absolute right-0 top-full mt-2 z-50 rounded-xl border p-4 flex flex-col gap-3"
              style={{
                minWidth: 268,
                background: "#1C1917",
                borderColor: "rgba(217,119,6,0.35)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
              }}
            >
              {/* Date picker */}
              <div>
                <label
                  className="block text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-1.5"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  Start date
                </label>
                <input
                  type="date"
                  value={value?.startDate?.split("T")[0] ?? ""}
                  name="startDate"
                  onChange={(e) =>
                    onChange("startDate", `${e.target.value}T7:30:00`)
                  }
                  className="dp-input w-full rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#e7e5e4",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-[9px] uppercase tracking-widest text-stone-400 font-bold mb-1.5"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  End date
                </label>
                <input
                  type="date"
                  value={value?.endDate?.split("T")[0] ?? ""}
                  name="endDate"
                  // onChange={(e) => setSelectedDate(e.target.value)}
                  onChange={(e) =>
                    onChange("endDate", `${e.target.value}T17:30:00`)
                  }
                  className="dp-input w-full rounded-lg px-3 py-2 text-sm outline-none border"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderColor: "rgba(255,255,255,0.1)",
                    color: "#e7e5e4",
                  }}
                />
              </div>

              {/* Fixed time banner */}
              <div className="p-2.5 rounded-lg border text-[10px] text-stone-400 bg-stone-900/50 border-stone-800">
                <div className="flex justify-between items-center mb-1">
                  <span>Race open</span>
                  <strong className="text-emerald-500 font-mono">
                    07:30 AM
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Race close</span>
                  <strong className="text-amber-600 font-mono">05:30 PM</strong>
                </div>
              </div>

              {/* Backup toggle */}
              <div
                className="flex items-center gap-3 p-2.5 rounded-lg border"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderColor: "rgba(255,255,255,0.07)",
                }}
              >
                <button
                  role="switch"
                  aria-checked={value?.isBackup}
                  onClick={() => onChange("isBackup", !value?.isBackup)}
                  className="relative flex-shrink-0 rounded-full transition-colors duration-200"
                  style={{
                    width: 34,
                    height: 19,
                    background: value?.isBackup ? "#d97706" : "#44403c",
                  }}
                >
                  <span
                    className="absolute top-0.5 left-0.5 w-[15px] h-[15px] rounded-full bg-white transition-transform duration-200"
                    style={{
                      transform: value?.isBackup
                        ? "translateX(15px)"
                        : "translateX(0)",
                    }}
                  />
                </button>
                <div>
                  <p className="text-xs font-semibold text-stone-200 leading-none">
                    Backup mode
                  </p>
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Mark competition as backup
                  </p>
                </div>
              </div>

              {/* Footer */}
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
                  disabled={
                    LoadingUpdatePoint ||
                    LoadingCreatingPoint ||
                    !value?.endDate ||
                    !value.startDate
                  }
                  className="flex-1 rounded-lg py-2 text-xs font-black tracking-wider uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "rgba(217,119,6,0.18)",
                    color: "#D97706",
                    border: "1px solid rgba(217,119,6,0.3)",
                    fontFamily: "'Oswald', sans-serif",
                  }}
                >
                  {LoadingUpdatePoint || LoadingCreatingPoint
                    ? "Syncing..."
                    : "Lock in"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default RaceSettingsTrigger;
