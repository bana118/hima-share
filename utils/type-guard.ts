export const isQueryString = (
  query: string | string[] | undefined
): query is string => {
  if (query == null || Array.isArray(query)) return false;
  return true;
};

export const isUidString = (uid: string | null | undefined): uid is string => {
  return uid != null;
};
