import { useState, useEffect } from "react";

const useJsonFetch = (url, opts, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let isCanceled = false;

  useEffect(() => {
    setError(null);
    setLoading(true);

    window.fetch(url, opts)
      .then(response =>
        !isCanceled && (
          response.ok ? response.json() : (async () => {
            throw {
              responseStatus: response.status,
              response: await response.text()
            }
          })()
        )
      )
      .then(json => !isCanceled && setData(json))
      .catch(err => !isCanceled && setError(err))
      .finally(() => !isCanceled && setLoading(false));

    return () => (isCanceled = true);
  }, deps);

  return [data, loading, error];
};

export default useJsonFetch;