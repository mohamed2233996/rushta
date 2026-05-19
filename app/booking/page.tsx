"use client";

import Link from "next/link";
import React, { useState, useEffect, Suspense } from "react";
import { useBooking } from "@/hooks/useBooking";
import { useDoctors } from "@/hooks/useDoctors";
import { useSearchParams } from "next/navigation";

function BookingParamsHandler({
    doctors,
    step,
    setSelectedDoctor,
    setStep
}: {
    doctors: any[];
    step: number;
    setSelectedDoctor: (doc: any) => void;
    setStep: React.Dispatch<React.SetStateAction<1 | 2 | 3>> | ((step: 1 | 2 | 3) => void);
}) {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    useEffect(() => {
        if (id && doctors.length > 0 && step === 1) {
            const matchedDoctor = doctors.find(doc => String(doc.id) === String(id));

            if (matchedDoctor) {
                setSelectedDoctor(matchedDoctor);
                setStep(2); // الرقم 2 متوافق تماماً الآن مع النوع الجديد
            }
        }
    }, [id, doctors, step, setSelectedDoctor, setStep]);

    return null;
}

export default function BookingWizard() {
    const {
        step, setStep, days,
        selectedDoctor, setSelectedDoctor,
        selectedDay, setSelectedDay,
        selectedTime, setSelectedTime,
        createAppointment, resetWizard,
    } = useBooking();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { doctors, loading, error } = useDoctors();

    const [bookingResult, setBookingResult] = useState<null | {
        doctor: string;
        day: string;
        date: string;
        time: string;
        patientName: string;
        email: string;
        phone: string;
    }>(null);

    // 🛑 تم حذف السطر القديم والـ useEffect من هنا لتفادي كراش الـ Build

    const handleSelectDoctor = (doc: typeof doctors[0]) => {
        setSelectedDoctor(doc);
        setStep(2);
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !email || !phone) return;

        setIsOtpSent(true);
        alert("محاكاة: تم إرسال كود التأكيد (1234) على موبايلك وإيميلك");
    };

    const handleVerifyOtp = async () => {
        if (otpCode !== "1234") {
            alert("الكود غير صحيح، جرب: 1234");
            return;
        }

        setIsSubmitting(true);
        const result = await createAppointment(fullName, email, phone);
        setIsSubmitting(false);

        if (result.success) {
            setBookingResult({
                doctor: selectedDoctor?.name ?? "",
                day: selectedDay?.label ?? "",
                date: selectedDay?.date ?? "",
                time: selectedTime,
                patientName: fullName,
                email,
                phone,
            });
            resetWizard();
        } else {
            alert(`حصل خطأ: ${result.error}`);
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-main py-8 transition-colors" dir="rtl">

            <Suspense fallback={null}>
                <BookingParamsHandler
                    doctors={doctors}
                    step={step}
                    setSelectedDoctor={setSelectedDoctor}
                    setStep={setStep}
                />
            </Suspense>

            {bookingResult && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" dir="rtl">
                    <div className="bg-card-bg border border-card-border rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5 text-right">

                        {/* أيقونة النجاح */}
                        <div className="flex flex-col items-center gap-2 text-center">
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-3xl">✅</div>
                            <h2 className="text-xl font-black text-text-main">تم تأكيد الحجز بنجاح!</h2>
                            <p className="text-sm text-text-muted">هيوصلك تأكيد على موبايلك وإيميلك قريباً</p>
                        </div>

                        {/* تفاصيل الحجز */}
                        <div className="bg-brand-light border border-brand/10 rounded-xl p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-text-muted">المريض</span>
                                <span className="font-bold text-text-main">{bookingResult.patientName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">الطبيب</span>
                                <span className="font-bold text-text-main">{bookingResult.doctor}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">اليوم</span>
                                <span className="font-bold text-text-main">{bookingResult.day} ({bookingResult.date})</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">الوقت</span>
                                <span className="font-bold text-text-main">{bookingResult.time}</span>
                            </div>
                            <div className="border-t border-brand/10 pt-2 flex justify-between">
                                <span className="text-text-muted">الإيميل</span>
                                <span className="font-bold text-text-main" dir="ltr">{bookingResult.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">الموبايل</span>
                                <span className="font-bold text-text-main" dir="ltr">{bookingResult.phone}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setBookingResult(null);
                            }}
                            className="w-full border border-card-border hover:bg-card-hover text-text-muted font-bold py-3 rounded-xl transition cursor-pointer text-sm"
                        >
                            إغلاق
                        </button>

                        <button
                            onClick={() => {
                                const text = `
                                                🏥 تذكرة حجز كشف طبي
                                                ━━━━━━━━━━━━━━━━━
                                                👤 المريض : ${bookingResult.patientName}
                                                👨‍⚕️ الطبيب  : ${bookingResult.doctor}
                                                📅 اليوم  : ${bookingResult.day} (${bookingResult.date})
                                                ⏰ الوقت  : ${bookingResult.time}
                                                ━━━━━━━━━━━━━━━━━
                                                📧 ${bookingResult.email}
                                                📱 ${bookingResult.phone}
                                                        `.trim();
                                const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = `تذكرة-حجز-${bookingResult.patientName}.txt`;
                                a.click();
                                URL.revokeObjectURL(url);
                            }}
                            className="w-full bg-brand hover:bg-brand-hover text-background font-black py-3 rounded-xl transition cursor-pointer"
                        >
                            📄 حفظ تذكرة الحجز
                        </button>
                    </div>
                </div>
            )}
            <div className="max-w-2xl mx-auto px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/"
                        className="text-sm font-medium text-text-muted hover:text-brand transition flex items-center gap-1"
                    >
                        ← إلغاء والرجوع للرئيسية
                    </Link>
                    <span className="text-xs text-text-muted">خطوة {step} من ٣</span>
                </div>

                {/* ── Step 1: اختيار الطبيب ── */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="text-center md:text-right">
                            <h2 className="text-2xl font-black text-text-main">اختر الطبيب المعالج</h2>
                            <p className="text-text-muted text-sm mt-1">من فضلك حدد الدكتور لعرض المواعيد المتاحة لديه.</p>
                        </div>

                        {loading && (
                            <div className="text-center py-10 text-text-muted text-sm animate-pulse">
                                جاري تحميل قائمة الأطباء...
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-6 text-red-500 text-sm">
                                حصل خطأ في تحميل البيانات: {error}
                            </div>
                        )}

                        {!loading && !error && (
                            <div className="grid grid-cols-1 gap-4">
                                {doctors.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="bg-card-bg border border-card-border p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-brand/40 transition"
                                    >
                                        <div className="space-y-1 text-right">
                                            <h3 className="font-bold text-lg text-text-main">{doc.name}</h3>
                                            <p className="text-sm text-text-muted">{doc.specialty}</p>
                                            <p className="text-xs font-bold text-brand bg-brand-light inline-block px-2.5 py-1 rounded-md mt-2">
                                                قيمة الكشف: {doc.price} ج.م
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleSelectDoctor(doc)}
                                            className="w-full md:w-auto bg-brand hover:bg-brand-hover text-background font-black px-5 py-2.5 rounded-xl text-sm transition cursor-pointer"
                                        >
                                            عرض المواعيد ←
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Step 2: اختيار اليوم والوقت ── */}
                {step === 2 && selectedDoctor && (
                    <div className="space-y-6">
                        <div className="text-center md:text-right">
                            <button onClick={() => setStep(1)} className="text-xs text-brand font-bold mb-2 inline-block cursor-pointer">
                                ← العودة لاختيار الدكتور
                            </button>
                            <h2 className="text-2xl font-black text-text-main">حدد ميعاد الكشف المناسب</h2>
                            <p className="text-text-muted text-sm mt-1">
                                تصفح الأيام والساعات المتاحة لـ <span className="font-bold text-text-main">{selectedDoctor.name}</span>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-text-main block text-right">١. اختر اليوم:</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {days.map((day) => (
                                    <button
                                        key={day.id}
                                        onClick={() => { setSelectedDay(day); setSelectedTime(""); }}
                                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer ${selectedDay?.id === day.id
                                            ? "border-brand bg-brand-light text-brand font-black"
                                            : "border-card-border bg-card-bg hover:border-brand/40"
                                            }`}
                                    >
                                        <span className="text-sm">{day.label}</span>
                                        <span className="text-xs text-text-muted">{day.date}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedDay && (
                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-bold text-text-main block text-right">٢. اختر التوقيت:</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {selectedDoctor.timeSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedTime(slot)}
                                            className={`p-2.5 text-xs rounded-xl border text-center transition cursor-pointer ${selectedTime === slot
                                                ? "bg-text-main border-text-main text-background font-bold"
                                                : "bg-card-bg border-card-border hover:border-brand/40 text-text-main"
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            disabled={!selectedDay || !selectedTime}
                            onClick={() => setStep(3)}
                            className="w-full bg-brand hover:bg-brand-hover text-background font-black py-3.5 rounded-xl shadow-md disabled:opacity-50 disabled:pointer-events-none transition mt-6 cursor-pointer"
                        >
                            تأكيد الميعاد والذهاب لبياناتك ←
                        </button>
                    </div>
                )}

                {/* ── Step 3: بيانات المريض + OTP ── */}
                {step === 3 && selectedDoctor && selectedDay && selectedTime && (
                    <div className="space-y-6">
                        <div className="text-center md:text-right">
                            <button onClick={() => setStep(2)} className="text-xs text-brand font-bold mb-2 inline-block cursor-pointer">
                                ← العودة لتعديل الميعاد
                            </button>
                            <h2 className="text-2xl font-black text-text-main">بيانات المريض وتأكيد الكشف</h2>
                            <p className="text-text-muted text-sm mt-1">كشف سريع وبدون كلمة سر، أكد حجزك في لحظة.</p>
                        </div>

                        {/* ملخص الحجز */}
                        <div className="bg-brand-light border border-brand/10 p-4 rounded-xl text-right text-sm space-y-1">
                            <p className="text-text-muted">الطبيب: <span className="font-bold text-text-main">{selectedDoctor.name}</span></p>
                            <p className="text-text-muted">الموعد: <span className="font-bold text-text-main">{selectedDay.label} ({selectedDay.date}) الساعة {selectedTime}</span></p>
                        </div>

                        {!isOtpSent ? (
                            <form onSubmit={handleSendOtp} className="space-y-4 text-right">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-text-main">اسم المريض ثنائي أو ثلاثي:</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="مثال: محمد جمال الشيمي"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-card-bg text-text-main"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-text-main">البريد الإلكتروني:</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="example@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-card-bg text-text-main"
                                        dir="ltr"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-text-main">رقم الهاتف:</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="01xxxxxxxxx"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-card-bg text-text-main"
                                        dir="ltr"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-brand hover:bg-brand-hover text-background font-black py-3.5 rounded-xl shadow-md transition mt-4 cursor-pointer"
                                >
                                    أرسل كود تأكيد الحجز (OTP)
                                </button>
                            </form>
                        ) : (
                            <div className="bg-card-bg border border-card-border p-6 rounded-2xl shadow-sm text-center space-y-4">
                                <div className="text-3xl select-none">💬</div>
                                <h3 className="font-bold text-lg text-text-main">أدخل كود التحقق المرسل إليك</h3>
                                <p className="text-sm text-text-muted">
                                    أرسلنا الكود على موبايلك <span className="font-bold text-text-main">{phone}</span> وإيميلك <span className="font-bold text-text-main">{email}</span>
                                </p>

                                <input
                                    type="text"
                                    maxLength={4}
                                    placeholder="× × × ×"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                    className="w-32 p-3 text-center text-xl font-bold tracking-widest rounded-xl border border-card-border focus:outline-none focus:border-brand bg-background text-text-main mx-auto block"
                                />

                                <p className="text-xs text-text-muted">للتجربة السريعة، اكتب الكود: <span className="font-bold text-text-main">1234</span></p>

                                <div className="pt-2 flex gap-3">
                                    <button
                                        onClick={() => setIsOtpSent(false)}
                                        className="flex-1 border border-card-border hover:bg-card-hover text-text-muted font-bold py-2.5 rounded-xl text-sm transition cursor-pointer"
                                    >
                                        تغيير البيانات
                                    </button>
                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={isSubmitting || otpCode.length < 4}
                                        className="flex-1 bg-brand hover:bg-brand-hover text-background font-black py-2.5 rounded-xl text-sm transition shadow-md disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                    >
                                        {isSubmitting ? "جاري الحجز..." : "تأكيد نهائي وحجز الكشف"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}