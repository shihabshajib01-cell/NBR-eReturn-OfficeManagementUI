import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AppTextField } from "../forms/AppTextField";
import { AppModal } from "../modals/AppModal";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({ open, onClose }: ForgotPasswordModalProps) {
  const { t: translate } = useTranslation("auth");
  const [userId, setUserId] = useState("");

  const footer = (
    <div className="flex gap-3">
      <button type="button" onClick={onClose} className="action-btn action-btn--secondary flex-1">
        {translate("forgotPassword.cancel")}
      </button>
      <button type="button" onClick={onClose} className="action-btn action-btn--primary flex-1">
        {translate("forgotPassword.sendResetInstructions")}
      </button>
    </div>
  );

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={translate("forgotPassword.title")}
      size="sm"
      footer={footer}
    >
      <p className="modal-form-header__subtitle mb-4">{translate("forgotPassword.subtitle")}</p>
      <AppTextField
        id="forgot-password-user-id"
        label={translate("forgotPassword.placeholder")}
        value={userId}
        onChange={setUserId}
        placeholder={translate("forgotPassword.placeholder")}
        autoComplete="username"
      />
    </AppModal>
  );
}
