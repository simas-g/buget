"use client";

import { useEffect, useState } from "react";

export default function PossibleBanks({ sessionId }) {
  const [token, setToken] = useState(null);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  // Fetch the token
  useEffect(() => {
    async function getToken() {
      try {
        const res = await fetch("/api/goCardLessToken", {
          headers: {
            Authorization: "Bearer " + sessionId.value,
          },
        });
        const parsed = await res.json();
        setToken(parsed);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    }

    getToken();
  }, [sessionId]);

  useEffect(() => {
    if (!token) return;

    async function fetchBanks() {
      setLoadingBanks(true);
      try {
        const res = await fetch("/api/availableBanks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }), 
        });
        const fetchedBanks = await res.json();
        setBanks(fetchedBanks?.data); 
      } catch (error) {
        console.error("Error fetching banks:", error);
      } finally {
        setLoadingBanks(false);
      }
    }

    fetchBanks();
  }, [token]);
  return (
    <div>
      {loadingBanks ? (
        <p>Loading banks...</p>
      ) : banks.length > 0 ? (
        <pre>{JSON.stringify(banks, null, 1)}</pre>
      ) : (
        <p>No banks available.</p>
      )}
    </div>
  );
}
