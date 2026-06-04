import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SafariLeaderBoard, Admin } from "@/pages";
import MainMap from "@/pages/maps/MainMap";
import useDriverList from "@/hooks/useDriverList";

const AppRouter = () => {
  const { data, LoadingVehicleList, LoadingCheckPoints } = useDriverList();
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/"}
          element={
            <SafariLeaderBoard
              data={data}
              LoadingCheckPoints={LoadingCheckPoints}
              LoadingVehicleList={LoadingVehicleList}
            />
          }
        />
        <Route
          path={"/management/viewer"}
          element={
            <SafariLeaderBoard
              data={data}
              LoadingCheckPoints={LoadingCheckPoints}
              LoadingVehicleList={LoadingVehicleList}
            />
          }
        />
        <Route
          path={"/management/admin"}
          element={
            <Admin
              data={data}
              LoadingCheckPoints={LoadingCheckPoints}
              LoadingVehicleList={LoadingVehicleList}
            />
          }
        />
        <Route path={"/maps"} element={<MainMap />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
