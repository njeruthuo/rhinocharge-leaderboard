import { BrowserRouter, Route, Routes } from "react-router-dom";
import SafariLeaderBoard from "@/pages/SafariLeaderBoard";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<SafariLeaderBoard />} />
        <Route path={"/management/admin"} element={<SafariLeaderBoard />} />
      </Routes>
    </BrowserRouter>
  );
};
export default AppRouter;
