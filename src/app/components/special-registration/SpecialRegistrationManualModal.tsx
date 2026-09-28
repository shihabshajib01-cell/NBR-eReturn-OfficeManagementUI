import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppModal } from "../modals/AppModal";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { SpecialRegistrationManualContent } from "./SpecialRegistrationManualContent";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SpecialRegistrationManualModal({ open, onClose }: Props) {
  const { t } = useTranslation("specialRegistration");

  return (
    <AppModal
      open={open}
      title={t("manual.instructionsTitle")}
      icon={<BookOpen size={18} strokeWidth={1.8} />}
      onClose={onClose}
      size="lg"
      layer="top"
      footer={
        <div className="sr-manual-modal__footer-actions">
          <SecondaryButton size="lg" onClick={onClose}>
            {t("manual.close")}
          </SecondaryButton>
        </div>
      }
    >
      <div className="sr-manual-modal__content">
        <SpecialRegistrationManualContent onApply={onClose} variant="modal" />
      </div>
    </AppModal>
  );
}
