const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini Client. It automatically picks up GEMINI_API_KEY from environment.
const ai = new GoogleGenAI({});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../')));

// Chat API Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, files } = req.body;

        if (!message && (!files || files.length === 0)) {
            return res.status(400).json({ error: 'Message or files are required' });
        }

        const promptContextText = `
You are CodeMedic AI, an intelligent debugging assistant.
Your goal is to help users diagnose and fix code issues. 
Please provide direct, helpful, and concise answers, and use markdown code blocks for code snippets.

User Query:
${message || "Analyze the attached files."}
`;

        const contentsArray = [promptContextText];

        // Process attached files
        if (files && files.length > 0) {
            files.forEach(file => {
                // files data from frontend comes as base64 data urls: "data:image/png;base64,iVBORw0KG..."
                const base64Parts = file.data.split(',');
                const base64Data = base64Parts.length > 1 ? base64Parts[1] : base64Parts[0];

                if (file.type.startsWith('image/')) {
                    // It's an image, pass as inlineData
                    contentsArray.push({
                        inlineData: {
                            data: base64Data,
                            mimeType: file.type
                        }
                    });
                } else {
                    // It's text/code, decode base64 back to string 
                    // Buffer.from works well for decoding base64
                    const decodedText = Buffer.from(base64Data, 'base64').toString('utf-8');
                    contentsArray.push(`\n\n--- File: ${file.name} ---\n${decodedText}\n--- End of File ---\n`);
                }
            });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contentsArray,
        });

        res.json({ reply: response.text });

    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({ error: 'Failed to generate response. Please check your AI connection or API key.' });
    }
});

app.listen(port, () => {
    console.log(`CodeMedic AI Backend running on http://localhost:${port}`);
});
