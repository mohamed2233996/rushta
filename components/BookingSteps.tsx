// components/BookingSteps.tsx
"use client";

import React from "react";

const steps = [
    {
        number: "١",
        icon: "🩺",
        title: "اختر طبيبك",
        description: "تصفح قائمة الأطباء المتاحين واختار الدكتور المناسب لحالتك مع عرض تخصصه وسعر الكشف.",
    },
    {
        number: "٢",
        icon: "📅",
        title: "حدد الميعاد",
        description: "اختار اليوم المناسب من الأيام السبعة القادمة، وحدد الوقت من المواعيد المتاحة لدى الطبيب.",
    },
    {
        number: "٣",
        icon: "📝",
        title: "أدخل بياناتك",
        description: "اكتب اسمك ورقم موبايلك وإيميلك. مفيش حاجة تانية، مفيش حسابات أو باسووردات.",
    },
    {
        number: "٤",
        icon: "✅",
        title: "أكد بالـ OTP",
        description: "هيوصلك كود تأكيد على موبايلك وإيميلك. أدخله وخلاص — الحجز اتأكد وتذكرتك جاهزة.",
    },
];

export default function BookingSteps() {
    return (
        <section className="py-16 max-w-6xl mx-auto px-4" dir="rtl">

            {/* العنوان */}
            <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-text-main">احجز في ٤ خطوات بسيطة</h2>
                <p className="text-sm text-text-muted">من اختيار الطبيب لتأكيد الحجز، كل حاجة في دقيقة واحدة</p>
            </div>

            {/* خط الزمن */}
            <div className="relative">

                {/* الخط الرابط - ظاهر فقط على الشاشات الكبيرة */}
                <div className="hidden md:block absolute top-9 right-[calc(12.5%+1rem)] left-[calc(12.5%+1rem)] h-px bg-card-border z-0">
                    {/* خط متحرك فوق الخط الثابت */}
                    <div
                        className="absolute inset-0 bg-brand origin-right"
                        style={{
                            animation: "timeline-fill 2s ease-out forwards",
                        }}
                    />
                </div>

                <style>{`
                    @keyframes timeline-fill {
                        from { transform: scaleX(0); }
                        to   { transform: scaleX(1); }
                    }
                    @keyframes step-in {
                        from { opacity: 0; transform: translateY(16px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }
                `}</style>

                {/* الخطوات */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center text-center gap-4"
                            style={{
                                animation: `step-in 0.5s ease-out ${i * 0.15}s both`,
                            }}
                        >
                            {/* الدائرة */}
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-brand-light border-2 border-brand/30 flex items-center justify-center text-2xl shadow-sm group-hover:border-brand transition">
                                    {step.icon}
                                </div>
                                {/* رقم الخطوة */}
                                <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-brand text-background text-[10px] font-black flex items-center justify-center">
                                    {step.number}
                                </span>
                            </div>

                            {/* المحتوى */}
                            <div className="space-y-1.5">
                                <h3 className="font-black text-base text-text-main">{step.title}</h3>
                                <p className="text-xs text-text-muted leading-relaxed">{step.description}</p>
                            </div>

                            {/* سهم للموبايل بين الخطوات */}
                            {i < steps.length - 1 && (
                                <div className="md:hidden text-text-muted text-lg rotate-90">↓</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* زرار CTA */}
            <div className="text-center mt-12">
                <a
                    href="/booking"
                    className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-background font-black px-10 py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 text-lg cursor-pointer"
                >
                    <span>ابدأ الحجز دلوقتي</span>
                    <span>←</span>
                </a>
            </div>

        </section>
    );
}
