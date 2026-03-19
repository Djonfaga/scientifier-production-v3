// Scientifier Voice Client - Powered by Gemini Live (WebSocket)
// ==========================================
console.log("Voice Client Module Loaded");

const GEMINI_API_KEY_DEFAULT = "";
let GEMINI_API_KEY = GEMINI_API_KEY_DEFAULT;

// Comprehensive fallback knowledge base for when /api/config is unavailable
const FALLBACK_SITE_CONTENT = `
--- Scientifier Platform Overview ---
Scientifier is a science-based learning platform that combines neuroscience, psychology, and AI to make learning effortless, permanent, and accessible worldwide. It was built by the Scientifier team led by Bourama DJONFAGA.

--- Pricing ---
STARTER PLAN: $0/forever. Includes: 1 language course, basic spaced repetition, community access, progress tracking. Does NOT include: AI personalization, 1-on-1 coaching.
PRO PLAN (Most Popular): $8/month ($6.40/month billed annually, save 20%). Includes: All languages unlimited, advanced AI personalization, NSDR protocols, cognitive bridging, gamification and streaks. Does NOT include: 1-on-1 coaching. Comes with a 7-day free trial.
ELITE PLAN: $64/month ($51.20/month billed annually, save 20%). Includes: Everything in Pro, weekly 1-on-1 coaching (30-min sessions), 24/7 human support, custom learning roadmap, AI skills courses, certification included.
30-Day Money-Back Guarantee on all paid plans.
Students get 50% off Pro and Elite plans with student ID verification.
Payment methods: All major credit cards, PayPal, bank transfers for annual plans.
You can switch plans (upgrade or downgrade) at any time; changes take effect at the next billing cycle.

--- Programs & Languages ---
LANGUAGES OFFERED: English, French, Spanish, Turkish, Arabic. Each language has courses for speakers of other supported languages (e.g., Learn French for English speakers, Learn French for Arabic speakers, etc.).
AI SKILLS COURSES: Prompt Engineering (master AI communication), MCP Automations (automate workflows with AI), AI Optimization (optimize AI for your needs).
OTHER SKILLS: Sports Science, Chess Mastery, Speed Typing.

--- The Scientifier Method (4 Pillars) ---
1. NEUROSCIENCE: Uses spaced repetition and NSDR (Non-Sleep Deep Rest) protocols to optimize the brain's retention centers for permanent memory.
2. PSYCHOLOGY: Aligns learning with personal ambitions (career, heritage, life goals) to create intrinsic motivation and unstoppable drive.
3. TECHNOLOGY: Adaptive AI that evolves with each learner, adjusting difficulty in real-time to maintain the optimal flow state.
4. COGNITIVE BRIDGING: Leverages existing knowledge to accelerate new learning (e.g., using French to master Spanish), creating intelligent shortcuts to fluency.

--- AI Features ---
Adaptive Difficulty: AI analyzes performance in real-time and adjusts lesson difficulty.
Smart Spaced Repetition: Algorithm predicts when you are about to forget and schedules reviews for maximum retention.
Personalized Pathways: Goals shape the curriculum (business French, travel Spanish, etc.).

--- Gamification ---
Daily Streaks: Build momentum with streak tracking that triggers dopamine-driven habit formation.
XP and Levels: Earn experience points for every lesson completed.
Achievements: Unlock badges for milestones and challenges.

--- Contact ---
Users can reach Scientifier via the contact page at contact.html or email.

--- Stats ---
50,000+ active learners, 95% retention rate, 6 languages, 500+ hours of content.
`;

let SITE_CONTENT = FALLBACK_SITE_CONTENT;
let configLoaded = false;

