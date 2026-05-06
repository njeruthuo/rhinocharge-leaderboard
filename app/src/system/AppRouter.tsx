import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SafariLeaderBoard, Admin } from "@/pages";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<SafariLeaderBoard />} />
        <Route path={"/management/admin"} element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
