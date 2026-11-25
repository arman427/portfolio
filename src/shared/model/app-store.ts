'use client';

import { create } from 'zustand';

type AppState = {
  /** `id` of the section currently crossing the middle of the viewport. */
  activeSection: string | null;
  isMenuOpen: boolean;

  setActiveSection: (section: string | null) => void;
  setMenuOpen: (isOpen: boolean) => void;
};

export const useAppStore = create<AppState>()((set) => ({
  activeSection: null,
  isMenuOpen: false,

  setActiveSection: (activeSection) => set({ activeSection }),
  setMenuOpen: (isMenuOpen) => set({ isMenuOpen }),
}));
