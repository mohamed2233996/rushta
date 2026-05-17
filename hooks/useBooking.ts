"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useDoctors } from "./useDoctors";

export interface DaySlot {
    id: string;
    label: string;
    date: string;
    fullDate: Date;
}

function generateNext7Days(): DaySlot[] {
    const arabicDays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const arabicMonths = [
        "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
        "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const label = i === 0 ? "اليوم" : i === 1 ? "غداً" : arabicDays[d.getDay()];
        return {
            id: `day${i}`,
            label,
            date: `${d.getDate()} ${arabicMonths[d.getMonth()]}`,
            fullDate: d,
        };
    });
}

export function useBooking() {
    // ← الأطباء جايين من useDoctors مش محتاجين نعيد الفيتش
    const { doctors, loading, error } = useDoctors();

    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
    const [selectedDay, setSelectedDay] = useState<DaySlot | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [days] = useState<DaySlot[]>(() => generateNext7Days());

    const createAppointment = async (
        patientName: string,
        email: string,
        phone: string
    ) => {
        try {
            if (!selectedDoctor || !selectedDay || !selectedTime) {
                throw new Error("بيانات الحجز غير مكتملة");
            }

            const { data, error } = await supabase
                .from("appointments")
                .insert([{
                    patient_name: patientName,
                    patient_email: email,
                    patient_phone: phone,
                    doctor_id: selectedDoctor.id,
                    appointment_date: selectedDay.fullDate.toISOString().split("T")[0],
                    appointment_label: `${selectedDay.label} (${selectedDay.date})`,
                    appointment_time: selectedTime,
                    status: "pending",
                    prescription_data: [],
                }])
                .select()
                .single();

            if (error) throw error;

            // إرسال تأكيدات الإيميل والموبايل
            await supabase.functions.invoke("send-confirmation", {
                body: {
                    email: {
                        to: email,
                        subject: `تأكيد حجزك مع د. ${selectedDoctor.name}`,
                        patientName,
                        doctorName: selectedDoctor.name,
                        dayLabel: selectedDay.label,
                        dayDate: selectedDay.date,
                        time: selectedTime,
                        appointmentId: data.id,
                    },
                    sms: {
                        to: phone,
                        text: `مرحباً ${patientName}، تم تأكيد حجزك مع د. ${selectedDoctor.name} يوم ${selectedDay.label} ${selectedDay.date} الساعة ${selectedTime}. رقم حجزك: #${data.id}`,
                    },
                },
            });

            return { success: true, data };
        } catch (err: any) {
            console.error("Error creating appointment:", err.message);
            return { success: false, error: err.message };
        }
    };

    const resetWizard = () => {
        setStep(1);
        setSelectedDoctor(null);
        setSelectedDay(null);
        setSelectedTime("");
    };

    return {
        step, setStep,
        doctors, days,   // ← doctors جاية من useDoctors
        loading, error,  // ← loading/error جايين من useDoctors
        selectedDoctor, setSelectedDoctor,
        selectedDay, setSelectedDay,
        selectedTime, setSelectedTime,
        createAppointment,
        resetWizard,
    };
}