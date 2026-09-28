import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Work from "./pages/Work";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const GymDemo = lazy(() => import("./pages/Demos/GymDemo"));
const CafeDemo = lazy(() => import("./pages/Demos/CafeDemo"));
const SalonDemo = lazy(() => import("./pages/Demos/SalonDemo"));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/demos/gym" element={<GymDemo />} />
          <Route path="/demos/cafe" element={<CafeDemo />} />
          <Route path="/demos/salon" element={<SalonDemo />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
