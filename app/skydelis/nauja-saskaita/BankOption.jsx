"use client";

import { useState, useEffect } from "react";
import { fetchRequisitions } from "@/app/lib/fetchRequisitions";
export default function BankOption({ bank, sessionId }) {
  const [accessToken, setAccessToken] = useState(null);
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
      setAccessToken(JSON.parse(token).data.access);
    }
  }, []);
  const handleClick = async () => {
    const { req_id, link: url } = await fetchRequisitions(
      bank,
      accessToken,
      sessionId
    );
    console.log(bank);
    window.location.href = url;
    const temporaryBank = {
      logo: bank.logo,
      name: bank.name,
    };
    sessionStorage.setItem("temp_bank", JSON.stringify(temporaryBank));
    sessionStorage.setItem("req_id", req_id.toString());
  };
  return (
    <li className="flex border-b max-w-xl w-full border-gray-300 px-4 py-5 gap-4 items-center">
      <div className="w-10 h-10 rounded-lg overflow-hidden">
        <img src={bank.logo} className="h-full" alt={`${bank.name} logo`} />
      </div>
      <button
        onClick={handleClick}
        className="underline underline-offset-2 cursor-pointer"
      >
        {bank.name}
      </button>
    </li>
  );
}
