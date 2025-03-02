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

export async function specialDaysGenerator(companyInfo: CompanyInfo, contentCount: number, language: string) {
    let systemPrompt = `
    Create ${contentCount} social media content for special days for a brand named ${companyInfo.name}, operating in the ${companyInfo.industry} sector.

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

    SPECIAL DAY CONTENT REQUIREMENTS:
    Each special day content must include the following items:

    1. SPECIAL DAY INFORMATION:
       - Full name of the special day (e.g., World Water Day, Mother's Day)
       - Date of the special day (DD.MM.YYYY format)
       - Short description and importance of the special day
       - The relationship of this special day with the brand and industry

    2. TITLE:
       - A catchy title specific to the special day and compatible with brand values
       - Between 5-10 words, impressive
       - If possible, a title that both celebrates the special day and conveys the brand message
       - Enriched with appropriate emoji usage

    3. CONTENT TEXT:
       - Text reflecting the spirit of the special day and connecting with the brand identity
       - A narrative reflecting the brand's tone (${companyInfo.tone.join(', ')})
       - Length optimized according to platform specifications
       - Value-oriented, sincere, and original celebration message
       - If available, a special offer, campaign, or event detail specific to the special day
       - A call to action that encourages users to interact

    4. VISUAL CONCEPT PROPOSAL:
       - An original visual concept suitable for the theme of the special day
       - A design that blends brand identity and thematic elements of the special day
       - Color palette, composition, and style suggestions
       - Visual elements that are compatible with the text and reinforce the message
       - Visual type and format suggestion (video, photo, carousel, animation)

    5. INTERACTION STRATEGY:
       - A question or call to action that encourages users to comment on the content
       - A hashtag challenge, contest, or UGC campaign idea related to the special day
       - Tactics to increase interaction (e.g., "Tag your loved ones on this special day")
       - Suggestion for the best time to share

    6. HASHTAGS:
       - Brand hashtag: #${companyInfo.name.toLowerCase().replace(/\s+/g, '')}
       - Popular hashtags specific to the special day
       - Relevant hashtags specific to the industry
       - Suggestion for a unique hashtag specific to the campaign or event

    7. PLATFORM OPTIMIZATION:
       - Special content adaptations for each social media platform
       - Format and presentation suggestions specific to the platform
       - Best performance strategy according to the platform algorithm

    Points to consider when choosing special days:
    - Special days directly or indirectly related to the brand's sector
    - Days that the target audience values and celebrates
    - Thematic days that will strengthen the brand image
    - Various special days that support different content types
    - National holidays, holidays, and local/international important days
    - Professional days and weeks specific to the industry
    - Brand's anniversary or special days

    The contents should be returned in the following JSON format:
        
        {
            "company": "${companyInfo.name}",
            "platform": "${companyInfo.platform}",
            "special_day_contents": [
                {
                    "special_day_name": "Name of the Special Day",
                    "special_day_date": "DD.MM.YYYY",
                    "special_day_description": "Short description of the special day",
                    "brand_relationship": "Relationship of this special day with the brand",
                    "title": "Content title",
                    "content_text": "Full content text",
                    "visual_concept": "Detailed visual suggestion",
                    "visual_format": "Photo/Video/Carousel/Animation",
                    "interaction_strategy": {
                        "question": "Question to be asked to users",
                        "call_to_action": "Call for interaction",
                        "campaign_idea": "Campaign suggestion, if any"
                    },
                    "hashtags": ["#tag1", "#tag2", "#specialday"],
                    "platform_optimization": {
                        "instagram": "Format suggestion for Instagram",
                        "facebook": "Format suggestion for Facebook",
                        "twitter": "Format suggestion for Twitter"
                    },
                    "optimum_sharing_time": "Before/during/after the special day, ideal time",
                    "target_audience_connections": "The importance of this special day for the target audience"
                },
                // Other contents (total ${contentCount} pieces)
            ]
        }
    `

    const response = await axios.post(url, {
        "model": configModel,
        "messages": [
            {
                "role": "system",
                "content": `You are an expert advertiser, social media specialist, and special day content strategist who can create content in ${language} language.`
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
        
        fs.writeFileSync("specialDays.json", JSON.stringify(parsedContent, null, 2));
        return "Special day contents have been successfully created and saved to specialDays.json file.";
    } catch (error) {
        console.error("JSON processing error:", error);
        fs.writeFileSync("specialDays.raw.json", responseText);
        return "An error occurred while processing the API response, the raw response has been saved to specialDays.raw.json file.";
    }
}