import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import Details from "./pages/Details";

export default function App() {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/details/:productId" element={<Details />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}
