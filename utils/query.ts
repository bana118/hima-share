export const isQueryString = (
  arg: string | string[] | undefined
): arg is string => {
  if (arg == null || Array.isArray(arg)) return false;
  return true;
};
