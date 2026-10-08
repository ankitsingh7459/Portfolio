import { useState, useEffect } from 'react';
import { getGitHubActivity } from '../../services/api';

/**
 * Hook to fetch GitHub activity via backend proxy with 4s timeout.
 * When unavailable, sets error to muted message and data to null.
 * @param {number} timeoutMs
 */
export const useGitHubActivity = (timeoutMs = 4000) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let timer = null;

    const handleFailure = (msg) => {
      if (!isMounted) return;
      setData(null);
      setError(msg);
      setLoading(false);
    };

    timer = setTimeout(() => {
      handleFailure('GitHub unavailable (request timed out).');
    }, timeoutMs);

    getGitHubActivity()
      .then((res) => {
        if (!isMounted) return;
        clearTimeout(timer);
        const payload = res.data?.data || res.data;
        if (payload && Array.isArray(payload.repos) && payload.repos.length > 0) {
          setData(payload);
          setError(null);
        } else {
          handleFailure('GitHub unavailable.');
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        clearTimeout(timer);
        const isRateLimit = err?.response?.status === 403 || err?.response?.status === 429;
        const msg = isRateLimit
          ? 'GitHub rate limit reached. Activity unavailable.'
          : 'GitHub unavailable.';
        handleFailure(msg);
      });

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [timeoutMs]);

  return { data, loading, error };
};

export default useGitHubActivity;
