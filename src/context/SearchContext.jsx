import { createContext, useContext } from "react";

/** Global search term shared from the dashboard navbar. */
const SearchContext = createContext("");

export function SearchProvider({ value, children }) {
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useGlobalSearch() {
  return useContext(SearchContext);
}
