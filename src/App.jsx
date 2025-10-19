import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import SuggestedTrips from "./pages/SuggestedTrips";
import "./App.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/itinerary" element={<ItineraryBuilder />} />
        <Route path="/suggested" element={<SuggestedTrips />} />
      </Routes>
    </Router>
  );
}

export default App;
