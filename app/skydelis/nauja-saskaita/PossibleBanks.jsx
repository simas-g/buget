"use client";
import { useEffect, useState } from "react";
import BankOption from "./BankOption";
import { Search } from "lucide-react";

export default function PossibleBanks({ sessionId }) {
  const [banks, setBanks] = useState([]);
  const [filteredBanks, setFilteredBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [filter, setFilter] = useState("");

  // Fetch the banks
  useEffect(() => {
    const token = sessionStorage.getItem("access_token")
    async function fetchBanks() {
      setLoadingBanks(true);
      try {
        const res = await fetch("/api/go/availableBanks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: token,
        });
        const fetchedBanks = await res.json();
        setBanks(fetchedBanks?.data || []);
        setFilteredBanks(fetchedBanks?.data || []); // Initialize filteredBanks with fetched data
      } catch (error) {
        console.error("Error fetching banks:", error);
      } finally {
        setLoadingBanks(false);
      }
    }

    fetchBanks();
  }, []);

  ///filter the input
  useEffect(() => {
    const filtered = banks.filter((bank) =>
      bank.name.toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredBanks(filtered);
  }, [filter, banks]);

  return (
    <div className="w-full">
      <div className="border border-gray-300 rounded-xl flex items-center p-4 gap-3 w-full max-w-xl mb-6 shadow-sm">
        <Search color="gray" />
        <input
          className="outline-none w-full text-base text-gray-700"
          placeholder="Ieškoti"
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {loadingBanks ? (
        <p>Kraunama...</p>
      ) : (
        <ul className="flex flex-col items-center w-full">
          {filteredBanks.map((bank) => (
            <BankOption key={bank.name} bank={bank} sessionId={sessionId} />
          ))}
        </ul>
      )}
    </div>
  );
}
