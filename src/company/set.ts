import fs from 'fs'

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

export async function setCompany(companyInfo: CompanyInfo): Promise<void> {
    fs.writeFileSync('company.json', JSON.stringify(companyInfo));
}