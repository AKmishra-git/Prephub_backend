const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_MODEL = "gemini-2.5-flash"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

const SYSTEM_PROMPT = `You are PrepBuddy, an expert interview preparation assistant for software engineering roles.
You specialize in DSA (Data Structures & Algorithms), OOPs, Computer Networks (CN), Operating Systems (OS), and DBMS.
You explain concepts clearly, walk through problem-solving approaches, and review code when asked.
Keep responses concise, structured, and beginner-friendly unless the user asks for advanced depth.`

async function sendMessage(req, res) {
  try {
    const { history, context, maxOutputTokens } = req.body

    if (!Array.isArray(history) || history.length === 0) {
      return res.status(400).json({
        success: false,
        error: "history is required and must be a non-empty array",
      })
    }

    const systemTurn = [
      {
        role: "user",
        parts: [
          {
            text: SYSTEM_PROMPT + (context ? `\n\nPage context: ${context}` : ""),
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Got it! I'm PrepBuddy, ready to help with DSA, OOPs, CN, OS and DBMS.",
          },
        ],
      },
    ]

    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [...systemTurn, ...history],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: maxOutputTokens || 1024,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data?.error?.message || "Gemini API error")
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response."

    res.json({ success: true, reply })
  } catch (err) {
    console.error("Chat controller error:", err.message)
    res.status(500).json({ success: false, error: err.message })
  }
}

module.exports = { sendMessage }