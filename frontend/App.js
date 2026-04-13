import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchAdvisor from "./components/SearchAdvisor";
import AdvisorSlots from "./pages/AdvisorSlots";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchAdvisor />} />
        <Route path="/advisor/:id" element={<AdvisorSlots />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;