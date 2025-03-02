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

export async function calendarGenerator(companyInfo: CompanyInfo, language: string) {
    let systemPrompt = `
        Create a WEEKLY social media content calendar for ${companyInfo.name}, a brand operating in the ${companyInfo.industry} sector, specifically for the ${companyInfo.platform} platforms.

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

        CALENDAR REQUIREMENTS:
        - Determine the content type to be shared for each day of the week (Monday to Sunday)
        - Determine the most suitable sharing time for each day (considering the most active hours of the platform)
        - Create a content suggestion for each day
        - Content types should be diverse: informative, entertaining, engagement-boosting, product promotion, user experiences, industry news, etc.
        
        CONTENT DETAILS:
        - Create text for each content with a length suitable for the algorithm of that platform
        - Each content should be adapted to the interests and demographic characteristics of the target audience
        - Reflect the brand tone (${companyInfo.tone.join(', ')}) in every content
        - Include trending topics and current developments in the sector in the content
        - Suggest unique content concepts that will differentiate from competitors
        - Include formats such as Q&A, polls, and challenges to increase engagement
        - Create opportunities for user-generated content (UGC)
        
        VISUAL CONCEPT DETAILS:
        - Explain visual concepts suitable for the brand identity for each content
        - Determine the visual type (photo, video, infographic, carousel, reels, etc.)
        - Suggest color palettes, compositions, and filters that can be used in visuals
        
        HASHTAG STRATEGY:
        - Include a brand hashtag (#${companyInfo.name.toLowerCase().replace(/\s+/g, '')}) for each content
        - Increase discoverability with niche and trending hashtags (appropriate number for each platform's algorithm)
        - Use popular hashtags specific to the sector

        The calendar should be returned in the following JSON format:
            
            {
                "company": "${companyInfo.name}",
                "platform": "${companyInfo.platform}",
                "weekly_calendar": [
                    {
                        "day": "Monday",
                        "time": "10:00",
                        "content_type": "Content type (e.g., Informative)",
                        "title": "Content title",
                        "text_summary": "Short summary of the content",
                        "text_full": "Full text of the content (appropriate for platform character limits)",
                        "visual_concept": "Visual suggestion and details",
                        "visual_type": "Photo/Video/Carousel/Reels etc.",
                        "target_engagement": "Expected engagement type and rate",
                        "hashtags": ["#tag1", "#tag2"],
                        "call_to_action": "Call to action"
                    },
                    // Other days (Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)
                ]
            }
            
        CONSIDER THE UNIQUE FEATURES OF EACH PLATFORM WHEN CREATING THE CONTENT CALENDAR:
        - Instagram: Visually oriented, Story, Reels and Carousel formats, 30 hashtag limit
        - Facebook: Longer content, event and group interactions, video promotion
        - Twitter: Short and concise content, quick response to current topics, hashtag trend
        - LinkedIn: Professional content, industry knowledge, thought leadership, business connections
        - TikTok: Short entertaining videos, challenges, trending music and effects
        - Pinterest: Inspiring visual content, DIY, how-to formats
    `

    const response = await axios.post(url, {
        "model": configModel,
        "messages": [
            {
                "role": "system",
                "content": `You are an expert advertiser and social media specialist who can create content in ${language} language.`
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
        
        fs.writeFileSync("calendar.json", JSON.stringify(parsedContent, null, 2));
        return "Calendar successfully created and saved to calendar.json.";
    } catch (error) {
        console.error("JSON processing error:", error);
        fs.writeFileSync("calendar.raw.json", responseText);
        return "An error occurred while processing the API response, the raw response was saved to calendar.raw.json.";
    }
}