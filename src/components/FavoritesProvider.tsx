import { createContext, useContext, type PropsWithChildren } from "react";
import { useFavorites } from "../hooks/useFavorites";

type FavoritesContextValue = ReturnType<typeof useFavorites>;

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const favorites = useFavorites();
  return (
    <FavoritesContext.Provider value={favorites}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoriteContext() {
  const value = useContext(FavoritesContext);
  if (!value) {
    throw new Error("useFavoriteContext must be used inside FavoritesProvider");
  }
  return value;
}
