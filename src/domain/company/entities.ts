export type Company = {
    id: string; // Primary identifier for Company Entity
    uid: string; // User ID of creator/contact, or system ID if globally managed
    name: string;
    businessPosition: string; // Renamed from "position"
    requiredSkillset: string; // Renamed from "skillset"
    mission: string;
    productDetails: string; // Renamed from "product"
    companyCulture: string; // Renamed from "culture"
    additionalInformation: string; // Renamed from "others"
};
