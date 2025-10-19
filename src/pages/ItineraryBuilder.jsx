import { useState } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown'; // <-- Import ReactMarkdown
import "./ItineraryBuilder.css";

function ItineraryBuilder() {
  // ... (rest of the state and generateItinerary function remains the same) ...

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generateItinerary = async (e) => {
    e.preventDefault(); 
    if (!destination || !days) return;

    setLoading(true);
    setPlan(""); 

    try {
      const response = await axios.post("http://localhost:5000/api/itinerary", {
        destination,
        days,
      });

      if (response.data?.itinerary) {
        setPlan(response.data.itinerary);
      } else if (response.data?.error) {
        setPlan(`Error: ${response.data.error}`);
      } else {
        setPlan("No itinerary generated. Please try again.");
      }
    } catch (err) {
      console.error("❌ Error fetching itinerary:", err);
      if (err.response?.data?.error) {
        setPlan(`Error: ${err.response.data.error}`);
      } else {
        setPlan("Failed to generate itinerary. Please check the network tab or console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="itinerary-builder">
      <h1>AI Travel Itinerary Planner 🌍</h1>

      <form className="itinerary-form" onSubmit={generateItinerary}>
        <input
          type="text"
          placeholder="Enter destination (e.g., Paris)"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Enter number of days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          required
          min="1"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </form>

      {plan && (
        <div className="itinerary-result">
          <h2>Your AI-Generated Trip Plan</h2>
          {/* 🟢 THE NEW FIX: Use ReactMarkdown to style the response */}
          <div className="markdown-container">
            <ReactMarkdown>{plan}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItineraryBuilder;