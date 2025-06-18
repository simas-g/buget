import { useEffect, useState } from "react";

export default function useFetch(fetchFn) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetchFn();
        const parsed = await res.json()
        setData(parsed);
        console.log(res);
      } catch (error) {
        setError({ message: "Nepavyko užkrauti" });
      }
      setIsLoading(false);
    };
    fetchData();
  }, []); // empty dependency array

  return { isLoading, data, error };
}
