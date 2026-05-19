import type { AdminTabsProps, TabType } from "@/types";

export function AdminTabs({ tabs, activeTab, onChange }: AdminTabsProps) {
  return (
    <div className="w-full mb-6">
      <div
        className="flex items-center gap-1 p-1 rounded-xl border overflow-x-auto scrollbar-none"
        style={{
          borderBottomColor: "rgba(217,119,6,0.15)",
          background: "rgba(251,249,231,0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id as unknown as TabType)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-black tracking-[0.15em] uppercase transition-all duration-200 shrink-0 cursor-pointer select-none"
              style={{
                fontFamily: "'Oswald', sans-serif",
                background: isActive ? "rgba(28,25,23,0.85)" : "transparent",
                color: isActive ? "#FCFCFC" : "#78716c",
                border: `1px solid ${isActive ? "rgba(255,255,255,0.05)" : "transparent"}`,
                boxShadow: isActive ? "0 4px 12px rgba(28,25,23,0.15)" : "none",
              }}
            >
              {tab.icon && (
                <span
                  className={`w-3.5 h-3.5 ${isActive ? "text-[#D97706]" : "text-[#a8a29e]"}`}
                >
                  {tab.icon}
                </span>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
