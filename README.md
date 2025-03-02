# PiContent - AI-Powered Social Media Content Generator

## Overview

PiContent is an advanced social media content generation tool that leverages AI to create tailored content for brands across multiple platforms. It simplifies the content creation process by generating various types of social media assets based on your brand's profile and target audience.

## Features

- **Content Generator**: Create engaging social media posts optimized for your platforms
- **Calendar Generator**: Build a weekly content calendar with strategically timed posts
- **Hashtag Generator**: Develop platform-specific hashtag strategies to maximize reach
- **"Did You Know?" Generator**: Create informative and shareable trivia content
- **Special Days Generator**: Produce content for holidays, events, and special occasions
- **Brand Profile Management**: Save and reuse your brand details for consistent content
- **Multi-Language Support**: Create content in multiple languages

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm, yarn or bun

### Setup

1. Clone the repository
```bash
git clone https://github.com/pimatis/picontent.git
cd picontent
```

2. Install dependencies
```bash
bun install
```

3. Create and configure environment variables
Create a `.env` file in the root directory and add your GROQ API key:

```
SECRET_KEY=
API_URL=https://api.groq.com/openai/v1/chat/completions
```

## Usage

Start the application:

```bash
bun run index.ts
```

### First-time Setup

On first run, you'll be prompted to enter your brand information:
- Brand name and description
- Industry and competitors
- Target audience demographics and interests
- Brand tone and keywords
- Target social media platforms

### Content Generation

After setup, select from the following options:
1. Generate content
2. Generate calendar
3. Generate hashtag
4. Generate "Did you know?" content
5. Generate special days content
6. Clear company information
7. Exit

## Output Files

PiContent generates JSON files containing your content:

- `content.json` - Social media posts
- `calendar.json` - Weekly content calendar
- `hashtag.json` - Hashtag strategy
- `didyouknow.json` - Educational content pieces
- `specialDays.json` - Special occasions content

## Technologies

- TypeScript
- Node.js
- GROQ API
- readline-sync (for CLI interaction)
- chalk (for colorful console output)

## Use Cases

- Social media agencies managing multiple client accounts
- Marketing teams developing content strategies
- Small business owners handling their own social media presence
- Content creators looking for inspiration and ideas

## License

[MIT License](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

<hr>

<div align="center" style="display: flex; align-items: center; justify-content: space-between;">
    <p style="margin-left: 25rem; margin-top: 1.2rem;">Created by <a href="https://github.com/pimatis">Pimatis Labs</a></p>
    <img src="https://www.upload.ee/image/17796243/logo.png" alt="PiContent Logo" width="30" style="opacity: 0.2; position: absolute;">
</div>
