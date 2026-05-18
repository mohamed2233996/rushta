"use client";

import React from "react";
import { useTestimonials } from "@/hooks/useTestimonials";

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`text-sm ${star <= rating ? "text-brand" : "text-card-border"}`}
                >
                    ★
                </span>
            ))}
        </div>
    );
}

export default function TestimonialsSection() {
    const { testimonials, loading, error } = useTestimonials();

    return (
        <section className="py-16 bg-card-bg border-t border-b border-card-border" dir="rtl">
            <div className="max-w-6xl mx-auto px-4">

                <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-text-main">ماذا قال مرضانا؟</h2>
                    <p className="text-sm text-text-muted">آلاف المرضى وثقوا في روشتة، ده رأيهم بكلامهم</p>
                </div>

                {loading && (
                    <div className="text-center py-10 text-text-muted text-sm animate-pulse">
                        جاري تحميل التقييمات...
                    </div>
                )}

                {error && (
                    <div className="text-center py-6 text-red-500 text-sm">
                        حصل خطأ في تحميل التقييمات
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div
                                key={t.id}
                                className="bg-background border border-card-border p-5 rounded-2xl space-y-4 hover:border-brand/40 hover:shadow-lg transition-all"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <StarRating rating={t.rating} />

                                <p className="text-sm text-text-muted leading-relaxed">
                                    "{t.review}"
                                </p>

                                <div className="border-t border-card-border pt-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/20 flex items-center justify-center text-brand font-black text-sm">
                                            {t.patient_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-text-main">{t.patient_name}</p>
                                            {t.doctor_name && (
                                                <p className="text-[10px] text-text-muted">{t.doctor_name}</p>
                                            )}
                                        </div>
                                    </div>
                                    {/* بادج التحقق */}
                                    <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                        ✓ محجوز فعلاً
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}