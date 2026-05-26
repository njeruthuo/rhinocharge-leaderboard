import { useState } from "react";
import { useEffect } from "react";

import { APIProvider, Map, InfoWindow } from "@vis.gl/react-google-maps";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

import { useMap } from "@vis.gl/react-google-maps";

import {
  car,
  flag,
  MY_GOOGLE_API_KEY,
  MY_GOOGLE_MAP_PUBLIC_ID,
} from "@/constants";
import useGetCheckpointLocations from "@/hooks/useGetCheckpointLocations";

const MainMap = () => {
  const { data: PoiLocations, isLoading } = useGetCheckpointLocations();
  const [isMapsApiReady, setIsMapsApiReady] = useState(false);
  const [selectedPoi, setSelectedPoi] = useState<Poi | null>();

  const geoFenceCoordinates = null;

  const defaultCenter = PoiLocations?.[0].location;

  return (
    <div className="bg-white h-screen w-full">
      {!isLoading || !isMapsApiReady ? (
        <APIProvider
          apiKey={MY_GOOGLE_API_KEY}
          onLoad={() => setIsMapsApiReady(true)}
        >
          {defaultCenter && (
            <Map
              defaultZoom={15}
              defaultCenter={defaultCenter}
              mapId={MY_GOOGLE_MAP_PUBLIC_ID}
              style={{ height: "100vh", width: "100%" }}
            >
              <PoiMarkers
                pois={PoiLocations ?? locations}
                isCheckpoint={true}
              />

              <GeofenceOverlay geofenceCoordinates={geoFenceCoordinates} />

              {selectedPoi && (
                <InfoWindow
                  position={selectedPoi.location}
                  onCloseClick={() => setSelectedPoi(null)}
                >
                  {/* <div style={{ minWidth: "250px" }}>
                  <p>
                    <strong className="text-customBlueFaded text-xl">
                      asset?.vehicle_reg_no ?? ""
                    </strong>
                  </p>
                  <div className="my-2">
                    asset?.client?.company_name ?? ""
                  </div>
                  <p className="flex flex-col">
                    <p>
                      <strong>Lat:</strong>{" "}
                      {selectedPoi.location.lat.toFixed(5)}
                    </p>
                    <p>
                      <strong>Lng:</strong>{" "}
                      {selectedPoi.location.lng.toFixed(5)}
                    </p>
                  </p>
                  <p className="">
                    <span className="font-bold"> Make & Model:</span>{" "}
                    <span>Asset</span>
                  </p>
                  <p className="">
                    <strong>Asset Status:</strong>{" "}
                    <span className="">{` ${
                      asset?.asset_status ?? asset?.asset_status
                    }`}</span>
                  </p>

                  <div className=" mb-2">{}</div>
                  <div className=" flex text-sm place-items-center gap-x-2">
                    <strong>Location:</strong>
                    {asset?.location || "N/A"}
                  </div>
                </div> */}
                </InfoWindow>
              )}
            </Map>
          )}
        </APIProvider>
      ) : (
        <></>
      )}
    </div>
  );
};
export default MainMap;

interface Coordinates {
  lat: number;
  lng: number;
}

export type Poi = { key: string; location: google.maps.LatLngLiteral };

// const PoiMarker = ({
//   pois,
//   onMarkerClick,
// }: {
//   pois: Poi;
//   onMarkerClick: (poi: Poi) => void;
// }) => {
//   return (
//     <AdvancedMarker
//       key={pois.key}
//       position={pois.location}
//       onClick={() => onMarkerClick(pois)}
//     >
//       <div
//         style={{
//           width: 50,
//           height: 50,
//           backgroundColor: "#FF6B6B",
//           borderRadius: "50% 50% 50% 0",
//           transform: "rotate(-45deg)",
//           position: "relative",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
//         }}
//       >
//         <img
//           src={flag}
//           alt="Car"
//           style={{
//             width: 24,
//             height: 24,
//             transform: "rotate(45deg)",
//           }}
//         />
//       </div>
//     </AdvancedMarker>
//   );
// };

const PoiMarkers = (props: { pois: Poi[]; isCheckpoint: boolean }) => {
  return (
    <>
      {props.pois.map((poi: Poi) => (
        <AdvancedMarker key={poi.key} position={poi.location}>
          <img
            src={props.isCheckpoint ? flag : car}
            style={{
              width: 30,
              height: 30,
              backgroundColor: "#00BD9D",
              // backgroundColor: "#03191E",
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            }}
            alt="Flag"
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export const GeofenceOverlay = ({
  geofenceCoordinates,
}: {
  geofenceCoordinates: Coordinates[] | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !geofenceCoordinates || geofenceCoordinates.length === 0)
      return;

    const polygon = new google.maps.Polygon({
      paths: geofenceCoordinates,
      strokeColor: "#FF0000",
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.2,
      map: map,
    });

    return () => polygon.setMap(null); // cleanup
  }, [map, geofenceCoordinates]);

  return null;
};

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
