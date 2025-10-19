import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import mongoose from 'mongoose'; // <-- Changed to import

dotenv.config();

import User from './models/UserModel.js'; 

const app = express();
app.use(cors());
app.use(bodyParser.json());

const ai = new GoogleGenAI({});


const connectDB = async () => {
    try {
        // Use the MONGO_URI from the .env file
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully!');
    } catch (error) {
        console.error('❌ MongoDB connection FAILED:', error.message);
        // Exit process with failure
        process.exit(1); 
    }
};

// ------------------------------------------------------------------
// 🛑 NEW: SIGN UP (Registration) Route
// ------------------------------------------------------------------
app.post('/api/auth/signup', async (req, res) => {
    const { fullName, email, password } = req.body;

    // Basic validation
    if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'Please fill out all fields.' });
    }

    try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        // 2. Create a new user instance
        const newUser = new User({
            fullName,
            email,
            // 🛑 WARNING: In a production app, use a library like bcrypt 
            // to hash the password here BEFORE saving it.
            password: password, 
        });

        // 3. Save the user to the database
        await newUser.save();

        // 4. Respond with success
        res.status(201).json({ 
            message: 'User registered successfully!',
            userId: newUser._id,
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration.', details: error.message });
    }
});


// ------------------------------------------------------------------
// 🛑 EXISTING AI GENERATION ROUTE (Untouched Logic)
// ------------------------------------------------------------------
app.post("/api/itinerary", async (req, res) => {
    const { destination, days } = req.body;

    console.log("Received request:", req.body);

    if (!destination || !days) {
        return res.status(400).json({ error: "Destination and days are required." });
    }

    try {
        // 🛑 FINAL PROMPT TWEAK: Adding a strong directive to complete the days
        const prompt = `You are an expert travel planner. Create a detailed ${days}-day travel itinerary for ${destination}, including top attractions, food recommendations, and travel tips. Format the output using **Markdown syntax**. Use H2 headings (## Day X) for each day and H3 headings (### Morning/Afternoon/Evening) for time blocks. **You MUST generate exactly ${days} distinct '## Day X' sections.**`;

        console.log("Sending prompt to Gemini (Non-Streaming)...");

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: prompt,
            config: {
                temperature: 0.6,
                // Ensure max tokens is high enough for detail
                maxOutputTokens: 2500, // <-- INCREASED SLIGHTLY FOR SAFETY
            }
        });
        console.log("Full Gemini API response:", response);

        let itinerary = '';
        try {
            // Check if candidates exist and have content
            const candidate = response.candidates?.[0];
            if (candidate && candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                // The text is stored in the first part's 'text' field.
                itinerary = candidate.content.parts[0].text;
            }
        } catch (e) {
            console.error("Error during manual content extraction:", e);
        }


        if (!itinerary) {
            // Use the detailed information from the response if the text is still empty
            const finishReason = response.candidates?.[0]?.finishReason || 'UNKNOWN';
            console.error("Gemini returned an empty response. Finish Reason:", finishReason);
            
            // Return a clearer error to the client
            return res.status(500).json({ error: `No itinerary generated. Finish Reason: ${finishReason}` });
        }

        res.json({ itinerary });

    } catch (error) {
        // Log the detailed error to your terminal
        console.error("Error generating itinerary (Message):", error.message);
        console.error("Error generating itinerary (Full Object):", error);
        res.status(500).json({ error: "Error generating itinerary. Please check backend console for details." });
    }
});

// ------------------------------------------------------------------
// 🛑 UPDATE: Listen only after DB connection is established
// ------------------------------------------------------------------
connectDB().then(() => {
    app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
});