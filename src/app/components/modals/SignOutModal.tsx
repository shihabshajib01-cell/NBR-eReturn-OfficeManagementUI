import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppModal } from "./AppModal";
import { SecondaryButton } from "../buttons/SecondaryButton";
import { DangerButton } from "../buttons/DangerButton";

interface SignOutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function SignOutModal({ onConfirm, onCancel }: SignOutModalProps) {
  const { t: translate } = useTranslation("modals");

  return (
    <AppModal
      open={true}
      title={`${translate("signOut.title")}?`}
      onClose={onCancel}
      size="sm"
      icon={<LogOut size={16} strokeWidth={1.75} />}
      footer={
        <>
          <SecondaryButton onClick={onCancel} size="md">
            {translate("signOut.cancel")}
          </SecondaryButton>
          <DangerButton onClick={onConfirm} size="md">
            {translate("signOut.confirm")}
          </DangerButton>
        </>
      }
    >
      <p className="app-modal-confirm__message">{translate("signOut.message")}</p>
    </AppModal>
  );
}
