"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import LandingPage from "@/components/LandingPage";
import { useAuth } from "@/hooks/useAuth";
import TestimonialsSection from "@/components/TestimonialsSection";
import BookingSteps from "@/components/BookingSteps";
import FeaturedDoctorsSection from "@/components/FeaturedDoctorsSection";

type ScreenType = "landing" | "booking" | "patient-dashboard" | "doctor-dashboard";

function SearchParamsHandler({ setShowLoginModal }: { setShowLoginModal: (show: boolean) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("openLogin") === "true") {
      setShowLoginModal(true);
    }
  }, [searchParams, setShowLoginModal]);

  return null; // المكون ده مش بيرندر حاجة في الـ UI
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("landing");
  const [successBookingData, setSuccessBookingData] = useState<any>(null);

  const { isLoggedIn, loading, login, signUp } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [needsVerification, setNeedsVerification] = useState(false); // حالة فحص البريد


  const handleBookingSuccess = (details: any) => {
    setSuccessBookingData(details);
    setCurrentScreen("patient-dashboard");
  };

  const handleNavigation = (screen: ScreenType) => {
    if (screen === "patient-dashboard" && !isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setCurrentScreen(screen);
    }
  };

const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        if (isSignUp) {
            await signUp(email, password, phone, fullName);
            handleCloseModal();
            alert("✅ تم إنشاء حسابك!.");
        } else {
            await login(email, password);
            setShowLoginModal(false);
        }
    } catch (error: any) {
        alert(`عذراً: ${error.message || "حدث خطأ ما"}`);
    }
};

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setIsSignUp(false);
    setNeedsVerification(false);
    setEmail("");
    setPassword("");
    setPhone("");
    setFullName(""); // ← ضيف السطر ده
  };

  return (
    <main className="flex-1 flex flex-col w-full min-h-screen bg-background text-text-main transition-colors relative">

      <Suspense fallback={null}>
        <SearchParamsHandler setShowLoginModal={setShowLoginModal} />
      </Suspense>

      <div className="flex-1 flex flex-col">
        <LandingPage />
        <BookingSteps />
        <TestimonialsSection />
        <FeaturedDoctorsSection />
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn" dir="rtl">
          <div className="bg-card-bg border border-card-border w-full max-w-md p-6 rounded-3xl shadow-2xl space-y-5 text-right relative font-['Cairo']">

            <button
              onClick={handleCloseModal}
              className="absolute top-4 left-4 text-text-muted hover:text-text-main text-lg cursor-pointer select-none"
            >
              ✕
            </button>

            <>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-text-main">
                  {isSignUp ? "إنشاء حساب جديد" : "تسجيل دخول "}
                </h3>
                <p className="text-xs text-text-muted">
                  {isSignUp ? "سجل بياناتك لحفظ روشتاتك الطبية سحابياً." : "أدخل بيانات حسابك لعرض الروشتات والحجوزات الحالية."}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-text-main">الاسم الكامل:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: محمد أحمد علي"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-background text-text-main"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-text-main">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-background text-text-main text-left"
                    dir="ltr"
                  />
                </div>

                {isSignUp && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-bold text-text-main">رقم الهاتف:</label>
                      <span className="text-[10px] text-text-muted bg-card-hover px-2 py-0.5 rounded-md">اختياري</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-background text-text-main text-left"
                      dir="ltr"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-text-main">كلمة السر:</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-background text-text-main text-left"
                    dir="ltr"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand hover:bg-brand-hover text-background font-black py-3 rounded-xl transition shadow-md cursor-pointer text-sm disabled:opacity-50"
                >
                  {loading ? "جاري المعالجة..." : isSignUp ? "إنشاء الحساب الآن" : "تسجيل الدخول"}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-card-border text-xs">
                <span className="text-text-muted">
                  {isSignUp ? "لديك حساب بالفعل؟" : "ليس لديك حساب طبي؟"}
                </span>{" "}
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setPhone(""); }}
                  className="text-brand font-bold hover:underline cursor-pointer"
                >
                  {isSignUp ? "تسجيل الدخول من هنا" : "أنشئ حساباً جديداً"}
                </button>
              </div>
            </>

          </div>
        </div>
      )}

    </main>
  );
}