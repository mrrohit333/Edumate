"use client"

import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "about" | "blog" | "careers" | "contact" | "privacy" | "terms" | "cookie";

interface ModalContextType {
  openModal: (modalType: ModalType) => void;
  closeModal: () => void;
  activeModal: ModalType | null;
  isModalOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (modalType: ModalType) => {
    setActiveModal(modalType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Delay clearing the modal type to allow animation to complete
    setTimeout(() => {
      setActiveModal(null);
    }, 300);
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        activeModal,
        isModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
} 