import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SafariLeaderBoard, Admin } from "@/pages";
import MainMap from "@/pages/maps/MainMap";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<SafariLeaderBoard />} />
        <Route path={"/management/viewer"} element={<SafariLeaderBoard />} />
        <Route path={"/management/admin"} element={<Admin />} />
        <Route path={"/maps"} element={<MainMap />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
