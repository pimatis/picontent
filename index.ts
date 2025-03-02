import readlineSync from "readline-sync";
import { contentGenerator } from "./src/generators/content";
import { calendarGenerator } from "./src/generators/calendar";
import { hashtagGenerator } from "./src/generators/hashtag";
import { didyouknowGenerator } from "./src/generators/didYouKnow";
import { specialDaysGenerator } from "./src/generators/specialDays";
import { setCompany } from "./src/company/set";
import { getCompany } from "./src/company/get";
import { clearCompany } from "./src/company/clear";
import chalk from "chalk";

async function main() {
    const companyInfo = await getCompany();
    console.clear();
    console.log(chalk.green("🧭 Welcome to the PiContent application!"));

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

    if (!companyInfo) {
        console.log("Please create your brand first.");
        const companyInfo: CompanyInfo = {
            name: readlineSync.question("What is the name of your brand? "),
            description: readlineSync.question("What is the description of your brand? "),
            industry: readlineSync.question("What is the industry of your brand? "),
            competitors: readlineSync.question("What are your brand's competitive brands? (separate by commas) ").split(",").map(item => item.trim()),
            targetMass: {
                age: parseInt(readlineSync.question("What is the average age of your target audience? ")),
                gender: readlineSync.question("What is the gender of your target audience? (male, female, all) "),
                interests: readlineSync.question("What are the interests of your target audience? (separate by commas) ").split(",").map(item => item.trim()),
            },
            tone: readlineSync.question("What should be the tone of your brand? (e.g. friendly, formal, fun - separate by commas) ").split(",").map(item => item.trim()),
            keywords: readlineSync.question("What are the keywords for your brand? (separate by commas) ").split(",").map(item => item.trim()),
            platform: readlineSync.question("For which social media platforms do you want to create content? (separate by commas) ").split(",").map(item => item.trim())
        };

        setCompany(companyInfo);
    } else {
        let choices = readlineSync.question("1. Generate content\n2. Generate calendar\n3. Generate hashtag\n4. Generate did you know?\n5. Generate special days content\n6. Clear company information\n7. Exit\nPlease select the action you want to do: ");

        if (choices === "1") {
            if (companyInfo) {
                let count = parseInt(readlineSync.question("How many content do you want to generate? "));
                let language = readlineSync.question("In which language do you want to generate content? (e.g. English, Turkish - default: English) ");
                console.log("\nContent is being generated, please wait...");
                
                try {
                    await contentGenerator(companyInfo, count, language).then(() => {
                        console.log(chalk.green(`${count} content has been successfully generated and saved to content.json file.`));
                    })
                } catch (error) {
                    console.error("An error occurred while generating content:", error);
                }
            } else {
                console.log(chalk.red("Company information not found."));
            }
        } else if (choices === "2") {
            if (companyInfo) {
                let language = readlineSync.question("In which language do you want to generate calendar? (e.g. English, Turkish - default: English) ");
                console.log("\nCalendar is being generated, please wait...");
                
                try {
                    await calendarGenerator(companyInfo, language).then(() => {
                        console.log(chalk.green("Calendar has been successfully generated and saved to calendar.json file."));
                    })
                } catch (error) {
                    console.error("An error occurred while generating calendar:", error);
                }
            } else {
                console.log(chalk.red("Company information not found."));
            }
        } else if (choices === "3") {
            if (companyInfo) {
                let count = parseInt(readlineSync.question("How many hashtags do you want to generate? "));
                let language = readlineSync.question("In which language do you want to generate hashtags? (e.g. English, Turkish - default: English) ");
                console.log("\nHashtag is being generated, please wait...");
                
                try {
                    await hashtagGenerator(companyInfo, count, language).then(() => {
                        console.log(chalk.green(`${count} hashtags has been successfully generated and saved to hashtag.json file.`));
                    })
                } catch (error) {
                    console.error("An error occurred while generating hashtag:", error);
                }
            } else {
                console.log(chalk.red("Company information not found."));
            }
        } else if (choices === "4") {
            if (companyInfo) {
                let count = parseInt(readlineSync.question("How many did you know? do you want to generate? "));
                let language = readlineSync.question("In which language do you want to generate did you know? (e.g. English, Turkish - default: English) ");
                console.log("\nDid you know? is being generated, please wait...");
                
                try {
                    await didyouknowGenerator(companyInfo, count, language).then(() => {
                        console.log(chalk.green(`${count} did you know? has been successfully generated and saved to didyouknow.json file.`));
                    })
                } catch (error) {
                    console.error("An error occurred while generating did you know?:", error);
                }
            } else {
                console.log(chalk.red("Company information not found."));
            }
        } else if (choices === "5") {
            if (companyInfo) {
                let count = parseInt(readlineSync.question("How many special days content do you want to generate? "));
                let language = readlineSync.question("In which language do you want to generate special days content? (e.g. English, Turkish - default: English) ");
                console.log("\nSpecial days content is being generated, please wait...");
                
                try {
                    await specialDaysGenerator(companyInfo, count, language).then(() => {
                        console.log(chalk.green(`${count} special days content has been successfully generated and saved to specialDays.json file.`));
                    })
                } catch (error) {
                    console.error("An error occurred while generating special days content:", error);
                }
            } else {
                console.log(chalk.red("Company information not found."));
            }
        } else if (choices === "6") {
            clearCompany().then(() => {
                console.log(chalk.green("Company information has been cleared!"));
            });
        } else if (choices === "7") {
            console.log(chalk.green("Exiting..."));
            return;
        } else {
            console.log(chalk.red("Invalid selection. Please try again."));
        }
    }
}
main();