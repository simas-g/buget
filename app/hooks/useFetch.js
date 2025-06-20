'use client'
import { useEffect, useState } from "react";
export function useFetch(fetchFn, shouldFetch = true, deps = []) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    if(shouldFetch === false) {
      return
    }
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetchFn();
        setData(res);
      } catch (error) {
        setError({ message: "Nepavyko užkrauti" });
      }
      setIsLoading(false);
    };
    fetchData();
  }, [shouldFetch, ...deps]); 

  return { isLoading, data, error };
}
