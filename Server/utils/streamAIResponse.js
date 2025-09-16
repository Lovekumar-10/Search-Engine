const OpenAI = require("openai");

// OpenAI client
const client = new OpenAI({
  baseURL: process.env.GITHUB_MODELS_BASEURL || "https://models.github.ai/inference",
  apiKey: process.env.GITHUB_API_KEY,
});

// -------------------------
// 🔹 SSE Helpers
// -------------------------
function setupSSE(res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  if (res.flushHeaders) res.flushHeaders();
}

function sendEvent(res, event, data) {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  if (event) res.write(`event: ${event}\n`);
  res.write(`data: ${payload}\n\n`);
}

// -------------------------
// 🔹 Stream GPT Response
// -------------------------
async function streamAIResponse(res, messages) {
  setupSSE(res);
  sendEvent(res, "status", { stage: "generating" });

  try {
    // Streaming via OpenAI SDK
    const response = await client.chat.completions.create({
      model: "openai/gpt-4o",
      messages,
      stream: true,
    });

    // If streaming supported
    if (response[Symbol.asyncIterator]) {
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          sendEvent(res, "data", { text: content });
        }
      }
      sendEvent(res, "status", { stage: "done" });
      return res.end();
    }

    // -------------------------
    // Fallback: full response
    // -------------------------
    const fullResp = await client.chat.completions.create({
      model: "openai/gpt-4o",
      messages,
    });

    const fullText = fullResp.choices?.[0]?.message?.content || "";

    // Stream word by word for frontend
    const words = fullText.split(/\s+/);
    for (let w of words) {
      sendEvent(res, "data", { text: w + " " });
      await new Promise((r) => setTimeout(r, 40)); // small delay for smooth streaming
    }

    sendEvent(res, "status", { stage: "done" });
    res.end();
  } catch (err) {
    console.error("Streaming error:", err);
    sendEvent(res, "error", { message: err.message });
    res.end();
  }
}

module.exports = { streamAIResponse, setupSSE, sendEvent };
