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
import type { Coordinates } from "@/state/types";
import LeaderboardHeader from "@/components/LeaderboardHeader";

const MainMap = () => {
  const { data: PoiLocations, isLoading } = useGetCheckpointLocations();
  const { assetLocations, isLoading: LoadingLocations } = useAssetLocations();
  const [isMapsApiReady, setIsMapsApiReady] = useState(false);
  // const [selectedPoi, setSelectedPoi] = useState<Poi | null>();

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

                {/* {selectedPoi && (
                  <InfoWindow
                    position={selectedPoi.location}
                    onCloseClick={() => setSelectedPoi(null)}
                  ></InfoWindow>
                )} */}
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

export type Poi = { key: string; location: Coordinates };

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
            {props.isCheckpoint && (
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
            )}
          </AdvancedMarker>
        );
      })}
    </>
  );
};

// const PoiMarkers = (props: { pois: Poi[]; isCheckpoint: boolean }) => {
//   return (
//     <>
//       {props.pois.map((poi: Poi) => (
//         <AdvancedMarker key={poi.key} position={poi.location}>
//           <img
//             src={props.isCheckpoint ? star : car}
//             style={{
//               width: 30,
//               height: 30,
//               backgroundColor: props.isCheckpoint ? "#00BD9D" : "#FF3C38",
//               // backgroundColor: "#03191E",
//               borderRadius: "50% 50% 50% 0",
//               transform: "rotate(-45deg)",
//               position: "relative",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
//             }}
//             alt="Flag"
//           />
//           <InfoWindow
//           // position={selectedPoi.location}
//           // onCloseClick={() => setSelectedPoi(null)}
//           >
//             {poi.key}
//           </InfoWindow>
//         </AdvancedMarker>
//       ))}
//     </>
//   );
// };

const locations: Poi[] = [
  { key: "operaHouse", location: { lat: -33.8567844, lng: 151.213108 } },
  { key: "tarongaZoo", location: { lat: -33.8472767, lng: 151.2188164 } },
  { key: "manlyBeach", location: { lat: -33.8209738, lng: 151.2563253 } },
  { key: "hyderPark", location: { lat: -33.8690081, lng: 151.2052393 } },
  { key: "theRocks", location: { lat: -33.8587568, lng: 151.2058246 } },
  { key: "circularQuay", location: { lat: -33.858761, lng: 151.2055688 } },
  { key: "harbourBridge", location: { lat: -33.852228, lng: 151.2038374 } },
  { key: "kingsCross", location: { lat: -33.8737375, lng: 151.222569 } },
  { key: "botanicGardens", location: { lat: -33.864167, lng: 151.216387 } },
  { key: "museumOfSydney", location: { lat: -33.8636005, lng: 151.2092542 } },
  { key: "maritimeMuseum", location: { lat: -33.869395, lng: 151.198648 } },
  { key: "kingStreetWharf", location: { lat: -33.8665445, lng: 151.1989808 } },
  { key: "aquarium", location: { lat: -33.869627, lng: 151.202146 } },
  { key: "darlingHarbour", location: { lat: -33.87488, lng: 151.1987113 } },
  { key: "barangaroo", location: { lat: -33.8605523, lng: 151.1972205 } },
];
