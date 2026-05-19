import { useState, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";

import { ADMIN_TABS } from "@/data";
import Toast from "@/components/Toast";

import { AdminTabs } from "@/components/AdminTabs";
import CompetitorInfo from "@/components/admintabsopt/CompetitorInfo";
import LoginPage from "@/components/admintabsopt/components/LoginPage";
import SafariLeaderBoard from "./SafariLeaderBoard";

export default function AdminPage() {
  const [currentTab, setCurrentTab] = useState("livedata");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const TabOptions: Record<string, ReactNode> = {
    competitors: <CompetitorInfo />,
    livedata: <SafariLeaderBoard showHeader={false} />,
    results: <></>,
  };

  return (
    <>
      {isAuthenticated ? (
        <div
          className="min-h-screen text-stone-100 pt-8 pb-16 px-4"
          style={{
            background: "#fff",
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(217,119,6,0.018) 39px,rgba(217,119,6,0.018) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(217,119,6,0.018) 39px,rgba(217,119,6,0.018) 40px)",
          }}
        >
          <div className="max-w-[1400px] flex flex-col mx-auto">
            {/* ── Header ── */}
            <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1
                  className="text-3xl sm:text-4xl font-black leading-none mb-1"
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    letterSpacing: "0.04em",
                    color: "#716969",
                  }}
                >
                  Rhino Charge 2026
                </h1>
                <p
                  className="text-[10px] uppercase tracking-[0.25em]"
                  style={{ color: "#57534e" }}
                >
                  Admin · Checkpoint Control
                </p>
              </div>
            </div>

            <AdminTabs
              tabs={ADMIN_TABS}
              activeTab={currentTab}
              onChange={setCurrentTab}
            />

            {TabOptions[currentTab]}
          </div>
        </div>
      ) : (
        <LoginPage setIsAuthenticated={setIsAuthenticated} />
      )}

      <AnimatePresence>
        {toast && (
          <Toast key={toast} message={toast} onDone={() => setToast(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
