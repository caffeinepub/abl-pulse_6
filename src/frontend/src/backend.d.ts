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
export interface backendInterface {
    getSubmissionById(id: bigint): Promise<HealthSeekerRecord | null>;
    getSubmissions(): Promise<Array<HealthSeekerRecord>>;
    submitAssessment(name: string, gender: string, age: string, profession: string, weight: string, height: string, bp: string, sugar: string, thyroid: string, whatsapp: string, email: string | null, answers: Array<bigint>): Promise<bigint>;
}
