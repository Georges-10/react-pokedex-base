import { useEffect, useState } from "react";

export const useFetch = (
  url: string,
  options?: RequestInit,
  opr?: any,
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>("");
  const [error, setError] = useState<any>();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (loading) return;
        const load = await fetch(url, options).then((res) =>
          res.json(),
        );
        setData(load);
      } catch (e: any) {
        setError(e);
      }
    };
    fetchData();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (data && opr) {
      opr(data);
    }
  }, [data]);

  return { data, loading, error };
};
