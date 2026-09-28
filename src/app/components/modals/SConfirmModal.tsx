import { useTranslation } from "react-i18next";
import { AppModal } from "./AppModal";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { DangerButton } from "../buttons/DangerButton";

interface SConfirmModalProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
  icon?: React.ReactNode;
}

export function SConfirmModal({
  title,
  message,
  confirmLabel,
  onConfirm,
  onClose,
  danger = false,
  icon,
}: SConfirmModalProps) {
  const { t: translateActions } = useTranslation("actions");

  return (
    <AppModal
      open={true}
      title={title}
      onClose={onClose}
      size="sm"
      icon={icon}
      footer={
        <>
          <SecondaryButton onClick={onClose} size="md">
            {translateActions("cancel")}
          </SecondaryButton>
          {danger ? (
            <DangerButton onClick={onConfirm} size="md">
              {confirmLabel}
            </DangerButton>
          ) : (
            <PrimaryButton onClick={onConfirm} size="md">
              {confirmLabel}
            </PrimaryButton>
          )}
        </>
      }
    >
      <p className="app-modal-confirm__message">{message}</p>
    </AppModal>
  );
}
