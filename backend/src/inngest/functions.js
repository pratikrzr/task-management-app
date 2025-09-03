import { Inngest } from "inngest";
import Task from "../models/Task.js";

export const inngest = new Inngest({
  id: "task-management-app",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

async function callGeminiAPI(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

export const processTicketWithAI = inngest.createFunction(
  { id: "process-ticket-ai" },
  { event: "ticket/created" },
  async ({ event }) => {
    try {
      const { taskId, title } = event.data;

      // Generate description
      const descriptionPrompt = `Generate a detailed description for this task: "${title}". Make it professional and clear. Return only the description text, no extra formatting.`;
      const description = await callGeminiAPI(descriptionPrompt);

      // Generate subtasks
      const subtasksPrompt = `Break down this task: "${title}" into 3-5 subtasks. Return ONLY a JSON array with this exact format:
[{"title": "Subtask title", "description": "Subtask description", "storyPoints": 2}]
Use Fibonacci numbers for storyPoints (1, 2, 3, 5, 8). Return only the JSON array, no other text.`;

      const subtasksResponse = await callGeminiAPI(subtasksPrompt);

      let subtasks = [];
      let totalStoryPoints = 0;

      try {
        const cleanedResponse = subtasksResponse
          .replace(/```json\s*|\s*```/g, "")
          .trim();
        subtasks = JSON.parse(cleanedResponse);
        totalStoryPoints = subtasks.reduce(
          (sum, subtask) => sum + (subtask.storyPoints || 1),
          0
        );
      } catch (parseError) {
        console.error("Error parsing subtasks JSON:", parseError);
        subtasks = [
          {
            title: "Plan and Research",
            description: "Research and plan the implementation",
            storyPoints: 2,
          },
          {
            title: "Implementation",
            description: "Implement the core functionality",
            storyPoints: 5,
          },
          {
            title: "Testing",
            description: "Test the implementation",
            storyPoints: 3,
          },
        ];
        totalStoryPoints = 10;
      }

      await Task.findByIdAndUpdate(taskId, {
        description: description.trim(),
        subtasks,
        storyPoints: totalStoryPoints,
        aiProcessed: true,
      });

      console.log(`Task ${taskId} processed with AI successfully`);
    } catch (error) {
      console.error("Error processing ticket with AI:", error);

      await Task.findByIdAndUpdate(event.data.taskId, {
        description: "AI processing failed. Please add description manually.",
        aiProcessed: true,
      });
    }
  }
);
