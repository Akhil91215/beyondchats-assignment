import { OpenAI } from "openai";

// Your OpenAI API key
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Original article
const originalArticle = {
  title: "Choosing the right AI chatbot : A Guide",
  content: "This article discusses how businesses can evaluate and choose the right AI chatbot based on use case, budget, and scalability."
};

// Reference content (from Zapier)
const references = `
You've probably already subscribed to ChatGPT. Maybe your company rolled out Copilot. Your developer friends won't shut up about Claude. All the noise is confusing: which one should you actually use for your work?
The answer depends on the actual task. The AI that's perfect for writing may fall flat when fact-checking; the best for coding may be too steerable, requiring you to invest too much time in your prompts; and if you need to tie multiple models into a single workflow, the household names
`;

async function rewriteArticle() {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert content writer."
        },
        {
          role: "user",
          content: `
Rewrite the following article to make it more detailed, engaging, and similar in tone to these reference articles. Include citations at the bottom.

Original Article:
Title: ${originalArticle.title}
Content: ${originalArticle.content}

Reference Articles:
${references}
`
        }
      ]
    });

    const rewritten = response.choices[0].message.content;
    console.log("\n--- REWRITTEN ARTICLE ---\n");
    console.log(rewritten);
  } catch (err) {
    console.error(err);
  }
}

rewriteArticle();
