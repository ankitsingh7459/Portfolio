import { useState, useEffect } from 'react';
import { getGitHubActivity } from '../../services/api';
import { defaultGitHubData } from '../../data/github';

/**
 * Hook to fetch GitHub activity via the backend proxy with 4s timeout and graceful fallback.
 * @param {number} timeoutMs
 */
export const useGitHubActivity = (timeoutMs = 4000) => {
  const [data, setData] = useState(defaultGitHubData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    let timer = null;

    const applyFallback = (errReason = null) => {
      if (!isMounted) return;
      setData(defaultGitHubData);
      if (errReason) setError(errReason);
      setLoading(false);
    };

    timer = setTimeout(() => {
      if (isMounted) {
        applyFallback('Activity service timed out. Showing local snapshot.');
      }
    }, timeoutMs);

    getGitHubActivity()
      .then((res) => {
        if (!isMounted) return;
        clearTimeout(timer);
        const payload = res.data?.data || res.data;
        if (payload && Array.isArray(payload.repos)) {
          setData(payload);
          setError(null);
        } else {
          applyFallback(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        clearTimeout(timer);
        const isRateLimit = err?.response?.status === 403 || err?.response?.status === 429;
        const msg = isRateLimit
          ? 'API rate limit reached. Showing local snapshot.'
          : 'Activity service unavailable. Showing local snapshot.';
        applyFallback(msg);
      });

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [timeoutMs]);

  return { data, loading, error };
};

export default useGitHubActivity;
