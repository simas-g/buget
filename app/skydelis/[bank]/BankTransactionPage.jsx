"use client";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
const BankTransactionPage = ({ id, sessionId }) => {
  const [transactions, setTransactions] = useState();
  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("access_token")).data
      .access;
    async function getBank() {
      const res = await fetch("/api/bankDetails", {
        method: "POST",
        body: JSON.stringify({
          id,
          access_token: token,
          type: "transactions",
        }),
        headers: {
          Authorization: "Bearer " + sessionId.value,
        },
      });
      if (!res.ok || res.status === 404) {
        ///manage not-foind
      }
      const data = await res.json();
    }
    getBank();
  }, []);
  return transactions && <pre>{JSON.stringify(transactions)}</pre>;
};

export default BankTransactionPage;
