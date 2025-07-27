"use client"

import { useModal } from "@/contexts/modal-context";
import { Modal } from "@/components/ui/modal";
import {
  AboutContent,
  BlogContent,
  CareersContent,
  ContactContent,
  PrivacyPolicyContent,
  TermsOfServiceContent,
  CookiePolicyContent,
} from "./content";

export function PageModals() {
  const { activeModal, isModalOpen, closeModal } = useModal();

  const getModalTitle = () => {
    switch (activeModal) {
      case "about":
        return "About EduMate";
      case "blog":
        return "Blog";
      case "careers":
        return "Careers";
      case "contact":
        return "Contact Us";
      case "privacy":
        return "Privacy Policy";
      case "terms":
        return "Terms of Service";
      case "cookie":
        return "Cookie Policy";
      default:
        return "";
    }
  };

  const getModalContent = () => {
    switch (activeModal) {
      case "about":
        return <AboutContent />;
      case "blog":
        return <BlogContent />;
      case "careers":
        return <CareersContent />;
      case "contact":
        return <ContactContent />;
      case "privacy":
        return <PrivacyPolicyContent />;
      case "terms":
        return <TermsOfServiceContent />;
      case "cookie":
        return <CookiePolicyContent />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} title={getModalTitle()}>
      {getModalContent()}
    </Modal>
  );
} 