// Fetch config on load — use server content if available, otherwise keep fallback
fetch('/api/config')
    .then(res => res.json())
    .then(data => {
        if (data.geminiKey) {
            console.log("Config loaded successfully from server");
            GEMINI_API_KEY = data.geminiKey;
        }
        if (data.siteContent && data.siteContent.trim().length > 100) {
            SITE_CONTENT = data.siteContent;
            console.log("Site content loaded from server");
        } else {
            console.log("Server content empty or too short, using fallback knowledge base");
        }
        configLoaded = true;
    })
    .catch(err => {
        console.warn("Server config unavailable, using fallback knowledge base");
        configLoaded = true;
    });

const MODEL = "models/gemini-2.0-flash-exp";
const HOST = "generativelanguage.googleapis.com";
const URI = `wss://${HOST}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

// State
let isConnected = false;
let retryCount = 0;
const MAX_RETRIES = 3;
let inputAudioContext = null;
let outputAudioContext = null;
let mediaStream = null;
let ws = null;
let nextStartTime = 0;
let sources = new Set();
let mounted = true;

// Start Live Session
window.startLiveSession = async function () {
    console.log("Starting Live Session (WebSocket)...");

    updateLiveUI('connecting', "Connecting to Scienti...");
    mounted = true;

    try {
        // Init Audio Contexts
        inputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });

        // Request Mic
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (e) {
            updateLiveUI('error', "Microphone access denied.");
            return;
        }

        // Initialize WebSocket
        const apiKey = GEMINI_API_KEY || import.meta.env?.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            updateLiveUI('error', "Live voice mode is unavailable until GEMINI_API_KEY is configured.");
            return;
        }

        const url = `${URI}?key=${apiKey}`;
        ws = new WebSocket(url);

        ws.onopen = () => {
            console.log("WebSocket Connected");
            isConnected = true;
            retryCount = 0; // Reset on success
            updateLiveUI('active', "Listening...");

            // Send Setup Message
            const setupMsg = {
                setup: {
                    model: MODEL,
                    system_instruction: {
                        parts: [
                            {
                                text: `You are Scienti, the AI learning assistant built by the Scientifier (pronounced scienteefier) team led by Bourama DJONFAGA (pronounced in French).
                            
                            IDENTITY & SOURCE RULES:
                            1. You MUST NEVER say you were built by Google. If asked who created you, say you were built by the Scientifier team led by Bourama DJONFAGA.
                            2. Use ONLY the following knowledge base to answer questions about Scientifier's pricing, programs, and methods:
                            ${SITE_CONTENT}
                            3. Your knowledge also includes general learning science, language learning, and coding.
                            
                            FORMATTING RULES:
                            1. DO NOT use markdown symbols like * or ** for bolding. Use plain text only.
                            2. Be extremely concise and natural.
                            3. If you don't know something based on the knowledge base, do not hallucinate; provide a helpful general answer based on your learning science expertise.` }
                        ]
                    },
                    generation_config: {
                        response_modalities: ["audio"],
                        speech_config: {
                            voice_config: { prebuilt_voice_config: { voice_name: "Kore" } }
                        }
                    }
                }
            };
            console.log("Sending Setup Message:", JSON.stringify(setupMsg));
            ws.send(JSON.stringify(setupMsg));

            // Start Audio Processing
            processAudioInput();
        };

        ws.onmessage = async (event) => {
            let data;
            if (event.data instanceof Blob) {
                data = JSON.parse(await event.data.text());
            } else {
                data = JSON.parse(event.data);
            }

            if (data.serverContent?.modelTurn?.parts?.[0]?.inlineData) {
                const base64Audio = data.serverContent.modelTurn.parts[0].inlineData.data;
                playAudioChunk(base64Audio);
            }
        };

        ws.onclose = (e) => {
            console.log(`WebSocket Closed: Code ${e.code}, Reason: ${e.reason}`);
            isConnected = false;

            if (mounted && e.code !== 1000 && retryCount < MAX_RETRIES) {
                retryCount++;
                console.log(`Retrying connection (${retryCount}/${MAX_RETRIES})...`);
                updateLiveUI('connecting', `Reconnecting... (${retryCount})`);
                setTimeout(window.startLiveSession, 2000);
            } else {
                updateLiveUI('inactive', "Disconnected");
                retryCount = 0;
            }
        };

        ws.onerror = (e) => {
            console.error("WebSocket Error Object:", e);
            // Some browsers don't give reason in onerror, onclose is more reliable
        };

    } catch (e) {
        console.error("Failed to start session:", e);
        updateLiveUI('error', e.message);
    }
};

