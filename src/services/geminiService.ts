import { GoogleGenAI, Type } from "@google/genai";
import { Project, SectionType } from "../types";

function getGeminiClient(): GoogleGenAI {
  const customKey = localStorage.getItem('user_gemini_api_key');
  const apiKey = customKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("apikey_missing");
  }
  return new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  try {
    const aiInstance = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    const response = await aiInstance.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Say OK.",
    });
    return !!response.text;
  } catch (err) {
    console.error("API Key validation error:", err);
    throw err;
  }
}

export interface MentorResponse {
  questions: string[];
  gapDetection: string;
  mindMapNodes: string[];
  checklistUpdates: Record<string, boolean>;
}

const SECTION_PROMPTS: Record<SectionType, string> = {
  goal: `You are an IB MYP Personal Project supervisor. The student is defining their Learning Goal (Criterion A - Strand i). 
         Analyze their input and provide 3-5 probing questions to deepen their thinking.
         Also provide 5-8 "Mind Map Nodes" — these are punchy, short keywords or concepts (2-4 words each) that the student should explore further based on their goal.
         Look for gaps in: personal meaning, interest trigger, difficulty/ambition, connection to global context, and conceptual involvement.`,
  product: `You are an IB MYP Personal Project supervisor. The student is describing their Product (Criterion A - Strand i).
          Analyze their input and ask questions about the product's nature, scope, and how it demonstrates the learning goal.
          Generate "Mind Map Nodes" for product features, audience needs, or technical skills required.`,
  criteria: `You are an IB MYP Personal Project supervisor. The student is defining Success Criteria (Criterion A - Strand ii).
           Analyze their input and ask about measurability (quantifiable), objectivity, target audience, and quality benchmarks.
           Generate "Mind Map Nodes" for specific benchmarks or testing methods.`,
  planning: `You are an IB MYP Personal Project supervisor. The student is creating an Action Plan (Criterion A - Strand iii).
           Analyze their input and ask about task breakdown, dependencies, timelines, and contingency plans.
           Generate "Mind Map Nodes" for milestones, resources, or risks.`,
  skills: `You are an IB MYP Personal Project supervisor. The student is explaining how they applied ATL skills (Criterion B).
          Analyze their input and ask why they chose specific skills, their effectiveness, and what they'd do differently.
          Generate "Mind Map Nodes" for specific skill applications or results.`,
  reflection: `You are an IB MYP Personal Project supervisor. The student is reflecting on their process and product (Criterion C & D).
              Analyze their input and ask about personal learning, challenges faced, and impacts on the community or themselves.
              Generate "Mind Map Nodes" for impact areas or personal growth descriptors.`
};

export async function getMentorFeedback(
  project: Project,
  sectionId: SectionType,
  content: string
): Promise<MentorResponse> {
  const systemInstruction = `
    You are the "MYP Personal Project Mentor", a teacher-style advisor for the International Bakcalaureate (IB) Middle Years Programme (MYP) Personal Project.
    
    CORE PHILOSOPHY:
    - You MUST NOT generate paragraphs or ready-made answers.
    - You MUST NOT complete the student's report.
    - Act like a supervisor asking probing questions and suggesting "Mind Map" ideas.
    - Scaffold thinking using guiding questions, reflection triggers, and "Have you considered..." nudges.
    
    MIND MAP NODES:
    - These are short (2-4 words) concept nodes that branch out from the student's central goal/draft.
    - They should represent areas of inquiry, potential resources, or sub-tasks.
    - Format: "Personal Interest Story", "Success Metrics", "Resource Collection", etc.
    
    AUTHENTICITY & ANTI-AI RULES (CRITICAL):
    - To prevent Turnitin detection, the student's work must remain in their unique voice.
    - NEVER provide "Suggested Text" or "Example Paragraphs" that the student could copy.
    - If student input is weak, explain WHY it is weak instead of fixing it (e.g., "This lacks personal evidence").
    - Explicitly warn against using AI to generate text, as it deletes their "linguistic fingerprint".
    
    DIRECTIONS:
    - Analyze the student's input for the specific section: ${sectionId}.
    - ${SECTION_PROMPTS[sectionId]}
    - Identify GAPS in their thinking (e.g., missing personal connection, no justification).
    - If Band 7 Mode is ON (${project.band7Mode ? 'YES' : 'NO'}), ask deeper questions about justification, limitations, and conceptual links.
    - Provide a checklist validation (booleans) for common IB requirements.
    - Do NOT assign band scores or marks. Focus on growth through inquiry.
  `;

  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: `Student Content for ${sectionId}:\n"${content}"`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3-5 probing questions for the student."
          },
          gapDetection: {
            type: Type.STRING,
            description: "A concise nudge about what is missing or needs more detail."
          },
          mindMapNodes: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 5-8 short (2-4 words) keywords for a mind map."
          },
          checklistUpdates: {
            type: Type.OBJECT,
            properties: {
              personalConnection: { type: Type.BOOLEAN },
              justification: { type: Type.BOOLEAN },
              measurability: { type: Type.BOOLEAN },
              evaluationDepth: { type: Type.BOOLEAN }
            },
            description: "Checklist indicators based on student input."
          }
        },
        required: ["questions", "gapDetection", "mindMapNodes", "checklistUpdates"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse mentor response", e);
    return {
      questions: ["Could you clarify your main objective here?", "How does this link to your initial vision?"],
      gapDetection: "I'm having trouble analyzing this. Try to be more specific about your goals.",
      mindMapNodes: ["Clarity", "Personal Interest", "Timeline", "Success Criteria"],
      checklistUpdates: {}
    };
  }
}
