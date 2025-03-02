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

export async function contentGenerator(companyInfo: CompanyInfo, contentCount: number, language: string) {
    let systemPrompt = `
    Create ${contentCount} different social media contents for ${companyInfo.platform} platforms for a brand named ${companyInfo.name}, operating in the ${companyInfo.industry} sector.
    
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
    Each content should include the following items and be optimized according to the dynamics of the ${companyInfo.platform} platform:

    1. TITLE:
       - A short, catchy title that will attract users' attention and summarize the content.
       - Between 5-10 words, intriguing and likely to increase click-through rate.
       - May include a call to action (CTA) or question.
       - Must include SEO-friendly keywords.
       - Can attract attention by using emojis.

    2. TEXT:
       - An informative or entertaining text suitable for the character limits and user interaction habits of the ${companyInfo.platform} platform.
       - A catchy introduction in the first 2-3 sentences.
       - A narrative reflecting the brand's tone (${companyInfo.tone.join(', ')}).
       - Content that appeals to the interests of the target audience (${companyInfo.targetMass.age} years old, ${companyInfo.targetMass.gender}).
       - Increase readability by using short paragraphs, bullet points, or lists.
       - Consider platform-specific formatting (bold, italic, emoji usage, etc.).
       - A clear call to action at the end of the content.

    3. VISUAL CONCEPT PROPOSAL:
       - Must include a detailed description of a visual that will complement and visually enrich the content.
       - Must specify the type of visual (photo, video, carousel, infographic, animation, etc.).
       - Color palette, composition, style, and mood suggestion.
       - Main elements and brand elements to be emphasized in the visual.
       - Text or call suggestions to be included on the visual.
       - Suggestions for striking elements and visual hierarchy.
       - Suggestions for industry trends and differentiation from competitors.

    4. HASHTAGS:
       - 5-7 popular and relevant hashtags that will allow the content to reach more people on the ${companyInfo.platform} platform.
       - Brand hashtag: #${companyInfo.name.toLowerCase().replace(/\s+/g, '')}
       - Industry-specific (${companyInfo.industry}) popular hashtags.
       - Niche hashtags for the target audience.
       - Current trend hashtags (specific day, week, or campaign-specific).
       - Location-based hashtags (if applicable).
       - A mix of medium and long-tail hashtags (for competition balance).

    5. INTERACTION QUESTION:
       - An open-ended question that will encourage followers to comment, like, or share the content.
       - In a format that encourages the target audience to share their experiences.
       - Easy to answer and encourages sharing of thoughts.
       - Directly related to the content and organically connected.
       - Must have a sincere tone compatible with brand values.
       - Capable of starting a discussion or encouraging story sharing.

    6. CONTENT PLANNING DETAILS:
       - The most appropriate sharing time of the content (day and time).
       - The purpose of the content (awareness, engagement, conversion, education, etc.).
       - Targeted engagement type and rates.
       - Potential sponsored content potential.
       - A/B test suggestions (different title or visual alternatives).

    PLATFORM COMPATIBILITY SUGGESTIONS:
    - Instagram: Visually oriented, vertical composition for Story format, high viral potential content for Reels
    - Facebook: Community-building, longer content, potential to start discussions
    - Twitter: Short and concise, connection to current topics, thread potential
    - LinkedIn: Professional tone, highlighting industry knowledge and authority
    - TikTok: Fun, short, compatible with trending music and effects
    - Pinterest: Worth saving, inspiring, step-by-step visual content

    Contents should be returned in the following JSON format:
        
        {
            "company": "${companyInfo.name}",
            "platform": "${companyInfo.platform}",
            "language": "${language}",
            "contents": [
                {
                    "title": "Content title",
                    "text": "Content text",
                    "visual_concept": "Visual suggestion",
                    "visual_format": "Visual type (photo/video/carousel etc.)",
                    "hashtags": ["#tag1", "#tag2"],
                    "interaction_question": "Question?",
                    "optimum_sharing_time": "Day - Time",
                    "target_metrics": "Expected engagement type and rate",
                    "content_purpose": "Awareness/Engagement/Sales etc."
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
        
        fs.writeFileSync("content.json", JSON.stringify(parsedContent, null, 2));
        return `${contentCount} content has been successfully generated and saved to content.json file.`;
    } catch (error) {
        console.error("JSON processing error:", error);
        fs.writeFileSync("content.raw.json", responseText);
        return "An error occurred while processing the API response, the raw response was saved to the content.raw.json file.";
    }
}