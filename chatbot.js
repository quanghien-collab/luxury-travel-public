import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function chatLuxuryAssistant(req, res) {
  try {
    const userMessage = (req.body?.message || "").trim();
    if (!userMessage) return res.json({ reply: "Vui lòng nhập câu hỏi." });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content:
            "Bạn là Luxury Travel Concierge. Trả lời tinh tế, ngắn gọn, chuyên nghiệp. " +
            "Tư vấn hành trình cao cấp, hỏi thêm 1-2 câu để hiểu nhu cầu. Không nói về AI hay mô hình."
        },
        { role: "user", content: userMessage }
      ]
    });

    res.json({ reply: completion.choices?.[0]?.message?.content || "Xin lỗi, tôi chưa có phản hồi." });
  } catch (err) {
    console.error("CHATBOT ERROR:", err);
    res.status(500).json({ reply: "Luxury Assistant đang bận. Vui lòng thử lại sau." });
  }
}
