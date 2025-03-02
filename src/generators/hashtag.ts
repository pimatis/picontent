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

export async function hashtagGenerator(companyInfo: CompanyInfo, contentCount: number, language: string) {
    let systemPrompt = `
    Generate ${contentCount} different hashtags specific to the ${companyInfo.platform} platforms for a brand named ${companyInfo.name}, operating in the ${companyInfo.industry} sector.

    IMPORTANT: Generate all hashtags in ${language} language.

    BRAND INFORMATION:
    - Brand Name: ${companyInfo.name}
    - Brand Description: ${companyInfo.description}
    - Sector: ${companyInfo.industry}
    - Competitor Brands: ${companyInfo.competitors}
    - Target Audience Age: ${companyInfo.targetMass.age}
    - Target Audience Gender: ${companyInfo.targetMass.gender}
    - Target Audience Interests: ${companyInfo.targetMass.interests}
    - Brand Tone: ${companyInfo.tone}
    - Keywords: ${companyInfo.keywords}
    - Content Platforms: ${companyInfo.platform}

    HASHTAG STRATEGY DETAILS:
    
    1. BRAND HASHTAGS:
       - Main brand hashtag: #${companyInfo.name.toLowerCase().replace(/\s+/g, '')}
       - Brand slogan/motto hashtag (if available or create one)
       - Specific hashtags for the brand's campaigns or product series
       - Brand community hashtags (to encourage user-generated content)
    
    2. SECTOR AND PRODUCT HASHTAGS:
       - Broad hashtags specific to the ${companyInfo.industry} sector
       - Specific hashtags based on product categories and features
       - Hashtags used by professionals and influencers in the sector
       - Hashtags for product use cases and benefits
    
    3. TARGET AUDIENCE HASHTAGS:
       - Hashtags that appeal to the ${companyInfo.targetMass.age} age group
       - Hashtags specific to the ${companyInfo.targetMass.gender} gender
       - Hashtags based on the interests of the target audience: ${companyInfo.targetMass.interests.join(', ')}
       - Hashtags suitable for the lifestyle and values of the target audience
    
    4. TRENDING AND CURRENT HASHTAGS:
       - Hashtags related to current trends in the sector
       - Hashtags related to seasonal or special days/weeks
       - Popular hashtags that provide high discoverability
       - Local and regional popular hashtags
    
    5. NICHE AND MICRO-COMMUNITY HASHTAGS:
       - Niche hashtags that provide targeted interaction with less competition
       - Micro-community hashtags for special interest groups
       - Mid-tail hashtag strategy to avoid competition
       - Hashtags that appeal to specific subcultures
    
    PLATFORM SPECIFIC HASHTAG SUGGESTIONS:
    
    - Instagram: 
      * Optimal hashtag count: 10-15 (maximum 30)
      * Descriptive hashtags compatible with visual content
      * Trending hashtags specific to Reels and Stories
      * Location and location-based hashtags
    
    - Twitter: 
      * Optimal hashtag count: 1-3
      * Hashtags that connect to current discussions and news
      * Generally, shorter and concise hashtags should be preferred
    
    - LinkedIn: 
      * Optimal hashtag count: 3-5
      * Professional and sectoral hashtags
      * Business and career-oriented hashtags
      * Hashtags for thought leadership and areas of expertise
    
    - TikTok: 
      * Optimal hashtag count: 3-5
      * Hashtags related to viral challenges and trends
      * Hashtags aimed at appearing on the discovery page, such as #FYP, #ForYouPage
      * Popular hashtags that appeal to young audiences
    
    - Facebook: 
      * Optimal hashtag count: 2-3
      * Hashtags for community building
      * Hashtags specific to events and campaigns
    
    - Pinterest: 
      * Optimal hashtag count: 2-5
      * Category and collection-based hashtags
      * Hashtags for specific content types such as DIY, decoration, food
    
    HASHTAG CREATION TIPS:
    
    - Create easy-to-read and memorable hashtags
    - Separate compound words with capital letters (#SocialMediaExpert)
    - Avoid very long hashtags (ideally less than 20 characters)
    - Avoid hashtags containing Turkish characters (use i, g, s, c, o, u instead of ı, ğ, ş, ç, ö, ü)
    - Use a mix of both broad and niche hashtags
    - Determine the appropriate number of hashtags for each platform's hashtag algorithm
    - Analyze successful hashtags used by competing brands
    - Develop original hashtags that reflect the brand promise and values

    Hashtags should be returned in the following JSON format:
        
        {
            "company": "${companyInfo.name}",
            "platform": "${companyInfo.platform}",
            "hashtag_strategy": {
                "brand_hashtags": [
                    {
                        "hashtag": "#examplebrand",
                        "category": "Main Brand",
                        "description": "Main hashtag of the brand",
                        "estimated_interaction_potential": "High/Medium/Low"
                    }
                ],
                "sector_hashtags": [
                    {
                        "hashtag": "#examplesector",
                        "category": "Sector",
                        "description": "Popular hashtag related to the sector",
                        "estimated_interaction_potential": "High/Medium/Low"
                    }
                ],
                "target_audience_hashtags": [
                    {
                        "hashtag": "#exampletarget",
                        "category": "Target Audience",
                        "description": "Hashtag specific to the target audience",
                        "estimated_interaction_potential": "High/Medium/Low"
                    }
                ],
                "trending_hashtags": [
                    {
                        "hashtag": "#exampletrend",
                        "category": "Trend",
                        "description": "Current trending hashtag",
                        "estimated_interaction_potential": "High/Medium/Low"
                    }
                ],
                "niche_hashtags": [
                    {
                        "hashtag": "#exampleniche",
                        "category": "Niche",
                        "description": "Hashtag for a special interest area",
                        "estimated_interaction_potential": "High/Medium/Low"
                    }
                ]
            },
            "recommended_hashtag_sets": {
                "instagram_set": ["#tag1", "#tag2", "#tag3", "..."],
                "twitter_set": ["#tag1", "#tag2", "#tag3"],
                "linkedin_set": ["#tag1", "#tag2", "#tag3", "#tag4"],
                "tiktok_set": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
                "facebook_set": ["#tag1", "#tag2"],
                "pinterest_set": ["#tag1", "#tag2", "#tag3"]
            }
        }
    `

    const response = await axios.post(url, {
        "model": configModel,
        "messages": [
            {
                "role": "system",
                "content": `You are an expert advertiser and social media specialist who can create hashtags in ${language} language.`
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
        
        fs.writeFileSync("hashtag.json", JSON.stringify(parsedContent, null, 2));
        return "Hashtag successfully created and saved to hashtag.json file.";
    } catch (error) {
        console.error("JSON processing error:", error);
        fs.writeFileSync("hashtag.raw.json", responseText);
        return "Error processing API response, raw response saved to hashtag.raw.json file.";
    }
}