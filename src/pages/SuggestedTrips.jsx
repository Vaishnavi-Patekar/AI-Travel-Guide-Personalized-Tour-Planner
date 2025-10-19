import "./SuggestedTrips.css";

const trips = [
  { name: "Paris", highlights: "Eiffel Tower, Louvre Museum", time: "April–June" },
  { name: "Tokyo", highlights: "Cherry Blossoms, Shibuya Crossing", time: "March–May" },
  { name: "Bali", highlights: "Beaches, Temples, Culture", time: "May–September" },
];

function SuggestedTrips() {
  return (
    <div className="suggested-container">
      <h2>Suggested Trips ✈️</h2>
      <div className="trip-list">
        {trips.map((trip) => (
          <div key={trip.name} className="trip-card">
            <h3>{trip.name}</h3>
            <p><b>Highlights:</b> {trip.highlights}</p>
            <p><b>Best Time:</b> {trip.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SuggestedTrips;