window.stopLiveSession = function () {
    console.log("Stopping Live Session...");
    isConnected = false;
    mounted = false;

    if (ws) {
        ws.close();
        ws = null;
    }

    if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop());
        mediaStream = null;
    }

    if (inputAudioContext) inputAudioContext.close();
    if (outputAudioContext) outputAudioContext.close();

    updateLiveUI('inactive', "Session Ended");
};

// --- Audio Input Processing ---
function processAudioInput() {
    try {
        if (inputAudioContext && mediaStream && inputAudioContext.state !== 'closed') {
            const source = inputAudioContext.createMediaStreamSource(mediaStream);
            const processor = inputAudioContext.createScriptProcessor(4096, 1, 1);

            processor.onaudioprocess = (e) => {
                if (!isConnected || !ws || ws.readyState !== WebSocket.OPEN) return;

                const inputData = e.inputBuffer.getChannelData(0);
                updateVisualizer(inputData);

                const pcm16 = floatTo16BitPCM(inputData);
                const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)));

                const msg = {
                    realtimeInput: {
                        mediaChunks: [{
                            mimeType: "audio/pcm;rate=16000",
                            data: base64
                        }]
                    }
                };
                ws.send(JSON.stringify(msg));
            };

            source.connect(processor);
            processor.connect(inputAudioContext.destination);
        }
    } catch (e) {
        console.error("Audio Input Connection Error:", e);
    }
}

// --- Audio Output Processing ---
async function playAudioChunk(base64Audio) {
    if (!outputAudioContext) return;

    updateLiveUI('speaking', "Scienti Speaking...");

    const audioBuffer = await decodeAudioData(base64Audio, outputAudioContext, 24000, 1);

    // Manage timing to play chunks seamlessly
    const currentTime = outputAudioContext.currentTime;
    if (nextStartTime < currentTime) nextStartTime = currentTime;

    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputAudioContext.destination);

    source.onended = () => {
        sources.delete(source);
        if (sources.size === 0) updateLiveUI('active', "Listening...");
    };

    source.start(nextStartTime);
    nextStartTime += audioBuffer.duration;
    sources.add(source);
}

// --- Helpers ---
async function decodeAudioData(base64, ctx, sampleRate, numChannels) {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);

    const dataInt16 = new Int16Array(bytes.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

function floatTo16BitPCM(input) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
}

// --- UI Helpers ---
function updateLiveUI(state, msg) {
    const statusText = document.getElementById('live-status-text');
    const subStatus = document.getElementById('live-sub-status');
    const orb = document.getElementById('live-orb');

    if (statusText) statusText.textContent = msg;
    if (subStatus) subStatus.textContent = state === 'speaking' ? "Speaking..." : "Active";

    if (orb) {
        if (state === 'speaking') {
            orb.style.transform = 'scale(1.2)';
            orb.style.boxShadow = '0 0 80px var(--color-accent)';
        } else if (state === 'active') {
            orb.style.transform = 'scale(1)';
            orb.style.boxShadow = '0 0 50px var(--color-primary)';
        }
    }
}

function updateVisualizer(data) {
    const visualizer = document.getElementById('visualizer');
    if (!visualizer) return;
    const bars = visualizer.querySelectorAll('.bar');
    if (!bars.length) return;
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
    const rms = Math.sqrt(sum / data.length);
    const val = Math.min(rms * 10, 1);
    bars.forEach(bar => {
        bar.style.height = `${10 + (Math.random() * 90 * val)}px`;
    });
}
