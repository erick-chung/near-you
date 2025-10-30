"use client";
import { createContext, useContext, ReactNode } from 'react';
import { useFavorites } from '@/hooks/useFavorites';

const FavoritesContext = createContext<ReturnType<typeof useFavorites> | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favoritesData = useFavorites();
  return (
    <FavoritesContext.Provider value={favoritesData}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesContext must be used within FavoritesProvider');
  }
  return context;
}