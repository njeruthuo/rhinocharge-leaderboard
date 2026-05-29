import * as Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { home } from "@/constants";
import { ADMIN_TABS } from "@/data";
import Toast from "@/components/Toast";

import Upload from "@/components/Upload";
import TimePicker from "@/components/RaceClock";
import useDriverList from "@/hooks/useDriverList";

import { AdminTabs } from "@/components/AdminTabs";
import SafariLeaderBoard from "./SafariLeaderBoard";
import { TabOptionList, type TabType } from "@/types";
import Results from "@/components/admintabsopt/Results";
import useGetStoredDates from "@/hooks/useGetStoredDates";
import CompetitorInfo from "@/components/admintabsopt/CompetitorInfo";
import LoginPage from "@/components/admintabsopt/components/LoginPage";
// import MileageResults from "./MileageResults";

export default function AdminPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [currentTab, setCurrentTab] = useState<TabType>(TabOptionList.LIVEDATA);

  const [isGenerating, setIsGenerating] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [openFilter, setOpenFilter] = useState(false);

  const { DateData, isUpdate } = useGetStoredDates();

  const resolvedTime = useMemo(
    () => ({
      startDate: DateData.startDate ?? "2026-05-20T7:30:00",
      endDate: DateData.endDate ?? "2026-05-21T17:30:00",
      isBackup: DateData.isBackup,
    }),
    [DateData.startDate, DateData.endDate, DateData.isBackup],
  );

  const [time, setTime] = useState(resolvedTime);

  useEffect(() => {
    setTime(resolvedTime);
  }, [resolvedTime]);

  const { data, LoadingVehicleList, LoadingCheckPoints } = useDriverList();

  const handleUpload = async () => {
    if (!file) return;

    Papa.parse<[string, string]>(file, {
      complete: function (results: Papa.ParseResult<[string, string]>) {
        results.data.forEach(([item1, item2]: [string, string]) => {
          const car = data.find(
            (asset) =>
              asset?.carNo ===
              `CAR${Number(item1).toString().padStart(2, "0")}`,
          );
          if (car) {
            setSelections((prev) => ({ ...prev, [car.asset_id]: item2 }));
          }
        });
      },
    });
  };

  const handleExport = () => {
    setIsGenerating(true);

    // 1. Accumulate all rows across all vehicles/assets in the data array
    const flatRows = data.flatMap((item) => {
      // Access the nested mileage object structure safely
      const mileageGroup = item.pointToPointMileage;

      if (!mileageGroup || !mileageGroup.checkpoints) return [];

      // Map each checkpoint for this specific asset
      return mileageGroup.checkpoints.map((cp) => ({
        VEHICLE: mileageGroup.assetName,
        "CP ONE": cp.Checkpoint1 ? cp.Checkpoint1.toUpperCase() : "",
        "CP TWO": cp.Checkpoint2 ? cp.Checkpoint2.toUpperCase() : "",
        "ACTUAL DISTANCE":
          typeof cp.mileage === "number" ? cp.mileage.toFixed(3) : "0.000",
      }));
    });

    if (flatRows.length === 0) {
      console.warn("No checkpoint data found to export.");
      setIsGenerating(false);
      return;
    }

    // 2. Convert the flat JSON objects into a CSV raw text string using PapaParse
    const csvString = Papa.unparse(flatRows, {
      header: true,
    });

    // 3. Trigger the standard browser file download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // If exporting multiple cars, fallback to a generic name or use the first asset's name
    const firstAssetName =
      data[0]?.pointToPointMileage?.assetName || "vehicles";

    link.setAttribute("href", url);
    link.setAttribute("download", `${firstAssetName}_movement_summary.csv`);
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsGenerating(false);
  };

  const TabOptions: Record<TabType, React.ReactNode> = {
    [TabOptionList.LIVEDATA]: <SafariLeaderBoard showHeader={false} />,
    [TabOptionList.COMPETITORS]: (
      <CompetitorInfo
        LoadingData={LoadingCheckPoints || LoadingVehicleList}
        selections={selections}
        setSelections={setSelections}
        data={data}
        file={file}
        time={time}
      />
    ),
    // [TabOptionList.RESULTS]: <MileageResults />,
    [TabOptionList.RESULTS]: (
      <Results setOpenFilter={setOpenFilter} openFilter={openFilter} />
    ),
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
            <div className="flex place-items-center flex-row items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1
                  className="text-3xl sm:text-4xl font-black leading-none mb-1"
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    letterSpacing: "0.04em",
                    color: "#716969",
                  }}
                  onClick={() => navigate("/")}
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

              <div className="ml-auto flex place-items-center space-x-8">
                <span
                  className="hover:cursor-pointer ml-auto"
                  onClick={() => navigate("/")}
                >
                  <img src={home} alt="" />
                </span>
                {currentTab === TabOptionList.COMPETITORS && (
                  <Upload
                    file={file}
                    setFile={setFile}
                    handleUpload={handleUpload}
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full mb-2">
              <div className="flex-1 min-w-0 sm:max-w-xl">
                <AdminTabs
                  tabs={ADMIN_TABS}
                  activeTab={currentTab}
                  onChange={setCurrentTab}
                />
              </div>
              {currentTab === TabOptionList.LIVEDATA && (
                <div className="flex items-center space-x-2 shrink-0 sm:mb-6">
                  <TimePicker
                    value={time}
                    onChange={(name: string, value: string | boolean) =>
                      setTime((prev) => ({ ...prev, [name]: value }))
                    }
                    isUpdate={isUpdate}
                  />
                </div>
              )}
              {currentTab === TabOptionList.RESULTS && (
                <div className="flex items-center space-x-2 shrink-0 sm:mb-6">
                  <button
                    onClick={handleExport}
                    // onClick={() => setOpenFilter(false)}
                    disabled={isGenerating}
                    className="flex-1 rounded-lg py-2 text-xs font-black tracking-wider uppercase transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-4 w-full hover:cursor-pointer bg-amber-600 hover:bg-amber-700 text-white rounded-md py-1.5 text-sm font-medium transition-colors shadow-sm px-2"
                    style={{
                      background: "rgba(217,119,6,0.18)",
                      color: "#D97706",
                      border: "1px solid rgba(217,119,6,0.3)",
                      fontFamily: "'Oswald', sans-serif",
                    }}
                  >
                    {isGenerating ? "Generating..." : "Generate report"}
                  </button>
                </div>
              )}
            </div>

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
