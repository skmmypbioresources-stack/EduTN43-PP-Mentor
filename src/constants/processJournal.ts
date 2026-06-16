export interface JournalQuestion {
  id: string;
  question: string;
  description?: string;
}

export interface JournalEntry {
  id: number;
  phase: 1 | 2 | 3;
  title: string;
  criterion: 'A' | 'B' | 'C';
  questions: JournalQuestion[];
}

export const PROCESS_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 1,
    phase: 1,
    title: "Tuning In — Me",
    criterion: 'A',
    questions: [
      { id: "1_1", question: "What are your genuine interests, hobbies, and passions?", description: "List things you actually care about." },
      { id: "1_2", question: "Which ATL skills do you feel are your current strengths?", description: "Thinking, Communication, Social, Self-Management, Research." },
      { id: "1_3", question: "What patterns do you notice in your interests?", description: "Does a specific theme keep appearing?" },
      { id: "1_4", question: "Which project idea excites you most and why?", description: "Be honest about your motivation." }
    ]
  },
  {
    id: 2,
    phase: 1,
    title: "Finding Out — Learning Goal",
    criterion: 'A',
    questions: [
      { id: "2_1", question: "What exactly do you want to learn or develop skills in?", description: "State your goal clearly." },
      { id: "2_2", question: "How did your personal interest lead you to this specific goal?", description: "Explain the logical connection." },
      { id: "2_3", question: "What do you already know about this topic?", description: "Assess your baseline." },
      { id: "2_4", question: "What are the biggest gaps in your knowledge right now?", description: "What do you need to research first?" }
    ]
  },
  {
    id: 3,
    phase: 1,
    title: "Personal Context",
    criterion: 'A',
    questions: [
      { id: "3_1", question: "What personal experience or event inspired this project?", description: "Think about a moment of inspiration." },
      { id: "3_2", question: "Why does this project matter to you personally?", description: "What makes it meaningful beyond just 'school work'?" }
    ]
  },
  {
    id: 4,
    phase: 1,
    title: "Global Context",
    criterion: 'A',
    questions: [
      { id: "4_1", question: "Which Global Context exploration fits your project best?", description: "Choose one and explain why." },
      { id: "4_2", question: "How is this global context personally relevant to you?", description: "Link the big theme to your small world." },
      { id: "4_3", question: "What is the potential global or community impact of your project?", description: "How might others benefit?" }
    ]
  },
  {
    id: 5,
    phase: 1,
    title: "Inquiry Questions",
    criterion: 'A',
    questions: [
      { id: "5_1", question: "What is your main research question?", description: "The central 'Why' or 'How' of your project." },
      { id: "5_2", question: "What sub-questions will help you answer the main one?", description: "Factual, Conceptual, and Debatable questions." }
    ]
  },
  {
    id: 6,
    phase: 1,
    title: "Research & Sources",
    criterion: 'A',
    questions: [
      { id: "6_1", question: "What key sources have you found so far?", description: "Primary, secondary, subject-specific." },
      { id: "6_2", question: "how do you evaluate the reliability and relevance of your key source?", description: "Consider Origin, Purpose, Value, and Limitations (OPVL)." }
    ]
  },
  {
    id: 7,
    phase: 1,
    title: "Product Goal",
    criterion: 'A',
    questions: [
      { id: "7_1", question: "What exactly will you create, make, or produce?", description: "State your intended product clearly." },
      { id: "7_2", question: "Who is the product for and why is it useful?", description: "Define your audience and purpose." }
    ]
  },
  {
    id: 8,
    phase: 1,
    title: "Success Criteria",
    criterion: 'A',
    questions: [
      { id: "8_1", question: "What are 5 measurable success criteria for your product?", description: "How will a stranger know you succeeded?" },
      { id: "8_2", question: "How does each criterion justify the quality of your product?", description: "Why are these specific criteria the right ones?" }
    ]
  },
  {
    id: 9,
    phase: 1,
    title: "SMART Analysis",
    criterion: 'A',
    questions: [
      { id: "9_1", question: "Is your goal Specific, Measurable, Achievable, Relevant, and Time-bound?", description: "Break down each SMART aspect." }
    ]
  },
  {
    id: 10,
    phase: 1,
    title: "Planning",
    criterion: 'A',
    questions: [
      { id: "10_1", question: "What is your project timeline with milestones?", description: "Map out your journey." },
      { id: "10_2", question: "What changes did you make to your initial plan and why?", description: "Reflect on your planning process." }
    ]
  },
  {
    id: 11,
    phase: 2,
    title: "Progress Log",
    criterion: 'B',
    questions: [
      { id: "11_1", question: "What major actions have you taken in this session?", description: "Detail your work journey." },
      { id: "11_2", question: "What evidence do you have of this progress?", description: "Photos, drafts, code, designs." }
    ]
  },
  {
    id: 12,
    phase: 2,
    title: "ATL: Research & Learning",
    criterion: 'B',
    questions: [
      { id: "12_1", question: "Which specific research skill did you use to learn today?", description: "Naming the skill specifically." },
      { id: "12_2", question: "How did using this skill improve your understanding?", description: "The 'how' and 'why' of the skill application." }
    ]
  },
  {
    id: 13,
    phase: 2,
    title: "ATL: Creating the Product",
    criterion: 'B',
    questions: [
      { id: "13_1", question: "Which creative-thinking or self-management skill did you apply?", description: "Be specific about the skill cluster." },
      { id: "13_2", question: "How did this skill improve the quality of your product?", description: "Link skill to outcome." }
    ]
  },
  {
    id: 14,
    phase: 2,
    title: "ATL: Communication",
    criterion: 'B',
    questions: [
      { id: "14_1", question: "How did you communicate your ideas to others?", description: "Interviews, reports, presentations." },
      { id: "14_2", question: "How did the feedback you received shape your project?", description: "Responding to external input." }
    ]
  },
  {
    id: 15,
    phase: 2,
    title: "ATL: Social & Collaboration",
    criterion: 'B',
    questions: [
      { id: "15_1", question: "How did you seek help or mentorship efficiently?", description: "Collaboration and networking." }
    ]
  },
  {
    id: 16,
    phase: 2,
    title: "ATL: Self-Management",
    criterion: 'B',
    questions: [
      { id: "16_1", question: "What tools did you use to stay on track today?", description: "Managing time and organization." },
      { id: "16_2", question: "What challenge did you face and how did you overcome it?", description: "Resilience and problem-solving." }
    ]
  },
  {
    id: 17,
    phase: 2,
    title: "ATL: Thinking",
    criterion: 'B',
    questions: [
      { id: "17_1", question: "Describe a problem you solved creatively.", description: "What decisions did you make?" },
      { id: "17_2", question: "How did you transfer knowledge from another subject?", description: "Making interdisciplinary links." }
    ]
  },
  {
    id: 18,
    phase: 2,
    title: "ATL: Media Literacy & Ethics",
    criterion: 'B',
    questions: [
      { id: "18_1", question: "How did you evaluate the credibility of your sources today?", description: "Avoiding fake news and bias." },
      { id: "18_2", question: "How are you using information ethically?", description: "Citing, paraphrasing, avoiding plagiarism." }
    ]
  },
  {
    id: 19,
    phase: 2,
    title: "Action Phase Reflection",
    criterion: 'B',
    questions: [
      { id: "19_1", question: "What worked well and what needed changing in this phase?", description: "Evaluating your process journal." }
    ]
  },
  {
    id: 20,
    phase: 3,
    title: "Impact on My Learning",
    criterion: 'C',
    questions: [
      { id: "20_1", question: "What happened, why does it matter, and what now?", description: "Using a reflection model (Rolfe's, Gibbs', or Kolb's)." }
    ]
  },
  {
    id: 21,
    phase: 3,
    title: "Impact on Me as a Learner",
    criterion: 'C',
    questions: [
      { id: "21_1", question: "How have your skills, confidence, and mindset grown?", description: "Comparing before and after." },
      { id: "21_2", question: "Which IB Learner Profile attributes did you develop?", description: "Thinker, Inquirer, Principled, etc." }
    ]
  },
  {
    id: 22,
    phase: 3,
    title: "Product Evaluation",
    criterion: 'C',
    questions: [
      { id: "22_1", question: "How well does the product meet EVERY success criterion?", description: "Be honest and use evidence." },
      { id: "22_2", question: "How well does the product meet its intended purpose?", description: "Final assessment of utility." }
    ]
  },
  {
    id: 23,
    phase: 3,
    title: "Final Reflection",
    criterion: 'C',
    questions: [
      { id: "23_1", question: "What are the ultimate strengths and limitations of your project?", description: "The big picture." },
      { id: "23_2", question: "What would you do differently if you started again?", description: "Learning for the future." }
    ]
  }
];
