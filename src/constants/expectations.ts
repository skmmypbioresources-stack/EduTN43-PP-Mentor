export interface BandDetail {
  score: string;
  tag: string;
  what: string;
  note: string;
}

export interface StrandExpectation {
  id: number;
  title: string;
  prompt: string;
  bands: BandDetail[];
}

export interface CriterionExpectation {
  id: string;
  title: string;
  fullName: string;
  description: string;
  strands: StrandExpectation[];
}

export const EXAMINER_EXPECTATIONS: CriterionExpectation[] = [
  {
    id: "A",
    title: "Planning",
    fullName: "Criterion A: Planning",
    description: "The examiner checks whether you have set a clear learning goal linked to personal interest, defined your product with measurable criteria, and produced a thorough plan that maps to those criteria.",
    strands: [
      {
        id: 1,
        title: "Learning Goal & Personal Interest",
        prompt: "Have you clearly stated what you want to learn and why it matters to you?",
        bands: [
          { score: "1–2", tag: "Minimal", what: "You state a learning goal.", note: "The examiner sees a goal but no connection to you as a person. It reads like a task description, not something you genuinely care about." },
          { score: "3–4", tag: "Developing", what: "You state a learning goal and outline the connection between personal interest(s) and that goal.", note: "The examiner sees a brief account of your interest. You mention it but don't develop it. The link feels surface-level." },
          { score: "5–6", tag: "Accomplished", what: "You state a learning goal and describe the connection between personal interest(s) and that goal.", note: "The examiner sees a detailed account of your interest and how it shapes your goal. You explain what the interest is, but you may not yet give full reasons." },
          { score: "7–8", tag: "Excellent", what: "You state a learning goal and explain the connection between personal interest(s) and that goal.", note: "This is what earns full marks. The examiner sees a specific, measurable learning goal AND a detailed account that includes reasons and causes." }
        ]
      },
      {
        id: 2,
        title: "Intended Product & Success Criteria",
        prompt: "Is it clear what you will make, and can the criteria be used to judge the final product?",
        bands: [
          { score: "1–2", tag: "Minimal", what: "You state your intended product.", note: "The examiner sees only a name or description. There are no criteria, making it impossible to judge success." },
          { score: "3–4", tag: "Developing", what: "You state your intended product and present basic success criteria.", note: "The examiner sees 1–2 criteria, but they are vague (e.g., 'it should look good'). They cannot be measured." },
          { score: "5–6", tag: "Accomplished", what: "You state your intended product and present multiple appropriate success criteria.", note: "The examiner sees several relevant criteria, but they may lack specificity or be interpreted in different ways." },
          { score: "7–8", tag: "Excellent", what: "You state your intended product and present multiple appropriate, detailed success criteria.", note: "Specific, measurable criteria linked to purpose and audience. Anyone could independently judge the product." }
        ]
      },
      {
        id: 3,
        title: "Plan for Achieving the Product",
        prompt: "Is your plan detailed and does it cover all your success criteria?",
        bands: [
          { score: "1–2", tag: "Minimal", what: "You present a plan that is superficial or not focused on a product.", note: "General list of steps with no detail, no timelines, and no connection to criteria." },
          { score: "3–4", tag: "Developing", what: "You present a plan for achieving the product and some success criteria.", note: "The plan covers some criteria but ignores others. It may lack specific dates or sequencing logic." },
          { score: "5–6", tag: "Accomplished", what: "You present a detailed plan for achieving the product and most success criteria.", note: "Clear steps, timelines, and resources. addresses most success criteria with specific actions." },
          { score: "7–8", tag: "Excellent", what: "You present a detailed plan for achieving the product and all success criteria.", note: "Comprehensive, specific plan where every criterion has a corresponding action. Realistic timelines." }
        ]
      }
    ]
  },
  {
    id: "B",
    title: "Applying Skills",
    fullName: "Criterion B: Applying Skills",
    description: "The examiner checks whether you have explained how your ATL skills were used — with actual evidence — both to achieve your learning goal and to create your product.",
    strands: [
      {
        id: 1,
        title: "ATL Skills Applied to the Learning Goal",
        prompt: "Did you explain which ATL skills you used and how they helped you learn?",
        bands: [
          { score: "1–2", tag: "Minimal", what: "You state which ATL skill(s) was/were applied.", note: "The examiner sees a skill named but nothing more. No connection to your learning goal or evidence of application." },
          { score: "3–4", tag: "Developing", what: "You outline which ATL skill(s) were applied with superficial examples.", note: "Brief account with a vague example. You mention the skill loosely, but don't show what you actually did." },
          { score: "5–6", tag: "Accomplished", what: "You describe how the ATL skill(s) were applied with reference to examples.", note: "Clear account with a relevant example. The link to learning goal is made, but may not fully explore 'why'." },
          { score: "7–8", tag: "Excellent", what: "You explain how the ATL skill(s) were applied with detailed examples.", note: "Thorough explanation: which skill, exactly how used, specific moment, and how it contributed to the goal." }
        ]
      },
      {
        id: 2,
        title: "ATL Skills Applied to the Product",
        prompt: "Did you explain which ATL skills helped you create the product?",
        bands: [
          { score: "1–2", tag: "Minimal", what: "You state which ATL skill(s) was/were applied.", note: "Skill is named but nothing else. No idea what you did or how it changed the outcome." },
          { score: "3–4", tag: "Developing", what: "You outline which ATL skill(s) were applied with superficial examples.", note: "You gesture at an example but it is thin. The examiner needs to see the skill in action." },
          { score: "5–6", tag: "Accomplished", what: "You describe how the ATL skill(s) were applied with reference to examples.", note: "Solid account showing what happened. Need to explain the 'why' to go higher." },
          { score: "7–8", tag: "Excellent", what: "You explain how the ATL skill(s) were applied with detailed examples.", note: "Complete, reasoned account with specific moments and decisions. Evidence might include drafts or photos." }
        ]
      }
    ]
  },
  {
    id: "C",
    title: "Reflecting",
    fullName: "Criterion C: Reflecting",
    description: "The examiner checks whether you have genuinely explained what the project did to you as a learner, and whether you have fairly evaluated your product against the criteria you set.",
    strands: [
      {
        id: 1,
        title: "Impact of the Project on Learning",
        prompt: "Can you explain what doing this project actually did to you as a learner?",
        bands: [
          { score: "1–2", tag: "Minimal", what: "You state the impact of the project on yourself.", note: "Brief, general claim like 'This project taught me a lot'. No account of specific changes." },
          { score: "3–4", tag: "Developing", what: "You outline the impact of the project on yourself.", note: "Brief summary without depth. Identifies an area but doesn't show how or why it happened." },
          { score: "5–6", tag: "Accomplished", what: "You describe the impact of the project on yourself.", note: "Detailed picture of effects on progress, ATL skills, and growth. Usually stops at 'what' happened." },
          { score: "7–8", tag: "Excellent", what: "You explain the impact of the project on yourself.", note: "Thoughtful account including progress, reasoning for growth, and changes in mindset or perspective." }
        ]
      },
      {
        id: 2,
        title: "Evaluating the Product Against Success Criteria",
        prompt: "Have you honestly weighed the strengths and limitations of your product?",
        bands: [
          { score: "1–2", tag: "Minimal", what: "You state whether the product was achieved.", note: "Single yes/no claim with no reference to criteria or evidence." },
          { score: "3–4", tag: "Developing", what: "You state whether product was achieved, partially supported with evidence.", note: "Claim with some evidence but incomplete evaluation. Some criteria addressed while others skipped." },
          { score: "5–6", tag: "Accomplished", what: "You evaluate the product based on criteria, partially supported with evidence.", note: "Genuine evaluation weighing strengths and limitations, but evidence may not be specific enough." },
          { score: "7–8", tag: "Excellent", what: "You evaluate the product based on criteria, fully supported with specific evidence.", note: "Rigorous, criterion-by-criterion evaluation. Honestly weighed strengths and weaknesses." }
        ]
      }
    ]
  }
];

export const COMMAND_TERMS = [
  { term: "State", definition: "Give a specific name, value, or brief answer — no explanation needed. Lowest level." },
  { term: "Outline", definition: "Give a brief account or summary. More than state, but not yet a full description." },
  { term: "Describe", definition: "Give a detailed account or picture of a situation, event, pattern, or process. The what and how." },
  { term: "Explain", definition: "Give a detailed account including reasons or causes. Requires the 'why' — the Band 7 key." },
  { term: "Evaluate", definition: "Make an appraisal by weighing up strengths and limitations. Requires honest judgment." }
];
