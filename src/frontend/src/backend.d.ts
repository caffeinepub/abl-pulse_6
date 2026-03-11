import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HealthSeekerRecord {
    bp: string;
    id: bigint;
    age: string;
    weight: string;
    height: string;
    movementScore: bigint;
    sleepScore: bigint;
    mindScore: bigint;
    answers: Array<bigint>;
    name: string;
    profession: string;
    whatsapp: string;
    submittedAt: bigint;
    thyroid: string;
    email?: string;
    gutScore: bigint;
    totalScore: bigint;
    sugar: string;
    gender: string;
    category: string;
}
export interface HCRecord {
    id: bigint;
    name: string;
    mobile: string;
    email: string;
    password: string;
    experienceMonths: string;
    fieldExpertise: string;
    currentWorking: string;
    socialMedia: string;
    status: string;
    registeredAt: bigint;
}
export interface backendInterface {
    deleteSubmission(id: bigint): Promise<boolean>;
    getSubmissionById(id: bigint): Promise<HealthSeekerRecord | null>;
    getSubmissions(): Promise<Array<HealthSeekerRecord>>;
    saveBasicInfo(name: string, gender: string, age: string, profession: string, weight: string, height: string, bp: string, sugar: string, thyroid: string, whatsapp: string, email: string | null): Promise<bigint>;
    submitAssessment(name: string, gender: string, age: string, profession: string, weight: string, height: string, bp: string, sugar: string, thyroid: string, whatsapp: string, email: string | null, answers: Array<bigint>): Promise<bigint>;
    updateAssessmentResult(id: bigint, answers: Array<bigint>): Promise<boolean>;
    registerHC(name: string, mobile: string, email: string, password: string, experienceMonths: string, fieldExpertise: string, currentWorking: string, socialMedia: string): Promise<{ ok: bigint } | { err: string }>;
    loginHC(email: string, password: string): Promise<{ ok: HCRecord } | { err: string }>;
    getHCRequests(): Promise<Array<HCRecord>>;
    getApprovedHCs(): Promise<Array<HCRecord>>;
    approveHC(id: bigint): Promise<{ ok: boolean } | { err: string }>;
    rejectHC(id: bigint): Promise<{ ok: boolean } | { err: string }>;
    getHCById(id: bigint): Promise<HCRecord | null>;
}
