"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Check,
  CircleDot,
  Eye,
  EyeOff,
  Lock,
  Mail,
  UserCircle,
  CheckCircle2,
} from "lucide-react";

import AnimatedDotBackground from "@/components/auth/AnimatedDotBackground";
import LanguageTabs from "@/components/auth/LanguageTabs";
import RegisterVisualPanel from "@/components/auth/RegisterVisualPanel";
import { getGoogleAccessToken } from "@/lib/socialAuth";
import {
  clearError,
  clearRegisterSuccess,
  registerUser,
  socialAuthUser,
} from "@/store/slices/authSlice";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, registerSuccess } = useSelector(
    (state) => state.auth,
  );

  const [lang, setLang] = useState("en");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [socialLoading, setSocialLoading] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (registerSuccess) {
      dispatch(clearRegisterSuccess());
      router.push("/login?registered=1");
    }

    return () => {
      dispatch(clearError());
    };
  }, [dispatch, registerSuccess, router]);

  const passwordsMatch = useMemo(
    () => form.password.length > 0 && form.password === form.confirmPassword,
    [form.confirmPassword, form.password],
  );

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!acceptedTerms) {
      window.alert("Please accept the terms first.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      window.alert("Passwords do not match.");
      return;
    }

    dispatch(
      registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
      }),
    );
  };

  const handleGoogleSignup = async () => {
    try {
      setSocialLoading("google");
      dispatch(clearError());
      const token = await getGoogleAccessToken();
      const result = await dispatch(
        socialAuthUser({ provider: "google", token }),
      );
      if (socialAuthUser.fulfilled.match(result)) {
        router.push("/");
      }
    } catch (socialError) {
      window.alert(socialError.message || "Google signup failed.");
    } finally {
      setSocialLoading("");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F9FAFB] lg:bg-surface-2 text-text-1">
      <div className="relative z-10 mx-auto flex flex-col lg:grid min-h-screen w-full max-w-[1440px] lg:grid-cols-2">
        <RegisterVisualPanel />

        <section className="flex lg:min-h-screen h-full flex-col items-center justify-start lg:justify-center bg-surface-2 px-5 py-6 sm:px-6 md:px-8 md:py-8 lg:px-12 xl:px-16 2xl:px-20 z-20">
          <div className="w-full max-w-[520px]">
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-transparent lg:bg-surface-1 rounded-none lg:rounded-[18px] border-none lg:border-solid lg:border lg:border-border-1 shadow-none lg:shadow-lg lg:px-7 px-0 py-2 lg:py-6 xl:px-8 xl:py-7 w-full"
            >
              {/* Desktop Header */}
              <header className="mb-5 sm:mb-6 hidden lg:block">
                <p className="mb-1.5 md:mb-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.22em] text-text-3">
                  Create your account
                </p>
                <h1 className="text-[26px] sm:text-[31px] xl:text-[33px] font-black leading-tight tracking-tighter text-text-1">
                  Join Seen Game Pro
                </h1>
                <p className="mt-2 md:mt-2.5 text-[13px] sm:text-[14px] xl:text-[15px] font-medium text-text-2">
                  Free forever. Start earning Qeem coins from day one.
                </p>
              </header>

              {/* Mobile Header per Screenshot */}
              <header className="mb-5 block lg:hidden">
                <p className="mb-1 text-[11px] font-extrabold uppercase tracking-widest text-[#6B7280]">
                  CREATE YOUR ACCOUNT
                </p>
                <h1 className="text-[24px] font-bold text-[#111827] tracking-tight">
                  Join Seen Game Pro
                </h1>
                <p className="mt-1 text-[13px] text-[#6B7280]">
                  Free forever · Earn Qeem coins from day one
                </p>
              </header>

              <LanguageTabs active={lang} onChange={setLang} />

              {registerSuccess ? (
                <div className="mt-4 flex items-start gap-3 rounded-[14px] border border-semantic-green bg-semantic-green-bg px-4 py-3 text-[12px] font-medium text-semantic-green shadow-sm sm:mt-5 sm:text-[13px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    Account created! Welcome to Seen Game Pro. Redirecting...
                  </p>
                </div>
              ) : null}

              {error ? (
                <div className="mt-4 rounded-[14px] border border-semantic-red-bg bg-semantic-red-bg/50 px-4 py-3 text-[12px] font-medium text-semantic-red shadow-sm sm:mt-5 sm:text-[13px]">
                  {error}
                </div>
              ) : null}

              <form
                onSubmit={handleSubmit}
                className="mt-4 space-y-3.5 sm:mt-5 sm:space-y-4"
              >
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
                  <div className="space-y-1.5 lg:space-y-2">
                    <label className="text-[12px] font-bold text-[#4B5563] lg:font-semibold lg:text-text-1 sm:text-[13px]">
                      First Name
                    </label>
                    <Input
                      icon={UserCircle}
                      value={form.firstName}
                      onChange={(event) =>
                        setForm({ ...form, firstName: event.target.value })
                      }
                      placeholder="Alex"
                    />
                  </div>
                  <div className="space-y-1.5 lg:space-y-2">
                    <label className="text-[12px] font-bold text-[#4B5563] lg:font-semibold lg:text-text-1 sm:text-[13px]">
                      Last Name
                    </label>
                    <Input
                      icon={UserCircle}
                      value={form.lastName}
                      onChange={(event) =>
                        setForm({ ...form, lastName: event.target.value })
                      }
                      placeholder="Rahman"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 lg:space-y-2">
                  <label className="text-[12px] font-bold text-[#4B5563] lg:font-semibold lg:text-text-1 sm:text-[13px]">
                    Username (leaderboard name)
                  </label>
                  <Input
                    icon={UserCircle}
                    value={form.username}
                    onChange={(event) =>
                      setForm({ ...form, username: event.target.value })
                    }
                    placeholder="AlexR_21"
                  />
                  <p className="text-[10px] text-text-3 sm:text-[11px]">
                    <span className="hidden lg:inline">3-50 characters, letters, numbers and underscores only</span>
                    <span className="inline lg:hidden">3-50 chars, letters, numbers, _</span>
                  </p>
                </div>

                <div className="space-y-1.5 lg:space-y-2">
                  <label className="text-[12px] font-bold text-[#4B5563] lg:font-semibold lg:text-text-1 sm:text-[13px]">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    icon={Mail}
                    value={form.email}
                    onChange={(event) =>
                      setForm({ ...form, email: event.target.value })
                    }
                    placeholder="alex@example.com"
                  />
                </div>

                <div className="space-y-1.5 lg:space-y-2">
                  <label className="text-[12px] font-bold text-[#4B5563] lg:font-semibold lg:text-text-1 sm:text-[13px]">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      icon={Lock}
                      value={form.password}
                      onChange={(event) =>
                        setForm({ ...form, password: event.target.value })
                      }
                      placeholder="Min 6 characters"
                      className="pr-14"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3 transition-colors hover:text-brand"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 lg:space-y-2">
                  <label className="text-[12px] font-bold text-[#4B5563] lg:font-semibold lg:text-text-1 sm:text-[13px]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      icon={Lock}
                      value={form.confirmPassword}
                      onChange={(event) =>
                        setForm({ ...form, confirmPassword: event.target.value })
                      }
                      placeholder="Re-enter password"
                      className={`pr-14 ${
                        !!form.confirmPassword && !passwordsMatch
                          ? "border-semantic-red focus:border-semantic-red focus:ring-semantic-red/10"
                          : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-3 transition-colors hover:text-brand"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {form.confirmPassword && !passwordsMatch && (
                    <p className="text-[10px] text-semantic-red sm:text-[11px]">
                      Passwords do not match yet.
                    </p>
                  )}
                </div>

                <label className="flex items-start gap-3 pt-1 text-[11px] font-medium leading-relaxed text-[#6B7280] lg:text-text-2 sm:text-[12px]">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    className="mt-1 h-4 w-4 border-border-1 text-brand focus:ring-brand rounded-[4px] lg:rounded-sm"
                  />
                  <span>
                    I agree to the{" "}
                    <span className="font-semibold text-brand lg:text-brand text-[#4E5BFF]">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-brand lg:text-brand text-[#4E5BFF]">
                      Privacy Policy
                    </span>
                    . Platform guidelines: no Israel or Iran-related content.
                  </span>
                </label>

                <Button
                  type="submit"
                  disabled={loading || !!socialLoading}
                  variant="primary"
                  className="w-full h-[48px] lg:h-[58px] mt-2 rounded-xl lg:rounded-[20px] text-[14px] sm:text-[15px] font-bold tracking-wide"
                  style={{ background: 'linear-gradient(90deg, #6248FF 0%, #486CFF 100%)' }}
                >
                  {loading && !socialLoading ? (
                    "Creating your account..."
                  ) : (
                    <>
                      <CheckCircle2
                        className="h-[18px] w-[18px] text-white/90 mr-2"
                        strokeWidth={2.5}
                      />
                      <span className="tracking-tight">
                        Create My Account — Free
                      </span>
                    </>
                  )}
                </Button>
              </form>

              <div className="relative mt-5 lg:mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-1" />
                </div>
                <div className="relative mt-5 mb-5 lg:mt-6 lg:mb-6 flex items-center justify-center">
                  <span className="relative bg-[#F9FAFB] lg:bg-surface-1 px-4 text-[13px] font-medium text-text-3">
                    or sign up with
                  </span>
                </div>
              </div>

              <div className="mt-4">
                {/* Desktop Google Button */}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleGoogleSignup}
                  disabled={loading || !!socialLoading}
                  className="w-full justify-center h-[46px] lg:h-[52px] text-[13px] sm:text-[14px] font-bold text-[#374151] bg-white border border-border-1 rounded-xl lg:rounded-[16px]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
                    <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4558 15.9119 17.5888 17.1589 16.3414 17.9711V20.9701H20.1794C22.4339 18.906 23.766 15.8563 23.766 12.2764Z" fill="#4285F4"/>
                    <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1845 21.1103L16.3465 18.1113C15.2858 18.8297 13.8846 19.2317 12.2452 19.2317C9.11746 19.2317 6.46344 17.1353 5.5133 14.3036H1.54V17.3712C3.51859 21.2913 7.59451 24.0008 12.2401 24.0008Z" fill="#34A853"/>
                    <path d="M5.50824 14.3036C5.26054 13.5686 5.12336 12.7858 5.12336 11.9984C5.12336 11.211 5.26054 10.4282 5.50824 9.69317V6.62561H1.54C0.706734 8.2439 0.240051 10.0633 0.240051 11.9984C0.240051 13.9334 0.706734 15.7529 1.54 17.3712L5.50824 14.3036Z" fill="#FBBC05"/>
                    <path d="M12.2401 4.75668C13.9979 4.72621 15.6901 5.38131 16.9451 6.58501L20.2607 3.26941C18.1501 1.2384 15.2505 0.081156 12.2401 0.000104167C7.59451 0.000104167 3.51859 2.70957 1.54 6.62967L5.50824 9.69722C6.46344 6.86552 9.11746 4.76918 12.2401 4.75668Z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <p className="mt-6 text-center text-[12.5px] font-medium text-text-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#4E5BFF] hover:brightness-110 ml-0.5"
                >
                  Login →
                </Link>
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}
