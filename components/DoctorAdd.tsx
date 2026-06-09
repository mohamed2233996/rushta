import React from 'react';
import { DoctorJoinForm } from './DoctorJoinForm';

const DoctorAdd = () => {
    return (

        <section className="py-16 max-w-6xl mx-auto px-4" dir="rtl">
            <div className="bg-card-bg border border-card-border rounded-3xl p-8 md:p-12 relative overflow-hidden">

                <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand/5 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand/5 rounded-full blur-2xl" />

                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                    <div className="space-y-5 text-right">
                        <div className="inline-flex items-center gap-2 bg-brand-light text-brand px-4 py-2 rounded-full text-xs font-bold border border-brand/20">
                            <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse"></span>
                            نحن نتوسع دايماً 🚀
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-black text-text-main leading-snug">
                            هل أنت طبيب وعايز <br />
                            <span className="text-brand">تنضم لمنصة روشتة؟</span>
                        </h2>

                        <p className="text-sm text-text-muted leading-relaxed">
                            انضم لشبكة الأطباء المتميزين على منصتنا واستقبل حجوزاتك رقمياً، واكتب روشتاتك إلكترونياً، وتابع مرضاك من مكان واحد بدون أي تعقيد.
                        </p>

                        <div className="space-y-2.5">
                            {[
                                "لوحة تحكم خاصة بك لإدارة حجوزاتك",
                                "روشتة رقمية موثقة لكل مريض",
                                "إحصائيات شهرية عن نشاطك الطبي",
                                "بدون رسوم في مرحلة الإطلاق",
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-text-muted">
                                    <span className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-[10px]">✓</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-background border border-card-border rounded-2xl p-6 space-y-4 text-right">
                        <h3 className="font-black text-base text-text-main">سجل اهتمامك الآن</h3>
                        <p className="text-xs text-text-muted">وهنتواصل معاك في أقرب وقت لإضافتك للمنصة</p>

                        <DoctorJoinForm />
                    </div>

                </div>
            </div>
        </section>
    );
}

export default DoctorAdd;
