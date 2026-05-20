import { useRef, useState, type ChangeEvent } from "react";

type UploadProps = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleUpload: () => void;
};

const Upload = ({ file, setFile, handleUpload }: UploadProps) => {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const downloadTemplate = () => {
    const headers = [
      "Car NO",
      "Class",
      "Full/Half Charge classification",
      "Start CP",
      "Sponsorship",
    ];
    const sampleRow = [
      "101",
      "Class A",
      "Full Charge",
      "CP-01",
      "Sponsor Name",
    ];

    const csvContent =
      "\uFEFF" + [headers.join(","), sampleRow.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "car_registration_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="relative inline-block">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-full border transition-all hover:brightness-110"
          style={{
            borderColor: "rgba(217,119,6,0.4)",
            background: "rgba(217,119,6,0.08)",
            fontFamily: "'Oswald', sans-serif",
          }}
        >
          <span
            className="text-sm font-bold tracking-wider truncate max-w-[120px]"
            style={{ color: "#D97706" }}
          >
            {file ? file.name : "Select File"}
          </span>

          <span
            className="text-[9px] uppercase font-bold tracking-widest"
            style={{ color: "#D97706", opacity: 0.7 }}
          >
            Upload
          </span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            <div
              className="absolute left-0 top-full mt-2 z-50 rounded-xl border p-4"
              style={{
                minWidth: 240,
                background: "#1C1917",
                borderColor: "rgba(217,119,6,0.35)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
              }}
            >
              {/* Template Download Link */}
              <div className="mb-3 text-right">
                <button
                  onClick={downloadTemplate}
                  className="text-[10px] uppercase hover:cursor-pointer font-bold tracking-wider transition-all hover:underline"
                  style={{ color: "#D97706" }}
                >
                  Download Template
                </button>
              </div>

              {/* File Selector Area */}
              <div
                onClick={() => fileInputRef?.current?.click()}
                className="cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <p
                  className="text-[10px] uppercase tracking-widest font-bold"
                  style={{ color: "#78716c" }}
                >
                  {file ? "Change File" : "Click to Browse"}
                </p>
                {file && (
                  <p
                    className="mt-2 text-xs truncate"
                    style={{ color: "#e7e5e4" }}
                  >
                    {file.name}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-lg py-2 text-xs font-bold uppercase tracking-tight"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    color: "#78716c",
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    handleUpload();
                    setOpen(false);
                  }}
                  disabled={!file}
                  className="flex-1 rounded-lg py-2 text-xs font-bold uppercase tracking-tight disabled:opacity-30"
                  style={{
                    background: "rgba(217,119,6,0.18)",
                    color: "#D97706",
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Upload;
