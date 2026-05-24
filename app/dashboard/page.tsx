// components/PatientDashboard.tsx
"use client";

import React, { useState } from "react";
import { usePatientDashboard } from "@/hooks/usePatientDashboard";

const statusLabels = {
    pending: { label: "معلق", color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20" },
    confirmed: { label: "مؤكد", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
    cancelled: { label: "ملغي", color: "text-red-500 bg-red-500/10 border-red-500/20" },
};

export default function PatientDashboard() {
    const { appointments, upcomingAppointments, prescriptions, loading, error, patientEmail, patientName, cancelAppointment } = usePatientDashboard();
    const [selectedPrescription, setSelectedPrescription] = useState<null | typeof prescriptions[0]>(null);

    const [cancelConfirm, setCancelConfirm] = useState<number | null>(null);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-text-muted animate-pulse">جاري تحميل بياناتك...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-red-500">{error}</p>
        </div>
    );

    const nextAppt = upcomingAppointments[0] ?? null;

    return (
        <div className="min-h-screen bg-background text-text-main py-8 transition-colors" dir="rtl">
            <div className="max-w-4xl mx-auto px-4 space-y-8">

                {/* هيدر الترحيب */}
                <div className="text-right space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-text-main">
                        أهلاً بك 👋
                        <span className="text-brand">
                            {" "}{patientName.split(" ")[0]}
                        </span>
                    </h1>
                    <p className="text-text-muted text-sm" dir="ltr">{patientEmail}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: "حجوزاتك", value: appointments.length, icon: "📅" },
                        { label: "القادمة", value: upcomingAppointments.length, icon: "⏰" },
                        { label: "الروشتات", value: prescriptions.length, icon: "📄" },
                    ].map((s, i) => (
                        <div key={i} className="bg-card-bg border border-card-border rounded-2xl p-4 text-center space-y-1">
                            <div className="text-2xl">{s.icon}</div>
                            <p className="text-xl font-black text-brand">{s.value}</p>
                            <p className="text-xs text-text-muted">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* الحجز القادم */}
                <div className="bg-card-bg border border-card-border rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-card-border pb-3">
                        <h3 className="font-bold text-base flex items-center gap-2">
                            📅 كشفك القادم
                        </h3>
                        {nextAppt && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusLabels[nextAppt.status].color}`}>
                                {statusLabels[nextAppt.status].label}
                            </span>
                        )}
                    </div>

                    {nextAppt ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-right">
                            <div className="space-y-1">
                                <p className="text-text-muted text-xs">الطبيب المعالج:</p>
                                <p className="font-bold text-brand">{nextAppt.doctor.name}</p>
                                <p className="text-xs text-text-muted">{nextAppt.doctor.specialty}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-text-muted text-xs">الموعد المحدد:</p>
                                <p className="font-bold text-text-main">{nextAppt.appointment_label || nextAppt.appointment_date}</p>
                                <p className="text-xs text-text-muted">{nextAppt.appointment_time}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-text-muted text-sm text-center py-4">
                            لا توجد حجوزات قادمة. <a href="/booking" className="text-brand font-bold hover:underline">احجز الآن</a>
                        </p>
                    )}
                </div>

                {/* كل الحجوزات */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-right">كل حجوزاتك</h3>

                    {appointments.length === 0 ? (
                        <div className="bg-card-bg border border-card-border rounded-2xl p-8 text-center text-text-muted text-sm">
                            لا توجد حجوزات بعد.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {appointments.map((appt) => (
                                <div key={appt.id} className="bg-card-bg border border-card-border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="space-y-1 text-right">
                                        <p className="font-bold text-sm text-text-main">{appt.doctor.name}</p>
                                        <p className="text-xs text-text-muted">{appt.appointment_label || appt.appointment_date} — {appt.appointment_time}</p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusLabels[appt.status].color}`}>
                                            {statusLabels[appt.status].label}
                                        </span>

                                        {appt.prescription_data.length > 0 && (
                                            <button
                                                onClick={() => setSelectedPrescription(appt)}
                                                className="text-xs font-bold text-brand bg-brand-light border border-brand/20 px-3 py-1 rounded-lg hover:bg-brand hover:text-background transition cursor-pointer"
                                            >
                                                عرض الروشتة
                                            </button>
                                        )}

                                        {/* زرار الإلغاء - بس للمعلق والمؤكد */}
                                        {appt.status !== "cancelled" && (
                                            cancelConfirm === appt.id ? (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={async () => { await cancelAppointment(appt.id); setCancelConfirm(null); }}
                                                        className="text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-lg hover:bg-red-500 hover:text-background transition cursor-pointer"
                                                    >
                                                        تأكيد الإلغاء
                                                    </button>
                                                    <button
                                                        onClick={() => setCancelConfirm(null)}
                                                        className="text-xs text-text-muted border border-card-border px-2 py-1 rounded-lg hover:bg-card-hover transition cursor-pointer"
                                                    >
                                                        لأ
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setCancelConfirm(appt.id)}
                                                    className="text-xs text-red-400 hover:text-red-500 border border-red-400/20 hover:border-red-500/40 px-3 py-1 rounded-lg transition cursor-pointer"
                                                >
                                                    إلغاء الحجز
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal الروشتة */}

            {selectedPrescription && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" dir="rtl">
                    <div className="bg-card-bg border border-card-border rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">

                        {/* الهيدر */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-black text-text-main">الروشتة الطبية</h3>
                                <p className="text-xs text-text-muted">
                                    {selectedPrescription.doctor.name} — {selectedPrescription.appointment_label || selectedPrescription.appointment_date}
                                </p>
                            </div>
                            <button onClick={() => setSelectedPrescription(null)} className="text-text-muted hover:text-text-main cursor-pointer text-lg">✕</button>
                        </div>

                        {/* الروشتة */}
                        <div className="bg-brand-light border border-brand/10 rounded-xl p-4 space-y-3">
                            {/* هيدر الروشتة */}
                            <div className="flex justify-between items-start border-b border-brand/10 pb-3">
                                <span className="text-3xl font-serif font-black text-brand">Rx</span>
                                <div className="text-left text-xs text-text-muted space-y-0.5">
                                    <p className="font-bold text-text-main">{selectedPrescription.doctor.name}</p>
                                    <p>{selectedPrescription.appointment_label || selectedPrescription.appointment_date}</p>
                                </div>
                            </div>

                            {/* الأدوية */}
                            <div className="space-y-2">
                                {selectedPrescription.prescription_data.map((med, i) => (
                                    <div key={i} className="bg-card-bg p-3 rounded-xl border border-card-border space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-sm text-text-main">{med.name}</p>
                                            <span className="text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full">
                                                {i + 1}
                                            </span>
                                        </div>
                                        <p className="text-xs text-brand">💊 الجرعة: {med.dose}</p>
                                        <p className="text-xs text-text-muted">⏱ المدة: {med.duration}</p>
                                    </div>
                                ))}
                            </div>

                            {/* فوتر الروشتة */}
                            <p className="text-[10px] text-text-muted text-center pt-2 border-t border-brand/10">
                                الروشتة موثقة رقمياً — روشتة.
                            </p>
                        </div>

                        {/* الأزرار */}
                        <div className="flex gap-2">
                            {/* زرار الطباعة */}
                            <button
                                onClick={() => {
                                    const printContent = `
                            <div dir="rtl" style="font-family: Arial; padding: 20px; max-width: 400px; margin: auto;">
                                <h2 style="color: #000;">الروشتة الطبية</h2>
                                <p style="color: #666;">${selectedPrescription.doctor.name} — ${selectedPrescription.appointment_label || selectedPrescription.appointment_date}</p>
                                <hr/>
                                <h3 style="font-family: serif; font-size: 24px;">Rx</h3>
                                ${selectedPrescription.prescription_data.map((med, i) => `
                                    <div style="border: 1px solid #eee; padding: 10px; border-radius: 8px; margin: 8px 0;">
                                        <p style="font-weight: bold; margin: 0;">${i + 1}. ${med.name}</p>
                                        <p style="color: #666; margin: 4px 0; font-size: 13px;">💊 الجرعة: ${med.dose}</p>
                                        <p style="color: #999; margin: 0; font-size: 13px;">⏱ المدة: ${med.duration}</p>
                                    </div>
                                `).join("")}
                                <hr/>
                                <p style="color: #999; font-size: 11px; text-align: center;">روشتة رقمية موثقة — روشتة.</p>
                            </div>
                        `;
                                    const w = window.open("", "_blank");
                                    if (w) {
                                        w.document.write(printContent);
                                        w.document.close();
                                        w.print();
                                    }
                                }}
                                className="flex-1 bg-brand-light text-brand border border-brand/20 font-bold py-2.5 rounded-xl text-sm hover:bg-brand hover:text-background transition cursor-pointer"
                            >
                                🖨️ طباعة
                            </button>

                            {/* زرار الحفظ كـ txt */}
                            <button
                                onClick={() => {
                                    const text = `
الروشتة الطبية
━━━━━━━━━━━━━━━
الطبيب: ${selectedPrescription.doctor.name}
التاريخ: ${selectedPrescription.appointment_label || selectedPrescription.appointment_date}
━━━━━━━━━━━━━━━
${selectedPrescription.prescription_data.map((med, i) =>
                                        `${i + 1}. ${med.name}\n   الجرعة: ${med.dose}\n   المدة: ${med.duration}`
                                    ).join("\n\n")}
━━━━━━━━━━━━━━━
روشتة رقمية موثقة — روشتة.
                        `.trim();
                                    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = `روشتة-${selectedPrescription.doctor.name}.txt`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                                className="flex-1 bg-card-bg border border-card-border text-text-muted font-bold py-2.5 rounded-xl text-sm hover:bg-card-hover transition cursor-pointer"
                            >
                                💾 حفظ
                            </button>

                            <button
                                onClick={() => setSelectedPrescription(null)}
                                className="px-4 border border-card-border text-text-muted font-bold py-2.5 rounded-xl text-sm hover:bg-card-hover transition cursor-pointer"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}