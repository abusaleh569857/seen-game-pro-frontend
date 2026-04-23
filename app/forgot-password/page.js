"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "react-toastify";
import { useI18n } from "@/lib/i18n";
import api from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const emailError = useMemo(() => {
    const value = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      return t("auth.invalid_email");
    }
    return "";
  }, [email, t]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched(true);
    if (emailError) return;

    try {
      setSubmitting(true);
      await api.post("/auth/forgot-password", { email: email.trim() });
      setSent(true);
      toast.success(t("auth.reset_email_sent"));
    } catch (error) {
      toast.error(error?.response?.data?.message || t("auth.reset_request_failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-2 px-4 py-10">
      <div className="mx-auto w-full max-w-[480px] rounded-[18px] border border-border-1 bg-surface-1 p-6 shadow-lg">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-text-3">
          {t("auth.forgot_password")}
        </p>
        <h1 className="text-[28px] font-black leading-tight tracking-tight text-text-1">
          {t("auth.reset_password_title")}
        </h1>
        <p className="mt-2 text-[14px] text-text-2">{t("auth.reset_password_subtitle")}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-text-1">{t("auth.email_address")}</label>
            <Input
              type="email"
              icon={Mail}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="alex@example.com"
              className={(touched && emailError) ? "border-semantic-red focus:border-semantic-red focus:ring-semantic-red/10" : ""}
            />
            {touched && emailError ? (
              <p className="text-[11px] text-semantic-red">{emailError}</p>
            ) : null}
          </div>

          {sent ? (
            <div className="rounded-[12px] border border-semantic-green bg-semantic-green-bg px-3 py-2 text-[12px] font-medium text-semantic-green">
              {t("auth.reset_email_sent")}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={submitting}
            variant="primary"
            className="h-[50px] w-full rounded-xl text-[14px] font-bold"
            style={{ background: "linear-gradient(90deg, #6248FF 0%, #486CFF 100%)" }}
          >
            <span className="flex items-center justify-center gap-2">
              <Send className="h-4 w-4" />
              {submitting ? t("auth.sending") : t("auth.send_reset_link")}
            </span>
          </Button>
        </form>

        <p className="mt-6 text-center text-[13px] text-text-2">
          <Link href="/login" className="font-bold text-brand hover:brightness-110">
            {t("auth.back_to_login")}
          </Link>
        </p>
      </div>
    </main>
  );
}

