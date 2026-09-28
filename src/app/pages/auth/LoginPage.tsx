import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LoginBrandPanel } from "../../components/auth/LoginBrandPanel";
import { LoginForm } from "../../components/auth/LoginForm";
import { ForgotPasswordModal } from "../../components/auth/ForgotPasswordModal";
import imgFileReturns from "../../../imports/ChatGPT_Image_Jun_10__2026__05_25_31_PM.png";
import imgTrackApprovals from "../../../imports/ChatGPT_Image_Jun_10__2026__05_22_53_PM.png";
import imgStayUpdated from "../../../imports/ChatGPT_Image_Jun_10__2026__05_27_47_PM.png";

export function LoginPage() {
  const { t: translate } = useTranslation("auth");
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  const slides = [
    {
      headline: translate("slides.slide1.headline"),
      text: translate("slides.slide1.text"),
      image: imgFileReturns,
    },
    {
      headline: translate("slides.slide2.headline"),
      text: translate("slides.slide2.text"),
      image: imgTrackApprovals,
    },
    {
      headline: translate("slides.slide3.headline"),
      text: translate("slides.slide3.text"),
      image: imgStayUpdated,
    },
  ];

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "var(--color-background)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isDesktop ? "64px 32px" : "24px 16px",
        position: "relative",
        overflow: "hidden",
        transition: "background-color var(--motion-base) var(--ease-standard)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isDesktop ? "row" : "column",
          gap: isDesktop ? 48 : 32,
          alignItems: isDesktop ? "center" : "stretch",
          maxWidth: 1280,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {isDesktop && <LoginBrandPanel slides={slides} />}

        <LoginForm
          isDesktop={isDesktop}
          onForgotPassword={() => setForgotPasswordOpen(true)}
        />
      </div>

      <ForgotPasswordModal
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </div>
  );
}
