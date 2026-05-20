// app/doctor/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useDoctorDashboard } from "@/hooks/useDoctorDashboard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled";

const statusLabels = {
    pending: { label: "معلق", color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20" },
    confirmed: { label: "مؤكد", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
    cancelled: { label: "ملغي", color: "text-red-500 bg-red-500/10 border-red-500/20" },
};

export default function DoctorDashboard() {
    const router = useRouter();
    const {
        appointments, stats, chartData,
        loading, error, doctorName,
        updateAppointmentStatus, savePrescription,
    } = useDoctorDashboard();

    const [filter, setFilter] = useState<StatusFilter>("all");
    const [prescriptionModal, setPrescriptionModal] = useState<null | number>(null);
    const [medicines, setMedicines] = useState([{ name: "", dose: "", duration: "" }]);
    const [saving, setSaving] = useState(false);

    const filteredAppts = filter === "all"
        ? appointments
        : appointments.filter(a => a.status === filter);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/doctor/login");
    };

    const openPrescription = (id: number) => {
        const appt = appointments.find(a => a.id === id);
        if (appt?.prescription_data && appt.prescription_data.length > 0) {
            setMedicines(appt.prescription_data);
        } else {
            setMedicines([{ name: "", dose: "", duration: "" }]);
        }
        setPrescriptionModal(id);
    };

    const handleSavePrescription = async () => {
        if (!prescriptionModal) return;
        setSaving(true);
        const success = await savePrescription(prescriptionModal, medicines);
        setSaving(false);
        if (success) setPrescriptionModal(null);
    };

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-text-muted animate-pulse">جاري تحميل البيانات...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-red-500">{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-text-main" dir="rtl">
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

                {/* الهيدر */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-text-main">لوحة تحكم الطبيب</h1>
                        <p className="text-sm text-text-muted mt-1">أهلاً، <span className="font-bold text-text-main">{doctorName}</span></p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-bold text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20 transition cursor-pointer"
                    >
                        تسجيل الخروج
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "حجوزات اليوم", value: stats.todayCount, icon: "📅", color: "text-brand" },
                        { label: "حجوزات الشهر", value: stats.monthCount, icon: "📊", color: "text-blue-500" },
                        { label: "نسبة الإتمام", value: `${stats.completionRate}%`, icon: "✅", color: "text-emerald-500" },
                        { label: "إيرادات الشهر", value: `${stats.monthRevenue} ج.م`, icon: "💰", color: "text-yellow-500" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-card-bg border border-card-border rounded-2xl p-5 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-2xl">{stat.icon}</span>
                                <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
                            </div>
                            <p className="text-xs text-text-muted">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Chart */}
                <div className="bg-card-bg border border-card-border rounded-2xl p-6 space-y-4">
                    <h2 className="text-base font-black text-text-main">الحجوزات خلال آخر ٣٠ يوم</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-card-border, #e5e7eb)" />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 10, fill: "var(--color-text-muted, #6b7280)" }}
                                interval={4}
                            />
                            <YAxis tick={{ fontSize: 10, fill: "var(--color-text-muted, #6b7280)" }} />
                            <Tooltip
                                contentStyle={{
                                    background: "var(--color-card-bg)",
                                    border: "1px solid var(--color-card-border)",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                }}
                                formatter={(value) => [`${value} حجز`, ""]}
                            />
                            <Bar dataKey="count" fill="var(--color-brand, #6366f1)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* جدول الحجوزات */}
                <div className="bg-card-bg border border-card-border rounded-2xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <h2 className="text-base font-black text-text-main">الحجوزات</h2>

                        {/* فلتر الحالة */}
                        <div className="flex gap-2 flex-wrap">
                            {(["all", "pending", "confirmed", "cancelled"] as StatusFilter[]).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilter(s)}
                                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition cursor-pointer ${filter === s
                                            ? "bg-brand text-background border-brand"
                                            : "bg-background border-card-border text-text-muted hover:border-brand/40"
                                        }`}
                                >
                                    {s === "all" ? "الكل" : statusLabels[s].label}
                                    <span className="mr-1 opacity-70">
                                        ({s === "all" ? appointments.length : appointments.filter(a => a.status === s).length})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {filteredAppts.length === 0 ? (
                        <div className="text-center py-10 text-text-muted text-sm">
                            لا توجد حجوزات
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredAppts.map((appt) => (
                                <div
                                    key={appt.id}
                                    className="bg-background border border-card-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                                >
                                    {/* بيانات المريض */}
                                    <div className="space-y-1 text-right flex-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/20 flex items-center justify-center text-brand font-black text-sm">
                                                {appt.patient_name?.charAt(0) ?? "م"}
                                            </div>
                                            <p className="font-bold text-sm text-text-main">{appt.patient_name}</p>
                                        </div>
                                        <p className="text-xs text-text-muted">
                                            {appt.appointment_label || appt.appointment_date} — {appt.appointment_time}
                                        </p>
                                        <div className="flex gap-2 text-xs text-text-muted">
                                            <span dir="ltr">{appt.patient_phone}</span>
                                            <span>•</span>
                                            <span dir="ltr">{appt.patient_email}</span>
                                        </div>
                                    </div>

                                    {/* الأكشنز */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {/* بادج الحالة */}
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusLabels[appt.status].color}`}>
                                            {statusLabels[appt.status].label}
                                        </span>

                                        {/* تغيير الحالة */}
                                        <select
                                            value={appt.status}
                                            onChange={(e) => updateAppointmentStatus(appt.id, e.target.value as any)}
                                            className="text-xs bg-card-bg border border-card-border rounded-lg px-2 py-1.5 text-text-main cursor-pointer focus:outline-none focus:border-brand"
                                        >
                                            <option value="pending">معلق</option>
                                            <option value="confirmed">مؤكد</option>
                                            <option value="cancelled">ملغي</option>
                                        </select>

                                        {/* زرار الروشتة */}
                                        <button
                                            onClick={() => openPrescription(appt.id)}
                                            className="text-xs font-bold bg-brand-light text-brand border border-brand/20 px-3 py-1.5 rounded-lg hover:bg-brand hover:text-background transition cursor-pointer"
                                        >
                                            {appt.prescription_data?.length > 0 ? "تعديل الروشتة" : "كتابة روشتة"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal الروشتة */}
            {prescriptionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" dir="rtl">
                    <div className="bg-card-bg border border-card-border rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-5">

                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-black text-text-main">كتابة الروشتة</h3>
                            <button
                                onClick={() => setPrescriptionModal(null)}
                                className="text-text-muted hover:text-text-main cursor-pointer text-lg"
                            >✕</button>
                        </div>

                        <div className="space-y-3">
                            {medicines.map((med, i) => (
                                <div key={i} className="grid grid-cols-3 gap-2 items-center">
                                    <input
                                        type="text"
                                        placeholder="اسم الدواء"
                                        value={med.name}
                                        onChange={(e) => {
                                            const updated = [...medicines];
                                            updated[i].name = e.target.value;
                                            setMedicines(updated);
                                        }}
                                        className="p-2 text-xs rounded-lg border border-card-border focus:outline-none focus:border-brand bg-background text-text-main"
                                    />
                                    <input
                                        type="text"
                                        placeholder="الجرعة"
                                        value={med.dose}
                                        onChange={(e) => {
                                            const updated = [...medicines];
                                            updated[i].dose = e.target.value;
                                            setMedicines(updated);
                                        }}
                                        className="p-2 text-xs rounded-lg border border-card-border focus:outline-none focus:border-brand bg-background text-text-main"
                                    />
                                    <div className="flex gap-1">
                                        <input
                                            type="text"
                                            placeholder="المدة"
                                            value={med.duration}
                                            onChange={(e) => {
                                                const updated = [...medicines];
                                                updated[i].duration = e.target.value;
                                                setMedicines(updated);
                                            }}
                                            className="flex-1 p-2 text-xs rounded-lg border border-card-border focus:outline-none focus:border-brand bg-background text-text-main"
                                        />
                                        {medicines.length > 1 && (
                                            <button
                                                onClick={() => setMedicines(medicines.filter((_, j) => j !== i))}
                                                className="text-red-400 hover:text-red-500 px-1 cursor-pointer"
                                            >✕</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setMedicines([...medicines, { name: "", dose: "", duration: "" }])}
                            className="text-xs text-brand font-bold hover:underline cursor-pointer"
                        >
                            + إضافة دواء آخر
                        </button>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setPrescriptionModal(null)}
                                className="flex-1 border border-card-border text-text-muted font-bold py-2.5 rounded-xl text-sm transition cursor-pointer hover:bg-card-hover"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleSavePrescription}
                                disabled={saving}
                                className="flex-1 bg-brand hover:bg-brand-hover text-background font-black py-2.5 rounded-xl text-sm transition cursor-pointer disabled:opacity-50"
                            >
                                {saving ? "جاري الحفظ..." : "حفظ الروشتة ✓"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}