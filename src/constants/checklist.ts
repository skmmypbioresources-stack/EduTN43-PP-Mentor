export interface ChecklistItem {
  id: string;
  label: string;
}

export interface Strand {
  roman: string;
  title: string;
  objective: string;
  items: ChecklistItem[];
}

export interface CriterionChecklist {
  id: string;
  name: string;
  intro: string;
  strands: Strand[];
}

export const BAND_7_CHECKLIST: CriterionChecklist[] = [
  {
    id: 'A',
    name: 'Criterion A: Planning',
    intro: 'Students should be able to: (i) state a learning goal and explain how a personal interest led to that goal; (ii) state an intended product and develop appropriate success criteria; (iii) present a clear, detailed plan for achieving the product and its success criteria.',
    strands: [
      {
        roman: 'i',
        title: 'Learning Goal & Personal Interest',
        objective: 'State a learning goal and explain how a personal interest led to that goal',
        items: [
          { id: "A_i_1", label: "I have clearly stated a specific learning goal — focusing on what I want to learn, not just what I will make." },
          { id: "A_i_2", label: "My learning goal uses the word 'explain' — I have given reasons and causes for why my personal interest led to this specific goal." },
          { id: "A_i_3", label: "I have described my personal interest in genuine detail, not just named it — the examiner can see why I care about this topic." },
          { id: "A_i_4", label: "The connection between my personal interest and my learning goal is explicit, reasoned, and personal to me." },
          { id: "A_i_5", label: "My learning goal is distinct from my product goal — I have not confused the two in my report." },
          { id: "A_i_6", label: "My learning goal is specific enough that I can tell, by the end of the project, whether I have achieved it." },
          { id: "A_i_7", label: "I have gone beyond just stating — my report explains how the interest grew and why it drove me to this particular area of learning." },
        ]
      },
      {
        roman: 'ii',
        title: 'Intended Product & Success Criteria',
        objective: 'State an intended product and develop appropriate success criteria for the product',
        items: [
          { id: "A_ii_1", label: "I have stated my intended product precisely — a reader who does not know me can picture exactly what I am making." },
          { id: "A_ii_2", label: "I have developed multiple success criteria that are specific and appropriate to my product." },
          { id: "A_ii_3", label: "Each success criterion is measurable — I can demonstrate objectively whether the product met it or not." },
          { id: "A_ii_4", label: "My success criteria cover the full range of what the product must achieve — they are not limited to one aspect." },
          { id: "A_ii_5", label: "I have justified why each criterion is appropriate for my specific product and audience." },
          { id: "A_ii_6", label: "My success criteria are detailed enough that an independent person could use them to judge the product." },
          { id: "A_ii_7", label: "I have considered the audience, purpose, and context of my product when writing the criteria." },
        ]
      },
      {
        roman: 'iii',
        title: 'Plan for Achieving the Product',
        objective: 'Present a clear, detailed plan for achieving the product and its associated success criteria',
        items: [
          { id: "A_iii_1", label: "I have presented a clear, detailed plan — not just a list of broad stages, but specific steps with actions." },
          { id: "A_iii_2", label: "My plan covers how I will achieve the product from start to finish — there are no unexplained gaps." },
          { id: "A_iii_3", label: "My plan is directly linked to all of my success criteria — each criterion is addressed somewhere in the plan." },
          { id: "A_iii_4", label: "I have included realistic timelines, deadlines, and milestones in my plan." },
          { id: "A_iii_5", label: "I have identified the resources, tools, and materials I need at each stage." },
          { id: "A_iii_6", label: "My plan shows how I will know when each stage is complete — it is not open-ended." },
          { id: "A_iii_7", label: "I have shown how I adjusted my plan when things changed — and why those changes were necessary." },
        ]
      }
    ]
  },
  {
    id: 'B',
    name: 'Criterion B: Applying Skills',
    intro: 'Students should be able to: (i) explain how the ATL skill(s) was/were applied to help achieve their learning goal; (ii) explain how the ATL skill(s) was/were applied to help achieve their product.',
    strands: [
      {
        roman: 'i',
        title: 'ATL Skills Applied to the Learning Goal',
        objective: 'Explain how the ATL skill(s) was/were applied to help achieve the learning goal',
        items: [
          { id: "B_i_1", label: "I have named a specific ATL skill cluster — I have not used a vague phrase like 'I used research skills' without specifying which one." },
          { id: "B_i_2", label: "I have explained (not just described) how the ATL skill was applied — I give reasons for why using this skill in this way helped me learn." },
          { id: "B_i_3", label: "I have supported my explanation with a detailed, specific example — a real moment, decision, or outcome from my process journal." },
          { id: "B_i_4", label: "The link between the ATL skill and my learning goal is explicit — I have stated how using this skill contributed to achieving the goal." },
          { id: "B_i_5", label: "I have shown that I applied the skill meaningfully — it changed or deepened my understanding, not just helped me complete a task." },
          { id: "B_i_6", label: "I have used the correct language — I explain the impact, not merely list what I did." },
          { id: "B_i_7", label: "My evidence is specific and referenced — I point to a source, a journal entry, or a concrete example, not a general claim." },
        ]
      },
      {
        roman: 'ii',
        title: 'ATL Skills Applied to the Product',
        objective: 'Explain how the ATL skill(s) was/were applied to help achieve the product',
        items: [
          { id: "B_ii_1", label: "I have identified at least one ATL skill (different or the same) and explained how it helped me create the product." },
          { id: "B_ii_2", label: "I have explained — with reasons — how applying this skill at a specific stage of product creation improved the outcome." },
          { id: "B_ii_3", label: "I have provided a detailed example that shows the skill in action during the making of the product." },
          { id: "B_ii_4", label: "The connection between the skill application and the product quality or development is clearly explained." },
          { id: "B_ii_5", label: "I have shown how the skill helped me overcome a challenge, make a decision, or improve a feature of the product." },
          { id: "B_ii_6", label: "My explanation goes beyond what I did — it explains why using this skill at this moment made a difference to the product." },
          { id: "B_ii_7", label: "I have referenced evidence of the skill in use — photographs, drafts, feedback notes, or process journal entries." },
        ]
      }
    ]
  },
  {
    id: 'C',
    name: 'Criterion C: Reflecting',
    intro: 'Students should be able to: (i) explain the impact of the project on themselves or their learning; (ii) evaluate the product based on the success criteria.',
    strands: [
      {
        roman: 'i',
        title: 'Impact on Self and Learning',
        objective: 'Explain the impact of the project on themselves or their learning',
        items: [
          { id: "C_i_1", label: "I have explained — not just described — the impact of the project on me as a learner, giving reasons and causes." },
          { id: "C_i_2", label: "I have addressed my learning goal directly: did I achieve it, partially achieve it, or not — and why?" },
          { id: "C_i_3", label: "I have reflected on progress made toward the learning goal with specific examples, not general statements." },
          { id: "C_i_4", label: "I have shown how the project changed the way I think, not just what I now know." },
          { id: "C_i_5", label: "I have reflected on growth in specific ATL skills — with concrete examples of how I am different now compared to when I started." },
          { id: "C_i_6", label: "I have mentioned how the project affected me as a person — changes in mindset, confidence, habits, or perspectives." },
          { id: "C_i_7", label: "My reflection is personal and specific — it could only have been written by me, based on my unique experience of this project." },
          { id: "C_i_8", label: "I have considered the broader impact of the project — on my learning, on others, or on my understanding of the global context." },
        ]
      },
      {
        roman: 'ii',
        title: 'Product Evaluation Against Success Criteria',
        objective: 'Evaluate the product based on the success criteria',
        items: [
          { id: "C_ii_1", label: "I have evaluated my product against every single success criterion I set in Criterion A — none are omitted." },
          { id: "C_ii_2", label: "My evaluation uses the word 'evaluate' — I weigh strengths and limitations, not just describe what I made." },
          { id: "C_ii_3", label: "I have used specific evidence to support every evaluative judgment — not vague claims like 'it was good'." },
          { id: "C_ii_4", label: "I have been honest — I acknowledge where the product did not fully meet a criterion and explain why." },
          { id: "C_ii_5", label: "I have used feedback from others (audience, peers, mentor) as evidence in my evaluation where relevant." },
          { id: "C_ii_6", label: "I have suggested specific, realistic improvements — not just 'I would do better next time' without detail." },
          { id: "C_ii_7", label: "My evaluation is fully supported — every criterion has a judgment, evidence, and a reason for that judgment." },
        ]
      }
    ]
  }
];
