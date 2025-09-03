import Task from "../models/Task.js";

const GEMINI_MODEL = "gemini-1.5-flash"; // Changed from 'gemini-pro'

async function testGeminiAPI() {
  console.log("🔍 Testing Gemini API connection...");
  console.log(
    "🔑 API Key:",
    process.env.GEMINI_API_KEY ? "Present" : "MISSING!"
  );
  console.log("🤖 Using model:", GEMINI_MODEL);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Say hello world" }],
            },
          ],
        }),
      }
    );

    console.log("📡 Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Gemini API Error:", errorText);
      return false;
    }

    const data = await response.json();
    console.log(
      "✅ Gemini API Test Success:",
      data.candidates[0].content.parts[0].text
    );
    return true;
  } catch (error) {
    console.error("❌ Gemini API Test Failed:", error.message);
    return false;
  }
}

async function callGeminiAPI(prompt) {
  try {
    console.log("🤖 Calling Gemini API with model:", GEMINI_MODEL);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    console.log("📡 Gemini Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Gemini API Error Response:", errorText);
      throw new Error(`Gemini API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Gemini API Success");
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("❌ Gemini API Call Failed:", error.message);
    throw error;
  }
}

async function processTaskWithAI(taskId, title) {
  console.log(
    `\n🚀 Starting AI processing for task: "${title}" (ID: ${taskId})`
  );

  try {
    const apiWorking = await testGeminiAPI();
    if (!apiWorking) {
      throw new Error("Gemini API connection failed");
    }

    console.log("📝 Generating description...");
    // Generate description
    const descriptionPrompt = `Generate a detailed description for this task: "${title}". Make it professional and clear. Return only the description text, no extra formatting.`;
    const description = await callGeminiAPI(descriptionPrompt);
    console.log(
      "✅ Description generated:",
      description.substring(0, 100) + "..."
    );

    console.log("🔧 Generating subtasks...");
    const subtasksPrompt = `Break down this task: "${title}" into 3-5 subtasks. Return ONLY a JSON array with this exact format:
[{"title": "Subtask title", "description": "Subtask description", "storyPoints": 2}]
Use Fibonacci numbers for storyPoints (1, 2, 3, 5, 8). Return only the JSON array, no other text.`;

    const subtasksResponse = await callGeminiAPI(subtasksPrompt);
    console.log("📋 Raw subtasks response:", subtasksResponse);

    let subtasks = [];
    let totalStoryPoints = 0;

    try {
      const cleanedResponse = subtasksResponse
        .replace(/```json\s*|\s*```/g, "")
        .trim();
      console.log("🧹 Cleaned response:", cleanedResponse);
      subtasks = JSON.parse(cleanedResponse);
      totalStoryPoints = subtasks.reduce(
        (sum, subtask) => sum + (subtask.storyPoints || 1),
        0
      );
      console.log(
        "✅ Parsed subtasks:",
        subtasks.length,
        "items, total points:",
        totalStoryPoints
      );
    } catch (parseError) {
      console.error("❌ Error parsing subtasks JSON:", parseError.message);
      console.log("🔄 Using fallback subtasks...");
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

    console.log("💾 Updating database...");
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        description: description.trim(),
        subtasks,
        storyPoints: totalStoryPoints,
        aiProcessed: true,
      },
      { new: true }
    );

    if (!updatedTask) {
      throw new Error("Task not found in database");
    }

    console.log(`🎉 Task ${taskId} processed successfully with AI!`);
    console.log(
      `📊 Final result: ${subtasks.length} subtasks, ${totalStoryPoints} story points`
    );
    return updatedTask;
  } catch (error) {
    console.error("💥 Error processing task with AI:", error.message);
    console.error("📚 Full error:", error);

    try {
      console.log("🔄 Applying fallback update...");
      await Task.findByIdAndUpdate(taskId, {
        description: `AI processing failed: ${error.message}. Please add description manually.`,
        aiProcessed: true,
      });
      console.log("✅ Fallback update applied");
    } catch (fallbackError) {
      console.error("❌ Fallback update failed:", fallbackError.message);
    }
  }
}

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    console.log("\n📝 Creating new task:", title);

    if (!title) {
      console.log("❌ No title provided");
      return res.status(400).json({ error: "Title is required" });
    }

    const task = new Task({ title });
    await task.save();
    console.log("✅ Task saved to database:", task._id);

    console.log("🚀 Starting AI processing in background...");
    processTaskWithAI(task._id.toString(), task.title).catch((error) => {
      console.error("💥 Background AI processing failed:", error.message);
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("❌ Create task error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error("❌ Get tasks error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { author, content } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.comments.push({ author, content });
    await task.save();

    res.json(task);
  } catch (error) {
    console.error("❌ Add comment error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("❌ Update status error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
