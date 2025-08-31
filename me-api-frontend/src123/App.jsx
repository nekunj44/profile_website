import React, { useState } from "react";

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState(null);

  const fetchData = async (endpoint, setter) => {
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`);
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      console.log("Fetched:", data);  // Debug log
      setter(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div>
      <h1>Profile - Nekunj Khanna</h1>

      <button onClick={() => fetchData("/profile", setProfile)}>View Profile</button>
      <button onClick={() => fetchData("/projects", setProjects)}>List Projects</button>

      <hr />

      {/* Show raw JSON for debugging */}
      {profile && (
        <div>
          <h2>Profile Data (Raw JSON)</h2>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}

      {projects && (
        <div>
          <h2>Projects Data (Raw JSON)</h2>
          <pre>{JSON.stringify(projects, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
