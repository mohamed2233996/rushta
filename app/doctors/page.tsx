"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useDoctors } from "@/hooks/useDoctors";

export default function DoctorsPage() {
    const { doctors, loading, error } = useDoctors();
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>("الكل");
    const [searchQuery, setSearchQuery] = useState<string>("");



    const specialties = ["الكل", ...Array.from(new Set(doctors.map((doc) => doc.specialty)))];
    const filteredDoctors = doctors
        .filter((doc) => selectedSpecialty === "الكل" || doc.specialty === selectedSpecialty)
        .filter((doc) =>
            searchQuery === "" ||
            doc.name.includes(searchQuery) ||
            doc.specialty.includes(searchQuery) ||
            (doc.location ?? "").includes(searchQuery)
        );

    return (
        <div className="min-h-screen bg-background text-text-main py-12 transition-colors" dir="rtl">
            <div className="max-w-6xl mx-auto px-4 space-y-10">

                <div className="text-center space-y-2">
                    <span className="text-xs font-bold text-brand bg-brand-light px-3 py-1 rounded-full uppercase tracking-wider">
                        نخبة من الخبراء
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">
                        الأطباء المتميزين
                    </h1>
                    <p className="text-text-muted text-sm max-w-md mx-auto leading-relaxed">
                        تصفح قائمة الأطباء المعتمدين واحجز موعد استشارتك الطبية فورًا في خطوات بسيطة.
                    </p>
                </div>

                <div className="relative max-w-md mx-auto">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
                    <input
                        type="text"
                        placeholder="ابحث عن دكتور أو تخصص أو منطقة..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pr-9 pl-4 py-3 rounded-xl border border-card-border focus:outline-none focus:border-brand bg-card-bg text-text-main text-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main cursor-pointer text-xs"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {!loading && !error && doctors.length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 pb-4 overflow-x-auto no-scrollbar">
                        {specialties.map((specialty) => (
                            <button
                                key={specialty}
                                onClick={() => setSelectedSpecialty(specialty)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${selectedSpecialty === specialty
                                    ? "bg-brand text-background shadow-md shadow-brand/10"
                                    : "bg-card-bg border border-card-border text-text-muted hover:border-brand/40 hover:text-text-main"
                                    }`}
                            >
                                {specialty}
                            </button>
                        ))}
                    </div>
                )}

                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-card-bg border border-card-border h-64 rounded-2xl" />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl p-6 text-center text-sm font-medium max-w-md mx-auto">
                        عذرًا، واجهنا مشكلة في تحميل الأطباء: {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        {filteredDoctors.length === 0 ? (
                            <div className="text-center py-12 bg-card-bg border border-card-border rounded-2xl text-text-muted text-sm space-y-2">
                                <p>لا يوجد أطباء مطابقون للبحث.</p>
                                <button
                                    onClick={() => { setSearchQuery(""); setSelectedSpecialty("الكل"); }}
                                    className="text-brand font-bold hover:underline cursor-pointer text-xs"
                                >
                                    مسح الفلاتر
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredDoctors.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="group bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-brand/40 transition-all duration-300 flex flex-col justify-between text-right relative overflow-hidden"
                                    >
                                        <div className="absolute -top-4 -left-4 w-16 h-16 bg-brand/5 rounded-full group-hover:bg-brand/10 transition-colors flex items-center justify-center p-4 select-none">
                                            ⭐
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-1 pt-2">
                                                <h3 className="font-black text-xl text-text-main group-hover:text-brand transition-colors">
                                                    {doc.name}
                                                </h3>
                                                <p className="text-sm font-bold text-text-muted flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                                                    {doc.specialty}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between bg-background border border-card-border/50 rounded-xl p-3 text-xs">
                                                <div className="space-y-1">
                                                    <span className="text-text-muted block">سعر الكشف</span>
                                                    <span className="font-extrabold text-brand">{doc.price} ج.م</span>
                                                </div>
                                                <div className="space-y-1 text-left">
                                                    <span className="text-text-muted block">المواعيد</span>
                                                    <span className="font-bold text-text-main">{doc.timeSlots?.length || 0} فترات</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-2 flex flex-col gap-2">
                                            <Link
                                                href={`/doctors/${doc.id}`}
                                                className="w-full border border-card-border hover:border-brand/40 text-text-muted hover:text-brand font-bold py-2.5 rounded-xl text-sm transition-all duration-200 block text-center cursor-pointer"
                                            >
                                                عرض البروفايل ←
                                            </Link>

                                            <Link
                                                href={`/booking?id=${doc.id}`}
                                                className="w-full bg-brand group-hover:bg-brand-hover text-background font-black py-3 rounded-xl text-sm transition-all duration-200 block text-center cursor-pointer shadow-sm shadow-brand/5"
                                            >
                                                حجز كشف سريع ←
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    );
}