import { useState, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFunction<T> = (props: any) => Promise<T>;

export const useAsync = <T>(
  asyncFunction: AsyncFunction<T>,
  functionProps: unknown
): {
  data: T | null | undefined;
  error: string | null;
  isLoading: boolean;
} => {
  const [data, setData] = useState<T | undefined | null>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    let unmounted = false;
    const setDataFromAsyncFunction = async () => {
      try {
        console.log(functionProps);
        const loadedData = await asyncFunction(functionProps);
        if (!unmounted) {
          setData(loadedData);
        }
      } catch (error) {
        console.error(error);
        if (!unmounted) {
          setError(error);
          setData(null);
        }
      } finally {
        if (!unmounted) {
          setIsLoading(false);
        }
      }
    };
    setDataFromAsyncFunction();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [asyncFunction, functionProps]);
  return { data, error, isLoading };
};
