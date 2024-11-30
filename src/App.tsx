// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";

export default function App() {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/details" element={<h1>Details page</h1>} />
          <Route path="/reviews" element={<h1>Reviews page</h1>} />
          <Route path="/new" element={<h1>Create new product page</h1>} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}
