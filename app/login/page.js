"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, Check } from "lucide-react";

import LanguageTabs from "@/components/auth/LanguageTabs";
import LoginVisualPanel from "@/components/auth/LoginVisualPanel";
import { useI18n } from "@/lib/i18n";
import { isRtlLanguage, normalizeLanguageCode } from "@/lib/languages";
import { getGoogleAccessToken, getFacebookAccessToken } from "@/lib/socialAuth";
import { clearError, loginUser, socialAuthUser } from "@/store/slices/authSlice";
import { setSelectedLang } from "@/store/slices/quizSlice";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const { loading, error, isLoggedIn, user } = useSelector((state) => state.auth);
  const selectedLang = useSelector((state) => state.quiz.selectedLang);
  const { t } = useI18n();

  const [lang, setLang] = useState(selectedLang);
  const isRTL = isRtlLanguage(lang);
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isLoggedIn) {
      router.push(user?.role === "admin" ? "/admin" : "/");
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, isLoggedIn, router, user]);

  useEffect(() => {
    dispatch(setSelectedLang(normalizeLanguageCode(lang)));
  }, [dispatch, lang]);

  useEffect(() => {
    setLang(selectedLang);
  }, [selectedLang]);

  const emailError = useMemo(() => {
    const email = form.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return t("auth.invalid_email");
    }
    return "";
  }, [form.email, t]);

  const passwordError = useMemo(() => {
    if (!form.password.trim()) {
      return t("auth.password_required");
    }
    return "";
  }, [form.password, t]);

  const credentialError = useMemo(() => {
    if (!error) return "";
    const raw = String(error);
    const lower = raw.toLowerCase();
    if (
      lower.includes("invalid") ||
      lower.includes("incorrect") ||
      lower.includes("credentials") ||
      lower.includes("unauthorized")
    ) {
      return t("auth.invalid_credentials");
    }
    return raw;
  }, [error, t]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    dispatch(clearError());

    if (emailError || passwordError) {
      return;
    }

    const result = await dispatch(
      loginUser({
        email: form.email,
        password: form.password,
      }),
    );

    if (loginUser.fulfilled.match(result)) {
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setSocialLoading("google");
      dispatch(clearError());
      const token = await getGoogleAccessToken();
      const result = await dispatch(socialAuthUser({ provider: "google", token }));
      if (socialAuthUser.fulfilled.match(result)) {
        router.push("/");
      }
    } catch (socialError) {
      toast.error(socialError.message || t("auth.google_login_failed"));
    } finally {
      setSocialLoading("");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setSocialLoading("facebook");
      dispatch(clearError());
      const token = await getFacebookAccessToken();
      const result = await dispatch(socialAuthUser({ provider: "facebook", token }));
      if (socialAuthUser.fulfilled.match(result)) {
        router.push("/");
      }
    } catch (socialError) {
      toast.error(socialError.message || t("auth.facebook_login_failed"));
    } finally {
      setSocialLoading("");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-surface-2 text-text-1">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col lg:grid lg:grid-cols-2">
        <LoginVisualPanel />

        <section className="z-20 flex h-full flex-col items-center justify-start bg-surface-2 px-5 py-6 lg:min-h-screen lg:justify-center lg:px-12 xl:px-16 2xl:px-20 sm:px-6 md:px-8 md:py-8">
          <div className="w-full max-w-[480px]">
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full rounded-none border-none bg-transparent px-0 py-2 shadow-none lg:rounded-[18px] lg:border lg:border-border-1 lg:bg-surface-1 lg:px-7 lg:py-6 lg:shadow-lg xl:px-8 xl:py-7"
            >
              <header className="mb-5 hidden lg:block sm:mb-6">
                <p className="mb-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-text-3 md:mb-2 md:text-[11px] md:tracking-[0.22em]">
                  {t("auth.welcome_back")}
                </p>
                <h1 className="text-[26px] font-black leading-tight tracking-tighter text-text-1 sm:text-[31px] xl:text-[33px]">
                  {t("auth.login_title")}
                </h1>
                <p className="mt-2 text-[13px] font-medium text-text-2 md:mt-2.5 sm:text-[14px] xl:text-[15px]">
                  {t("auth.login_subtitle")}
                </p>
              </header>

              <header className="mb-5 block lg:hidden">
                <p className="mb-1 text-[11px] font-extrabold uppercase tracking-widest text-[#6B7280]">
                  {t("auth.welcome_back")}
                </p>
                <h1 className="text-[24px] font-bold tracking-tight text-[#111827]">
                  {t("auth.mobile_login_title")}
                </h1>
                <p className="mt-1 text-[13px] text-[#6B7280]">{t("auth.mobile_login_subtitle")}</p>
              </header>

              <LanguageTabs active={lang} onChange={setLang} />

              {registered ? (
                <div className="mt-4 flex items-start gap-3 rounded-[14px] border border-semantic-green bg-semantic-green-bg px-4 py-3 text-[12px] font-medium text-semantic-green shadow-sm sm:mt-5 sm:text-[13px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>{t("auth.account_created")}</p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4">
                <div className="space-y-1.5 lg:space-y-2">
                  <label className="text-[12px] font-bold text-[#4B5563] sm:text-[13px] lg:text-text-1 lg:font-semibold">
                    <span className="hidden lg:inline">{t("auth.email_address")}</span>
                    <span className="inline lg:hidden">{t("auth.email_or_username")}</span>
                  </label>
                  <Input
                    type="email"
                    icon={Mail}
                    value={form.email}
                    onChange={(event) => {
                      setForm({ ...form, email: event.target.value });
                      if (error) dispatch(clearError());
                    }}
                    onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                    placeholder={t("auth.email_placeholder")}
                    className={((touched.email || submitted) && emailError) ? "border-semantic-red focus:border-semantic-red focus:ring-semantic-red/10" : ""}
                  />
                  {(touched.email || submitted) && emailError ? (
                    <p className="text-[10px] text-semantic-red sm:text-[11px]">{emailError}</p>
                  ) : null}
                </div>

                <div className="space-y-1.5 lg:space-y-2">
                  <label className="text-[12px] font-bold text-[#4B5563] sm:text-[13px] lg:text-text-1 lg:font-semibold">
                    {t("auth.password")}
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      icon={Lock}
                      value={form.password}
                      onChange={(event) => {
                        setForm({ ...form, password: event.target.value });
                        if (error) dispatch(clearError());
                      }}
                      onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                      placeholder={t("auth.password")}
                      className={`${isRTL ? "pl-14" : "pr-14"} ${
                        ((touched.password || submitted) && passwordError)
                          ? "border-semantic-red focus:border-semantic-red focus:ring-semantic-red/10"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className={`absolute top-1/2 -translate-y-1/2 text-text-3 transition-colors hover:text-brand ${isRTL ? "left-4" : "right-4"}`}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {(touched.password || submitted) && passwordError ? (
                    <p className="text-[10px] text-semantic-red sm:text-[11px]">{passwordError}</p>
                  ) : null}
                  {!passwordError && !emailError && credentialError ? (
                    <p className="text-[10px] text-semantic-red sm:text-[11px]">{credentialError}</p>
                  ) : null}
                  <div className={`mt-2 block ${isRTL ? "text-left" : "text-right"}`}>
                    <Link href="/forgot-password" className="text-[13px] font-bold text-[#4E5BFF]">
                      {t("auth.forgot_password")}
                    </Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !!socialLoading}
                  variant="primary"
                  className="mt-4 h-[48px] w-full rounded-xl text-[15px] font-bold tracking-wide lg:h-[58px] lg:rounded-[20px]"
                  style={{ background: "linear-gradient(90deg, #6248FF 0%, #486CFF 100%)" }}
                >
                  {loading && !socialLoading ? (
                    t("auth.logging_in")
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="lg:hidden">&rarr;</span>
                      {t("auth.login_button")}
                    </span>
                  )}
                </Button>
              </form>

              <div className="relative mt-5 lg:mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-1" />
                </div>
                <div className="relative mb-5 mt-5 flex items-center justify-center lg:mb-6 lg:mt-6">
                  <span className="relative bg-surface-2 px-4 text-[13px] font-medium text-text-3 lg:bg-surface-1">
                    {t("auth.or_continue_with")}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid w-full grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading || !!socialLoading}
                  className="flex h-[46px] items-center justify-center rounded-xl border border-border-1 bg-white text-[13px] font-bold text-[#374151] shadow-sm transition-colors hover:bg-gray-50 sm:h-[52px] sm:text-[14px] lg:rounded-[16px]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 sm:mr-3">
                    <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4558 15.9119 17.5888 17.1589 16.3414 17.9711V20.9701H20.1794C22.4339 18.906 23.766 15.8563 23.766 12.2764Z" fill="#4285F4"/>
                    <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1845 21.1103L16.3465 18.1113C15.2858 18.8297 13.8846 19.2317 12.2452 19.2317C9.11746 19.2317 6.46344 17.1353 5.5133 14.3036H1.54V17.3712C3.51859 21.2913 7.59451 24.0008 12.2401 24.0008Z" fill="#34A853"/>
                    <path d="M5.50824 14.3036C5.26054 13.5686 5.12336 12.7858 5.12336 11.9984C5.12336 11.211 5.26054 10.4282 5.50824 9.69317V6.62561H1.54C0.706734 8.2439 0.240051 10.0633 0.240051 11.9984C0.240051 13.9334 0.706734 15.7529 1.54 17.3712L5.50824 14.3036Z" fill="#FBBC05"/>
                    <path d="M12.2401 4.75668C13.9979 4.72621 15.6901 5.38131 16.9451 6.58501L20.2607 3.26941C18.1501 1.2384 15.2505 0.081156 12.2401 0.000104167C7.59451 0.000104167 3.51859 2.70957 1.54 6.62967L5.50824 9.69722C6.46344 6.86552 9.11746 4.76918 12.2401 4.75668Z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={loading || !!socialLoading}
                  className="flex h-[46px] items-center justify-center rounded-xl border border-border-1 bg-white text-[13px] font-bold text-[#374151] shadow-sm transition-colors hover:bg-gray-50 sm:h-[52px] sm:text-[14px] lg:rounded-[16px]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 sm:mr-3">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0C5.372 0 0 5.405 0 12.073C0 18.101 4.418 23.094 10.125 24V15.56H7.078V12.073H10.125V9.418C10.125 6.388 11.916 4.717 14.657 4.717C15.97 4.717 17.343 4.953 17.343 4.953V7.935H15.829C14.339 7.935 13.875 8.868 13.875 9.829V12.073H17.187L16.658 15.56H13.875V24C19.582 23.094 24 18.101 24 12.073Z" fill="#1877F2"/>
                  </svg>
                  Facebook
                </button>
              </div>

              <p className="mt-6 text-center text-[13px] font-medium text-text-2">
                {t("auth.dont_have_account")}{" "}
                <Link href="/register" className="ml-1 font-bold text-[#4E5BFF] hover:brightness-110">
                  {t("auth.create_account_link")}
                </Link>
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-2" />}>
      <LoginForm />
    </Suspense>
  );
}

