"use client";

import React from "react";

interface PatientDashboardProps {
    bookingData: {
        doctor: string;
        specialty: string;
        day: string;
        date: string;
        time: string;
        patientName: string;
        contact: string;
    } | null;
}

export default function PatientDashboard({ bookingData }: PatientDashboardProps) {
    return (
        <div className="flex-1 bg-background text-text-main font-['Cairo'] py-8 transition-colors" dir="rtl">
            <div className="max-w-4xl mx-auto px-4 space-y-8">

                {/* هيدر الترحيب بالمريض */}
                <div className="text-right space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-text-main">
                        أهلاً بك، {bookingData ? bookingData.patientName : "جمال الشيمي"} 👋
                    </h1>
                    <p className="text-text-muted text-sm">
                        تابع مواعيد كشوفاتك الحالية، وتصفح أرشيف روشتاتك الطبية الرقمية بأمان.
                    </p>
                </div>

                {/* شبكة البيانات التفاعلية */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* كارت الحجز النشط حالياً */}
                    <div className="md:col-span-2 bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex justify-between items-center border-b border-card-border pb-3">
                            <h3 className="font-bold text-base flex items-center gap-2">
                                <span>📅</span> كشفك القادم (مؤكد تلقائياً)
                            </h3>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/10">
                                نشط
                            </span>
                        </div>

                        {bookingData ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-right">
                                <div className="space-y-1">
                                    <p className="text-text-muted text-xs">الطبيب المعالج:</p>
                                    <p className="font-bold text-brand">{bookingData.doctor}</p>
                                    <p className="text-xs text-text-muted">{bookingData.specialty}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-text-muted text-xs">الموعد المحدد:</p>
                                    <p className="font-bold text-text-main">{bookingData.day} ({bookingData.date})</p>
                                    <p className="font-mono text-xs text-text-muted" dir="ltr">{bookingData.time}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-text-muted text-sm text-center py-4">لا توجد حجوزات نشطة حالياً. يمكنك حجز كشف سريع من الصفحة الرئيسية.</p>
                        )}
                    </div>

                    {/* كارت إحصائيات المريض الجانبي */}
                    <div className="bg-card-bg border border-card-border rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
                        <div className="space-y-3 text-right">
                            <h4 className="font-bold text-sm text-text-main">الملف السحابي للمريض</h4>
                            <div className="flex justify-between text-xs border-b border-card-border pb-2">
                                <span className="text-text-muted">الروشتات الرقمية:</span>
                                <span className="font-bold text-brand">{bookingData ? "١" : "٠"} روشتة</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-text-muted">التحاليل والإشاعات:</span>
                                <span className="font-bold text-text-main">٠ ملفات</span>
                            </div>
                        </div>
                        <button className="w-full bg-brand-light text-brand hover:bg-brand hover:text-background font-bold py-2.5 rounded-xl text-xs transition border border-brand/10 cursor-pointer">
                            + رفع أشعة أو تحليل جديد
                        </button>
                    </div>

                </div>

                {/* قسم أرشيف الروشتات الرقمية */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-right">📄 أرشيف الروشتات السحابية</h3>

                    {bookingData ? (
                        <div className="bg-card-bg border border-card-border rounded-2xl p-5 flex items-center justify-between gap-4 hover:bg-card-hover transition text-right">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand-light text-brand rounded-xl flex items-center justify-center text-xl border border-brand/10">
                                    📄
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-text-main">روشتة كشف متابعة رقمية</h4>
                                    <p className="text-xs text-text-muted mt-0.5">العيادة: {bookingData.doctor} | التاريخ: {bookingData.date}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => alert("محاكاة: جاري تحميل ملف الـ PDF للروشتة...")}
                                className="text-xs font-bold text-brand hover:underline cursor-pointer"
                            >
                                عرض وتنزيل الروشتة ←
                            </button>
                        </div>
                    ) : (
                        <div className="bg-card-bg border border-card-border rounded-2xl p-8 text-center text-text-muted text-sm">
                            لم يستلم هذا الحساب أي روشتات رقمية بعد. الروشتة بتظهر هنا تلقائياً فور كتابة الطبيب لها.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}