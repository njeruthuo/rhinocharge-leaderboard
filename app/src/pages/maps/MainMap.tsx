import { useState } from "react";

import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
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
    <div className="bg-white h-screen w-full min-h-screen p-4">
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
                defaultZoom={17}
                defaultCenter={defaultCenter}
                mapId={MY_GOOGLE_MAP_PUBLIC_ID}
                style={{ height: "90vh", width: "100%" }}
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

  console.log(activeMarkerKey, "activeMarkerKey");

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
              style={{
                width: 40,
                height: 40,
                backgroundColor: props.isCheckpoint ? "#00BD9D" : "#FF3C38",
                borderRadius: "50% 50% 50% 0",
                transform: "rotate(-45deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                cursor: "pointer",
              }}
            >
              <img
                src={props.isCheckpoint ? star : car}
                style={{
                  width: 20,
                  height: 20,
                  transform: "rotate(45deg)",
                }}
                alt={poi.key}
              />
            </div>

            {props.isCheckpoint ? (
              <InfoWindow
                position={poi.location}
                onCloseClick={() => setActiveMarkerKey(null)}
              >
                <div
                  style={{ color: "#000", padding: "2px", fontWeight: "bold" }}
                >
                  {poi.key}
                </div>
              </InfoWindow>
            ) : (
              <div>
                {activeMarkerKey == poi.key && (
                  <InfoWindow
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
                            ? new Date(poi.time).toLocaleString([], {
                                dateStyle: "short",
                                timeStyle: "short",
                              })
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
