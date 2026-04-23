"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { useI18n } from "@/lib/i18n";
import api from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const token = String(searchParams.get("token") || "").trim();

  const [tokenStatus, setTokenStatus] = useState("checking");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [form, setForm] = useState({ password: "", confirmPassword: "" });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenStatus("invalid");
        return;
      }

      try {
        await api.post("/auth/reset-password/verify", { token });
        setTokenStatus("valid");
      } catch {
        setTokenStatus("invalid");
      }
    };

    verifyToken();
  }, [token]);

  const passwordError = useMemo(() => {
    const password = form.password;
    if (password.length < 6) return t("auth.password_min_length");
    if (!/[a-z]/.test(password)) return t("auth.password_require_lowercase");
    if (!/[A-Z]/.test(password)) return t("auth.password_require_uppercase");
    if (!/[^A-Za-z0-9]/.test(password)) return t("auth.password_require_special");
    return "";
  }, [form.password, t]);

  const confirmError = useMemo(() => {
    if (!form.confirmPassword) return "";
    if (form.confirmPassword !== form.password) return t("auth.passwords_do_not_match");
    return "";
  }, [form.confirmPassword, form.password, t]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (tokenStatus !== "valid" || passwordError || confirmError) {
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/auth/reset-password", { token, password: form.password });
      toast.success(t("auth.password_reset_success"));
      router.push("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || t("auth.password_reset_failed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (tokenStatus === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-2 px-4">
        <p className="text-[14px] font-semibold text-text-2">{t("common.loading")}</p>
      </main>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <main className="min-h-screen bg-surface-2 px-4 py-10">
        <div className="mx-auto w-full max-w-[480px] rounded-[18px] border border-border-1 bg-surface-1 p-6 shadow-lg">
          <h1 className="text-[26px] font-black tracking-tight text-text-1">{t("auth.reset_link_invalid_title")}</h1>
          <p className="mt-2 text-[14px] text-text-2">{t("auth.reset_link_invalid_subtitle")}</p>
          <p className="mt-5">
            <Link href="/forgot-password" className="font-bold text-brand hover:brightness-110">
              {t("auth.request_new_link")}
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-surface-2 px-4 py-10">
      <div className="mx-auto w-full max-w-[480px] rounded-[18px] border border-border-1 bg-surface-1 p-6 shadow-lg">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-text-3">
          {t("auth.reset_password_title")}
        </p>
        <h1 className="text-[28px] font-black leading-tight tracking-tight text-text-1">
          {t("auth.set_new_password")}
        </h1>
        <p className="mt-2 text-[14px] text-text-2">{t("auth.set_new_password_subtitle")}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-text-1">{t("auth.password")}</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                icon={Lock}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                placeholder={t("auth.min_six_chars")}
                className={`pr-14 ${((touched.password || submitted) && passwordError) ? "border-semantic-red focus:border-semantic-red focus:ring-semantic-red/10" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3 transition-colors hover:text-brand"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {(touched.password || submitted) && passwordError ? (
              <p className="text-[11px] text-semantic-red">{passwordError}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-text-1">{t("auth.confirm_password")}</label>
            <Input
              type={showPassword ? "text" : "password"}
              icon={Lock}
              value={form.confirmPassword}
              onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
              placeholder={t("auth.reenter_password")}
              className={((touched.confirmPassword || submitted) && confirmError) ? "border-semantic-red focus:border-semantic-red focus:ring-semantic-red/10" : ""}
            />
            {(touched.confirmPassword || submitted) && confirmError ? (
              <p className="text-[11px] text-semantic-red">{confirmError}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            variant="primary"
            className="h-[50px] w-full rounded-xl text-[14px] font-bold"
            style={{ background: "linear-gradient(90deg, #6248FF 0%, #486CFF 100%)" }}
          >
            {submitting ? t("auth.updating_password") : t("auth.update_password")}
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

