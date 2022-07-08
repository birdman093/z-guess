import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import App from "./App";
import AptOwners from "./pages/AptOwners";
const rootElement = document.getElementById("root");

// Routing for all pages.
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="aptOwners" element={<AptOwners />} />
    </Routes>
  </BrowserRouter>,
  rootElement


);




