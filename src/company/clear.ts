import fs from "fs";

export async function clearCompany() {
    fs.writeFileSync("company.json", JSON.stringify({}));
}