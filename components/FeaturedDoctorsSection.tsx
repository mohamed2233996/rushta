// components/FeaturedDoctorsSection.tsx
"use client";
import React from "react";
import { useFeaturedDoctors } from "@/hooks/useFeaturedDoctors";
import Link from "next/link";

const specialtyColors: Record<string, string> = {
    "عام": "bg-blue-500/10 text-blue-600 border-blue-500/20",
    "أسنان": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    "عيون": "bg-violet-500/10 text-violet-600 border-violet-500/20",
    "قلب": "bg-red-500/10 text-red-600 border-red-500/20",
    "أطفال": "bg-orange-500/10 text-orange-600 border-orange-500/20",
    "نساء وتوليد": "bg-pink-500/10 text-pink-600 border-pink-500/20",
    "عظام": "bg-amber-500/10 text-amber-600 border-amber-500/20",
    "جلدية": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

function getSpecialtyColor(specialty: string): string {
    for (const key of Object.keys(specialtyColors)) {
        if (specialty.includes(key)) return specialtyColors[key];
    }
    return "bg-brand/10 text-brand border-brand/20";
}

function getAvatarColor(name: string): string {
    const colors = [
        "bg-blue-500/20 text-blue-600 border-blue-500/30",
        "bg-violet-500/20 text-violet-600 border-violet-500/30",
        "bg-emerald-500/20 text-emerald-600 border-emerald-500/30",
        "bg-orange-500/20 text-orange-600 border-orange-500/30",
        "bg-pink-500/20 text-pink-600 border-pink-500/30",
        "bg-cyan-500/20 text-cyan-600 border-cyan-500/30",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}

export default function FeaturedDoctorsSection() {
    const { doctors, loading, error } = useFeaturedDoctors(6);

    return (
        <section className="py-16 bg-background" dir="rtl">
            <div className="max-w-6xl mx-auto px-4">

                {/* العنوان */}
                <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-text-main">
                        أطباؤنا المميزون
                    </h2>
                    <p className="text-sm text-text-muted">
                        نخبة من أفضل الأطباء، احجز معاهم في ثواني
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4 animate-pulse"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-card-border" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 bg-card-border rounded w-3/4" />
                                        <div className="h-2 bg-card-border rounded w-1/2" />
                                    </div>
                                </div>
                                <div className="h-2 bg-card-border rounded w-full" />
                                <div className="h-8 bg-card-border rounded-xl w-full" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="text-center py-6 text-red-500 text-sm">
                        حصل خطأ في تحميل الأطباء
                    </div>
                )}

                {/* Cards */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {doctors.map((doctor, i) => (
                            <div
                                key={doctor.id}
                                className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-4 hover:border-brand/40 hover:shadow-lg transition-all group"
                                style={{ animationDelay: `${i * 0.08}s` }}
                            >
                                {/* الهيدر: أفاتار + اسم + تخصص */}
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-black text-lg shrink-0 ${getAvatarColor(doctor.name)}`}>
                                        {doctor.name.replace("د.", "").trim().charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-text-main text-sm truncate">
                                            {doctor.name}
                                        </p>
                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getSpecialtyColor(doctor.specialty)}`}>
                                            {doctor.specialty}
                                        </span>
                                    </div>
                                </div>

                                {/* المواعيد المتاحة */}
                                <div className="space-y-1.5">
                                    <p className="text-[11px] text-text-muted font-bold">
                                        مواعيد متاحة:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {doctor.time_slots.slice(0, 3).map((slot) => (
                                            <span
                                                key={slot}
                                                className="text-[11px] bg-background border border-card-border text-text-muted px-2 py-0.5 rounded-lg"
                                            >
                                                {slot}
                                            </span>
                                        ))}
                                        {doctor.time_slots.length > 3 && (
                                            <span className="text-[11px] text-brand font-bold px-1">
                                                +{doctor.time_slots.length - 3} أكثر
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-card-border pt-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] text-text-muted">سعر الكشف</p>
                                        <p className="text-base font-black text-brand">
                                            {doctor.price} جنيه
                                        </p>
                                    </div>
                                    <Link href={`/booking?id=${doctor.id}`} className="bg-brand hover:bg-brand-dark text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors group-hover:scale-105 transform duration-200">
                                        احجز دلوقتي
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* زرار عرض الكل */}
                {!loading && !error && doctors.length > 0 && (
                    <div className="text-center mt-10">
                        <Link href={"/doctors"} className="border border-brand text-brand hover:bg-brand hover:text-white font-bold px-8 py-2.5 rounded-xl transition-all text-sm">
                            عرض كل الأطباء
                        </Link>
                    </div>
                )}

            </div>
        </section>
    );
}
