import { useState } from "react";

import { APIProvider, InfoWindow, Map } from "@vis.gl/react-google-maps";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

import {
  car,
  star,
  MY_GOOGLE_API_KEY,
  MY_GOOGLE_MAP_PUBLIC_ID,
} from "@/constants";
import useGetCheckpointLocations from "@/hooks/useGetCheckpointLocations";
import useAssetLocations from "@/hooks/useAssetLocations";
import LeaderboardHeader from "@/components/LeaderboardHeader";
import type { Poi } from "@/types";
import { locations } from "@/data";

const MainMap = () => {
  const { data: PoiLocations, isLoading } = useGetCheckpointLocations();
  const { assetLocations, isLoading: LoadingLocations } = useAssetLocations();
  const [isMapsApiReady, setIsMapsApiReady] = useState(false);

  const defaultCenter = PoiLocations?.[0].location;

  return (
    <div className="bg-white h-[80vh] w-full min-h-[100vh] p-4">
      <div className="max-w-3xl xl:max-w-[95vw] 2xl:max-w-[1600px] mx-auto">
        <div className="mb-4">
          <LeaderboardHeader />
        </div>
        {!isLoading || !isMapsApiReady || LoadingLocations ? (
          <APIProvider
            apiKey={MY_GOOGLE_API_KEY}
            onLoad={() => setIsMapsApiReady(true)}
          >
            {defaultCenter && (
              <Map
                defaultZoom={15}
                mapTypeId={"satellite"}
                defaultCenter={defaultCenter}
                mapId={MY_GOOGLE_MAP_PUBLIC_ID}
                style={{ height: "80vh", width: "100%" }}
              >
                <PoiMarkers
                  pois={PoiLocations ?? locations}
                  isCheckpoint={true}
                />

                {assetLocations && (
                  <PoiMarkers pois={assetLocations} isCheckpoint={false} />
                )}
              </Map>
            )}
          </APIProvider>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default MainMap;

const PoiMarkers = (props: { pois: Poi[]; isCheckpoint: boolean }) => {
  const [activeMarkerKey, setActiveMarkerKey] = useState<string | null>(null);

  return (
    <>
      {props.pois.map((poi: Poi) => {
        const isOpen = activeMarkerKey === poi.key;

        return (
          <AdvancedMarker
            key={poi.key}
            position={poi.location}
            onClick={() => setActiveMarkerKey(isOpen ? null : poi.key)}
          >
            <div
              className="relative"
              style={{
                width: 40,
                height: 40,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {/* 1. THE PIN BACKGROUND (Rotated safely on its own) */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: props.isCheckpoint ? "#00BD9D" : "#FF3C38",
                  borderRadius: "50% 50% 50% 0",
                  transform: "rotate(-45deg)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  zIndex: 1,
                }}
              />

              {/* 2. THE ICON (Centered perfectly inside the parent, no rotation hacks needed) */}
              <img
                src={props.isCheckpoint ? star : car}
                style={{
                  width: 20,
                  height: 20,
                  zIndex: 2,
                  marginTop: "-4px",
                }}
                alt={poi.key}
              />

              {/* 3. THE LABEL (Sitting completely outside the rotation nightmare) */}
              <div
                className="absolute bg-white text-black text-center"
                style={{
                  top: "125%", // Pushes it cleanly just below the pin tip
                  left: "50%",
                  transform: "translateX(-50%)", // Centers it perfectly horizontally
                  padding: "4px 8px",
                  fontWeight: "bold",
                  fontSize: "12px",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  width: "max-content",
                  maxWidth: "120px",
                  zIndex: 3,
                }}
              >
                {poi.key}
              </div>
            </div>

            {props.isCheckpoint ? (
              <></>
            ) : (
              <div>
                {activeMarkerKey == poi.key && (
                  <InfoWindow
                    className=""
                    position={poi.location}
                    onCloseClick={() => setActiveMarkerKey(null)}
                  >
                    <div>
                      <div
                        style={{
                          color: "#000",
                          padding: "2px",
                          fontWeight: "bold",
                          fontSize: "13px",
                        }}
                      >
                        <h3>
                          <span className="font-light">CAR NUMBER:</span>{" "}
                          {poi.key}
                        </h3>
                        <h3>
                          <span className="font-light">TIME: </span>
                          {poi.time
                            ? (() => {
                                const date = new Date(poi.time);
                                date.setHours(date.getHours() + 3);
                                return date.toLocaleString([], {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                });
                              })()
                            : "N/A"}
                        </h3>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </div>
            )}
          </AdvancedMarker>
        );
      })}
    </>
  );
};
