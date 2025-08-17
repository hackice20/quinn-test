import { Route, Routes } from "react-router";
import Index from "./pages";
import Carousel from "./pages/carousel";
import Invoices from "./pages/invoices";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/carousel" element={<Carousel />} />
      <Route path="/invoices" element={<Invoices />} />
    </Routes>
  );
}
