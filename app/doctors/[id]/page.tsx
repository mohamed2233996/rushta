"use client";

import { useParams, useRouter } from "next/navigation";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useDoctor } from "@/hooks/useDoctor";

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-sm ${star <= rating ? "text-brand" : "text-card-border"}`}>★</span>
            ))}
        </div>
    );
}

export default function DoctorProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { doctor, loading, error } = useDoctor(Number(id));
    const { testimonials } = useTestimonials();

    const doctorTestimonials = testimonials.filter(t => t.doctor_name === doctor?.name);

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-text-muted animate-pulse">جاري تحميل بيانات الطبيب...</p>
        </div>
    );

    if (error || !doctor) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-red-500">لم يتم العثور على الطبيب</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-text-main" dir="rtl">
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

                <button
                    onClick={() => router.back()}
                    className="text-sm text-text-muted hover:text-brand transition flex items-center gap-1 cursor-pointer"
                >
                    ← رجوع
                </button>

                <div className="bg-card-bg border border-card-border rounded-2xl p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start gap-5">

                        <div className="w-20 h-20 rounded-2xl bg-brand-light border-2 border-brand/20 flex items-center justify-center text-brand font-black text-3xl shrink-0 overflow-hidden">
                            {doctor.avatarUrl ? (
                                <img src={doctor.avatarUrl} alt={doctor.name} className="w-full h-full object-cover" />
                            ) : (
                                doctor.name.charAt(2)
                            )}
                        </div>

                        <div className="flex-1 space-y-2 text-right">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                    <h1 className="text-2xl font-black text-text-main">{doctor.name}</h1>
                                    <p className="text-sm text-text-muted">{doctor.specialty}</p>
                                </div>
                                <span className="text-sm font-black text-brand bg-brand-light px-3 py-1.5 rounded-xl border border-brand/20">
                                    {doctor.price} ج.م / كشف
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-4 pt-1">
                                {doctor.experienceYears && (
                                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                        <span>🏆</span>
                                        <span>{doctor.experienceYears} سنة خبرة</span>
                                    </div>
                                )}
                                {doctor.location && (
                                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                        <span>📍</span>
                                        <span>{doctor.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                    <span>⭐</span>
                                    <span>{doctorTestimonials.length} تقييم</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {doctor.bio && (
                        <div className="border-t border-card-border pt-4 text-right">
                            <h3 className="text-sm font-bold text-text-main mb-2">نبذة عن الطبيب</h3>
                            <p className="text-sm text-text-muted leading-relaxed">{doctor.bio}</p>
                        </div>
                    )}

                    {doctor.subSpecialties?.length > 0 && (
                        <div className="border-t border-card-border pt-4 text-right">
                            <h3 className="text-sm font-bold text-text-main mb-2">التخصصات الفرعية</h3>
                            <div className="flex flex-wrap gap-2">
                                {doctor.subSpecialties.map((sub, i) => (
                                    <span key={i} className="text-xs bg-background border border-card-border text-text-muted px-3 py-1 rounded-full">
                                        {sub}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-card-bg border border-card-border rounded-2xl p-6 space-y-4">
                    <h2 className="text-base font-black text-text-main">المواعيد المتاحة يومياً</h2>
                    <div className="flex flex-wrap gap-2">
                        {doctor.timeSlots.map((slot, i) => (
                            <span key={i} className="text-xs bg-background border border-card-border text-text-main px-3 py-1.5 rounded-xl">
                                {slot}
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={() => router.push(`/booking?id=${doctor.id}`)}
                        className="w-full bg-brand hover:bg-brand-hover text-background font-black py-3.5 rounded-xl shadow-md transition cursor-pointer"
                    >
                        احجز موعد مع {doctor.name} ←
                    </button>
                </div>

                {doctorTestimonials.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-base font-black text-text-main">آراء المرضى ({doctorTestimonials.length})</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {doctorTestimonials.map((t) => (
                                <div key={t.id} className="bg-card-bg border border-card-border p-4 rounded-2xl space-y-3">
                                    <StarRating rating={t.rating} />
                                    <p className="text-sm text-text-muted leading-relaxed">"{t.review}"</p>
                                    <div className="flex items-center gap-2 border-t border-card-border pt-3">
                                        <div className="w-7 h-7 rounded-full bg-brand-light border border-brand/20 flex items-center justify-center text-brand font-black text-xs">
                                            {t.patient_name.charAt(0)}
                                        </div>
                                        <p className="text-xs font-bold text-text-main">{t.patient_name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}