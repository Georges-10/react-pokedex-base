export const useFetch = async (
  url: string,
  options?: RequestInit,
  opr?: any,
) => {
  const fetchData = async () => {
    try {
      return await fetch(url, options).then((res) => res.json());
    } catch (e) {
      throw new Error(e + "");
    }
  };
  const data = await fetchData();
  return opr ? opr(data) : data;
};
