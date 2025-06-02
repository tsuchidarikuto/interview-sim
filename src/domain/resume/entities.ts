export type Resume = {
    id: string; // Primary identifier for Resume Entity
    uid: string; // User ID (foreign key)
    name: string;
    education: string;
    programmingExperience: string; // Renamed from "programming"
    qualifications: string; // Renamed from "qualification"
    birthday: string; // Consider using Date type or ISO string
    age: string; // Can be calculated, or stored if snapshot
    gender: number; // Renamed from "sex", consider string literal type e.g., "male" | "female" | "other"
    selfPromotion: string;
    researchAchievements: string; // Renamed from "research"
    studentAchievements: string;
    reasonForApplication: string; // Renamed from "reasonForApply"
};
