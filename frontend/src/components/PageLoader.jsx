import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';

/**
 * PageLoader wrapper that fetches data before rendering the page
 * This prevents flash of default content
 */
export default function PageLoader({ loader, component: Component, ...props }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await loader({ params });
        if (isMounted) {
          setData(result);
          setLoading(false);
        }
      } catch (error) {
        console.error('Loader error:', error);
        if (isMounted) {
          setData(null);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [loader, params.slug, params.id]); // Re-run when route params change

  if (loading) {
    return <Loading />;
  }

  return <Component {...props} loaderData={data} />;
}
