import axios from "axios";
import { secretKey as configSecretKey, url as configUrl, model as configModel } from "../config/main";
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
    },
    tone: string[];
    keywords: string[];
    platform: string[];
}

const secretKey: string = configSecretKey;
const url: string = configUrl;

export async function didyouknowGenerator(companyInfo: CompanyInfo, factCount: number, language: string) {
    let systemPrompt = `
    Create "${factCount}" "Did you know?" content for a brand named ${companyInfo.name}, operating in the ${companyInfo.industry} sector.

    IMPORTANT: Generate all content in ${language} language.

    BRAND INFORMATION:
    - Brand Name: ${companyInfo.name}
    - Brand Description: ${companyInfo.description}
    - Industry: ${companyInfo.industry}
    - Competitor Brands: ${companyInfo.competitors}
    - Target Audience Age: ${companyInfo.targetMass.age}
    - Target Audience Gender: ${companyInfo.targetMass.gender}
    - Target Audience Interests: ${companyInfo.targetMass.interests}
    - Brand Tone: ${companyInfo.tone}
    - Keywords: ${companyInfo.keywords}
    - Content Platforms: ${companyInfo.platform}

    CONTENT REQUIREMENTS:
    Each "Did you know?" content should have the following features:

    1. INTERESTING INFORMATION:
       - A surprising, intriguing, and little-known fact about the sector or products
       - Compatible with the interests of the target audience
       - Accurate and sourced information
       - Indirectly related to brand values and products
       - Interesting information that will make the reader say "wow"
       - Short and concise, in an easily memorable format

    2. TITLE:
       - A question that starts with "Did you know?" or a similar curiosity-provoking question
       - Attractive and click-inducing format
       - No more than 10-15 words in length
       - Eye-catching with appropriate emoji usage

    3. TEXT:
       - Detailed explanation of interesting information (between 100-200 words)
       - A narrative reflecting the brand's tone (${companyInfo.tone.join(', ')})
       - Easy to understand, fluent language usage
       - Related additional information and contexts
       - A cleverly established connection between the brand and the information
       - Formatting appropriate to the platform's features

    4. VISUAL CONCEPT PROPOSAL:
       - An original visual idea that will visualize interesting information
       - Infographic, illustration or creative photo suggestion
       - Design compatible with brand colors and visual identity
       - Visual elements that will increase the memorability of the information

    5. PLATFORM ADAPTATION:
       - Optimized format for each social media platform (Instagram carousel, Twitter thread, etc.)
       - Text length suggestions adapted to platform dynamics

    6. SOURCE INFORMATION:
       - Suggestion of reliable sources confirming the accuracy of the information
       - References to scientific research, statistics or official institutions

    7. HASHTAGS:
       - 5-7 related hashtags to increase the discoverability of the content
       - Tags like #DidYouKnow
       - Popular hashtags related to the brand and industry

    The contents should be returned in the following JSON format:
        
        {
            "company": "${companyInfo.name}",
            "platform": "${companyInfo.platform}",
            "didyouknow_contents": [
                {
                    "title": "Did you know? ...",
                    "interesting_information": "Short summary information",
                    "explanation": "Detailed explanation text",
                    "visual_concept": "Visual suggestion details",
                    "visual_format": "Infographic/Photo/Video/Carousel",
                    "platform_adaptation": {
                        "instagram": "Format suggestion for Instagram",
                        "facebook": "Format suggestion for Facebook",
                        "twitter": "Format suggestion for Twitter"
                    },
                    "source": "Information source",
                    "hashtags": ["#tag1", "#tag2", "#DidYouKnow"],
                    "target_audience_interest": "High/Medium/Low",
                    "brand_connection": "Suggestion on how to relate to the brand"
                },
                // Other contents (total ${factCount})
            ]
        }
    `

    const response = await axios.post(url, {
        "model": configModel,
        "messages": [
            {
                "role": "system",
                "content": `You are an expert advertiser, social media expert and content producer who can create content in ${language} language.`
            },
            {
                "role": "user",
                "content": systemPrompt
            }
        ]
    }, {
        headers: {
            "Authorization": `Bearer ${secretKey}`,
            "Content-Type": "application/json"
        }
    });

    const responseText = response.data.choices[0].message.content;

    try {
        const jsonRegex = /({[\s\S]*})/;
        const matches = responseText.match(jsonRegex);
        
        let jsonContent = '';
        if (matches && matches[1]) {
            jsonContent = matches[1];
        } else {
            jsonContent = responseText;
        }
        
        const parsedContent = JSON.parse(jsonContent);
        
        fs.writeFileSync("didyouknow.json", JSON.stringify(parsedContent, null, 2));
        return "Did you know? contents were successfully created and saved to didyouknow.json file.";
    } catch (error) {
        console.error("JSON parsing error:", error);
        fs.writeFileSync("didyouknow.raw.json", responseText);
        return "An error occurred while processing the API response, the raw response was saved to the didyouknow.raw.json file.";
    }
}