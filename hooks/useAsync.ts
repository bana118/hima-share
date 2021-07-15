import { useState, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFunction<T> = (props: any) => Promise<T>;

export const useAsync = <T>(
  asyncFunction: AsyncFunction<T>,
  functionProps: unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  propsTypeGuard?: (arg: any) => boolean
): {
  data: T | null | undefined;
  error: string | null;
} => {
  const [data, setData] = useState<T | undefined | null>(undefined);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let unmounted = false;
    const setDataFromAsyncFunction = async () => {
      if (propsTypeGuard != null && !propsTypeGuard(functionProps)) return;
      try {
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
      }
    };
    setDataFromAsyncFunction();
    const cleanup = () => {
      unmounted = true;
    };
    return cleanup;
  }, [asyncFunction, functionProps, propsTypeGuard]);
  return { data, error };
};
