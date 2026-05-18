// components/LandingPage.tsx
"use client";

import Link from "next/link";
import React from "react";



export default function LandingPage() {
    // جلب تاريخ اليوم ديناميكياً ليظهر في الروشتة التفاعلية بشكل حي
    const todayDate = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-background text-text-main min-h-screen" dir="rtl">

            {/* القسم الرئيسي (Hero Section) */}
            <section className="max-w-6xl mx-auto px-4 pt-12 pb-20 md:pt-20 md:pb-28">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">

                    {/* نصوص الترحيب والدعوة للإجراء */}
                    <div className="md:col-span-7 text-center md:text-right space-y-6">

                        <div className="inline-flex items-center gap-2 bg-brand-light text-brand px-4 py-2 rounded-full text-xs font-bold tracking-wide border border-brand/20">
                            <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse"></span>
                            مستقبل الرعاية الصحية في مصر 🇪🇬
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-main leading-[1.15]">
                            رعايتك الصحية <br />
                            بقت <span className="text-brand">برقم تليفونك</span>
                        </h1>

                        <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed mx-auto md:mx-0">
                            في "روشتة"، لغينا التعقيد. احجز كشفك في ثوانٍ، استلم روشتتك الرقمية على موبايلك فوراً، وتابع ملفك الطبي السحابي بأمان تام ومن مكان واحد.
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link href="/booking" passHref
                                className="group bg-brand hover:bg-brand-hover text-background font-black px-10 py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 text-lg cursor-pointer flex items-center justify-center gap-2"
                            >
                                <span>احجز موعدك الآن (كشف سريع)</span>
                                <span className="transition-transform group-hover:-translate-x-1">←</span>
                            </Link>
                        </div>

                        {/* أرقام وإحصائيات سريعة */}
                        <div className="pt-8 grid grid-cols-3 gap-4 border-t border-card-border max-w-md mx-auto md:mx-0">
                            <div>
                                <p className="text-2xl font-black text-brand">+٥,٠٠٠</p>
                                <p className="text-xs text-text-muted">حجز ناجح</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-text-main">١٠٠٪</p>
                                <p className="text-xs text-text-muted">أمان وتشفير</p>
                            </div>
                            <div>
                                <p className="text-2xl font-black text-text-main">٠ ثانية</p>
                                <p className="text-xs text-text-muted">وقت انتظار</p>
                            </div>
                        </div>

                    </div>

                    {/* المحاكاة البصرية للروشتة الرقمية على اليسار */}
                    <div className="md:col-span-5 flex justify-center relative">
                        <div className="absolute w-80 h-80 bg-brand/10 blur-3xl rounded-full -z-10 top-10"></div>

                        <div className="w-full max-w-90 bg-card-bg rounded-[2.5rem] border-4 border-card-border p-4 shadow-2xl relative transition duration-300 group hover:shadow-brand/5">
                            <div className="bg-background/50 rounded-[1.8rem] p-5 border border-card-border h-full flex flex-col justify-between relative">

                                <div className="border-b border-dashed border-card-border pb-3 flex justify-between items-start">
                                    <div className="text-right">
                                        <h4 className="font-black text-sm text-text-main">د. أحمد كمال خليل</h4>
                                        <p className="text-[10px] text-text-muted mt-0.5">استشاري أمراض الباطنة والقلب</p>
                                    </div>
                                    <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                        نشطة عينات
                                    </span>
                                </div>

                                <div className="py-3 text-right grid grid-cols-2 gap-y-1.5 text-[11px] border-b border-card-border">
                                    <p className="text-text-muted">المريض:</p>
                                    <p className="font-bold text-text-main text-left">أحمد محمد علي</p>
                                    <p className="text-text-muted">التاريخ:</p>
                                    <p className="font-mono text-text-muted text-left" dir="ltr">{todayDate}</p>
                                </div>

                                <div className="flex-1 py-4 text-right space-y-4">
                                    <span className="text-xl font-serif font-black text-brand block">Rx</span>

                                    <div className="bg-card-bg p-2.5 rounded-xl border border-card-border shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <h5 className="font-bold text-xs text-text-main font-sans">Augmentin 1g Tab</h5>
                                            <span className="text-[10px] text-text-muted">علبة</span>
                                        </div>
                                        <p className="text-[10px] text-brand font-medium mt-1">💊 قرص كل ١٢ ساعة - بعد الأكل (لمدة ٧ أيام)</p>
                                    </div>

                                    <div className="bg-card-bg p-2.5 rounded-xl border border-card-border shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <h5 className="font-bold text-xs text-text-main font-sans">Panadol Extra</h5>
                                            <span className="text-[10px] text-text-muted">عند اللزوم</span>
                                        </div>
                                        <p className="text-[10px] text-brand font-medium mt-1">✨ قرص عند الصداع الشديد أو السخونية</p>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-card-border pt-3 flex items-center justify-between gap-3">
                                    <div className="w-12 h-12 bg-white p-1 rounded-lg flex flex-wrap items-center justify-center border border-card-border shadow-sm select-none">
                                        <div className="w-full flex justify-between h-1"><div className="w-2 h-1 bg-black"></div><div className="w-4 h-1 bg-black"></div></div>
                                        <div className="w-full flex justify-between h-2 mt-1"><div className="w-1 h-2 bg-black"></div><div className="w-2 h-2 bg-black"></div></div>
                                        <div className="w-full flex justify-between h-1.5 mt-1"><div className="w-3 h-1.5 bg-black"></div><div className="w-1 h-1.5 bg-black"></div></div>
                                    </div>

                                    <div className="text-right flex-1">
                                        <p className="text-[10px] font-bold text-text-main">الروشتة موثقة رقمياً</p>
                                        <p className="text-[9px] text-text-muted mt-0.5 leading-normal">امسح الكود بالصيدلية لصرف العلاج فوراً بدون أوراق.</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* قسم الميزات والخصائص (Features Section) */}
            <section className="bg-card-bg border-t border-b border-card-border py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-text-main">ليه تختار منصة روشتة?</h2>
                        <p className="text-sm text-text-muted">وفرنا لك تجربة صحية رقمية متكاملة وسلسة بدون أي تعقيد</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

                        <div className="bg-card-bg border border-card-border p-6 rounded-2xl text-right space-y-4 hover:border-brand/40 hover:bg-card-hover hover:shadow-xl transition-all group">
                            <div className="w-12 h-12 bg-background text-brand border border-card-border rounded-xl flex items-center justify-center font-bold text-xl group-hover:bg-brand group-hover:text-background transition duration-300">
                                ⚡
                            </div>
                            <h3 className="font-bold text-lg text-text-main">حجز سريع بـ ٤ خطوات</h3>
                            <p className="text-sm text-text-muted leading-relaxed">
                                اختار الدكتور، حدد الميعاد، اكتب اسمك وتليفونك، وأكد بالـ OTP. مفيش حسابات معقدة ولا باسووردات تتنسي.
                            </p>
                        </div>

                        <div className="bg-card-bg border border-card-border p-6 rounded-2xl text-right space-y-4 hover:border-brand/40 hover:bg-card-hover hover:shadow-xl transition-all group">
                            <div className="w-12 h-12 bg-background text-brand border border-card-border rounded-xl flex items-center justify-center font-bold text-xl group-hover:bg-brand group-hover:text-background transition duration-300">
                                📋
                            </div>
                            <h3 className="font-bold text-lg text-text-main">ملفك الطبي سحابي وأمان</h3>
                            <p className="text-sm text-text-muted leading-relaxed">
                                تاريخك المرضي، روشتات الدكاترة، تحاليلك وإشاعاتك محفوظة سحابياً بأعلى درجات التشفير وتشوفها من موبايلك بأي وقت.
                            </p>
                        </div>

                        <div className="bg-card-bg border border-card-border p-6 rounded-2xl text-right space-y-4 hover:border-brand/40 hover:bg-card-hover hover:shadow-xl transition-all group">
                            <div className="w-12 h-12 bg-background text-brand border border-card-border rounded-xl flex items-center justify-center font-bold text-xl group-hover:bg-brand group-hover:text-background transition duration-300">
                                🩺
                            </div>
                            <h3 className="font-bold text-lg text-text-main">متابعة دقيقة مع طبيبك</h3>
                            <p className="text-sm text-text-muted leading-relaxed">
                                الطبيب هيقدر بضغطة زر يشوف تاريخك المرضي على شاشته عشان يوصل لأدق تشخيص ويكتبلك العلاج الصح بدقة مذهلة.
                            </p>
                        </div>

                    </div>
                </div>
            </section>


        </div>
    );
}