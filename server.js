require('dotenv').config();
const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const fs = require('fs');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const GEMINI_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';

if (!GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not set. Gemini chat functionality will not work.');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Serve config and knowledge base for Voice Client
app.get('/api/config', (req, res) => {
    const siteContent = getWebsiteContent();
    res.json({
        geminiKey: GEMINI_API_KEY || '',
        siteContent: siteContent,
        leaderName: "Bourama DJONFAGA"
    });
});

function getWebsiteContent() {
    const files = ['index.html', 'method.html', 'pricing.html', 'programs.html', 'contact.html', 'knowledge.html'];
    let content = "";

    files.forEach(file => {
        try {
            let filePath = path.join(process.cwd(), file);
            if (!fs.existsSync(filePath)) {
                filePath = path.join(process.cwd(), 'dist', file);
            }
            if (fs.existsSync(filePath)) {
                const html = fs.readFileSync(filePath, 'utf8');
                const $ = cheerio.load(html);

                $('script').remove();
                $('style').remove();
                $('nav').remove();
                $('footer').remove();

                const bodyText = $('main').length ? $('main').text() : $('body').text();
                const cleanText = bodyText.replace(/\s+/g, ' ').trim();

                content += `\n\n--- Content from ${file} ---\n${cleanText}`;
            }
        } catch (err) {
            console.error(`Error reading ${file}:`, err.message);
        }
    });

    // Also include the dynamic knowledge data
    try {
        let kdPath = path.join(process.cwd(), 'knowledge_data.js');
        if (!fs.existsSync(kdPath)) {
            kdPath = path.join(process.cwd(), 'dist', 'knowledge_data.js');
        }
        if (fs.existsSync(kdPath)) {
            const kdContent = fs.readFileSync(kdPath, 'utf8');
            content += `\n\n--- Knowledge Hub Data ---\n${kdContent}`;
        }
    } catch (err) {
        console.error("Error reading knowledge_data.js:", err.message);
    }

    return content;
}

app.post('/api/chat', async (req, res) => {
    const body = req.body || {};
    const { messages, message } = body;

    // Backward compatibility: accept both
    // { messages: [{ role, content }] } and { message: "..." } payloads.
    let normalizedMessages = [];
    if (Array.isArray(messages)) {
        normalizedMessages = messages.filter(item => item && typeof item.content === 'string');
    } else if (typeof message === 'string' && message.trim()) {
        normalizedMessages = [{ role: 'user', content: message.trim() }];
    }

    if (!normalizedMessages.length) {
        return res.status(400).json({ error: 'messages array (or message string) is required' });
    }

    const siteContent = getWebsiteContent();
    const prompt = `You are Scienti, the AI learning assistant built by the Scientifier (pronounced scienteefier) team led by Bourama DJONFAGA (pronounced in French).
        
        IDENTITY RULES:
        1. If asked who built or created you, you MUST say: "I was built by the Scientifier team led by Bourama DJONFAGA."
        2. You MUST NEVER say you were built by Google, OpenAI, Anthropic, or any other company. 
        3. You are part of the Scientifier platform which fuses Neuroscience, Psychology, and AI.

        KNOWLEDGE BASE:
        ${siteContent}
        
        INSTRUCTIONS:
        1. Use ONLY the information provided above to answer questions about Scientifier's pricing, programs, and methods.
        2. Do NOT hallucinate features or prices not listed here.
        3. You are also knowledgeable about general learning science (spaced repetition, mind mapping, etc.), language learning, and coding.
        4. Be helpful, concise, and encouraging.
        5. FORMATTING: Use clean, polished plain text. Do NOT use markdown symbols like * or ** for bolding. Use standard capitalization for emphasis.

        Conversation:
        ${normalizedMessages.map((entry) => `${entry.role || 'user'}: ${entry.content}`).join('\n')}`;

    if (!GEMINI_API_KEY) {
        return res.status(503).json({ reply: "I'm sorry, my Gemini chat brain is currently offline (API key missing)." });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: GEMINI_TEXT_MODEL,
            contents: prompt,
        });

        const reply = response.text || 'Sorry, I could not generate a response.';
        return res.json({ reply });
    } catch (err) {
        console.error('Gemini chat error:', err.message);
        return res.status(500).json({ error: 'Gemini chat failed', details: err.message });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Scientifier server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
