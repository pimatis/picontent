import fs from "fs";

interface CompanyInfo {
    name: string;
    description: string;
    industry: string;
    competitors: string[];
    targetMass: {
        age: number;
        gender: string;
        interests: string[];
    };
    tone: string[];
    keywords: string[];
    platform: string[];
}

export async function getCompany(): Promise<CompanyInfo | null> {
    try {
        const data = fs.readFileSync("company.json", "utf8");
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}