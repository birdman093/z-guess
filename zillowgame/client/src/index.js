import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import App from "./App";
import AccountSetup from "./pages/account";
import DisplayProperties from "./pages/properties";
import GetPlaylist from "./pages/playlist";
const rootElement = document.getElementById("root");

// Routing for all pages.
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="AccountPage" element={<AccountSetup/>} />
      <Route path="GetPlaylist" element={<GetPlaylist/>} />
      <Route path="DisplayProperties" element={<DisplayProperties/>} />
    </Routes>
  </BrowserRouter>,
  rootElement
);




