export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  description: string;
  functionalRoles: string[];
  industryDomains: string[];
}

export interface JobDescriptionInfo {
  roles: string[];
  domains: string[];
  keywords: string[];
}

export interface ApplicationVersion {
  id: string;
  name: string;
  createdAt: string;
  lastModified: string;
  masterLastSynced: string;
  contentHash: string;
  templateUsed: string;
  hasUnsyncedChanges?: boolean;
  simulatedResumeContent: string;
  simulatedCoverLetterContent: string;
}

export interface SimulatedChange {
  id: string;
  description: string;
}

// --- Mock Experience Entries ---
export const mockExperienceEntries: ExperienceEntry[] = [
  {
    id: "exp1",
    title: "Senior Product Manager",
    company: "InnovateX Solutions",
    description: "Led cross-functional teams (5 engineers, 2 designers) to develop and launch new SaaS products in the fintech space. Increased user engagement by 20% and revenue by 15% within 6 months. Defined product strategy, managed roadmap, and oversaw entire product lifecycle.",
    functionalRoles: ["Product Management", "Team Leadership", "SaaS Product Development"],
    industryDomains: ["Fintech", "SaaS"],
  },
  {
    id: "exp2",
    title: "Program Manager",
    company: "EduTech Global",
    description: "Managed large-scale educational technology projects, ensuring on-time and on-budget delivery for a portfolio of 5 projects with a combined budget of $2M. Implemented agile methodologies, improving project completion rates by 25%.",
    functionalRoles: ["Program Management", "Project Management", "Agile Leadership"],
    industryDomains: ["Education", "EdTech"],
  },
  {
    id: "exp3",
    title: "Partnerships Manager",
    company: "Global Payments Inc.",
    description: "Developed and maintained strategic partnerships with 10+ key enterprise clients in the payments industry. Secured 3 new enterprise clients, growing partnership revenue by 25% year-over-year. Negotiated complex contracts and fostered long-term relationships.",
    functionalRoles: ["Partnerships", "Business Development", "Client Relations"],
    industryDomains: ["Payments", "Fintech"],
  },
  {
    id: "exp4",
    title: "Marketing Specialist",
    company: "Retail Innovations",
    description: "Executed digital marketing campaigns across various channels (SEO, SEM, Social Media) for e-commerce products. Increased website traffic by 30% and conversion rates by 10%. Analyzed campaign performance and optimized strategies.",
    functionalRoles: ["Marketing", "Digital Marketing", "Campaign Management"],
    industryDomains: ["E-commerce", "Retail"],
  },
];

// --- Mock Job Description Info ---
export const mockJobDescriptionInfo: JobDescriptionInfo = {
  roles: ["Product Management", "Strategic Planning"],
  domains: ["Fintech", "SaaS"],
  keywords: ["product strategy", "roadmap development", "user stories", "agile methodologies", "market analysis", "cross-functional collaboration", "customer lifecycle", "data-driven decisions"],
};

// --- Mock Application Versions ---
export const mockApplicationVersions: ApplicationVersion[] = [
  {
    id: "v1",
    name: "Product Manager - InnovateX",
    createdAt: "2023-10-26, 10:00 AM",
    lastModified: "2023-10-26, 10:30 AM",
    masterLastSynced: "2023-10-26, 10:00 AM",
    contentHash: "abc1",
    templateUsed: "modern",
    simulatedResumeContent: `
**John Doe**
john.doe@example.com | (555) 123-4567 | LinkedIn.com/in/johndoe

**Tagline:** Driving Results as a Product Manager in Fintech.

**Role-Specific Summary:**
Highly accomplished Product Manager with a proven track record in Fintech and 3 key experiences. Specializing in product strategy, roadmap development, user stories and leading cross-functional teams to deliver impactful solutions.

**Experience:**
*   **Senior Product Manager, InnovateX Solutions**
    *   Led cross-functional teams (5 engineers, 2 designers) to develop and launch new SaaS products in the fintech space. Increased user engagement by 20% and revenue by 15% within 6 months. Defined product strategy, managed roadmap, and oversaw entire product lifecycle.
    *   *Relevant Tags:* Product Management, Team Leadership, SaaS Product Development, Fintech, SaaS
*   **Program Manager, EduTech Global**
    *   Managed large-scale educational technology projects, ensuring on-time and on-budget delivery for a portfolio of 5 projects with a combined budget of $2M. Implemented agile methodologies, improving project completion rates by 25%.
    *   *Relevant Tags:* Program Management, Project Management, Agile Leadership, Education, EdTech

**Skills:** Product Management, Team Leadership, SaaS Product Development, Fintech, SaaS, Program Management, Project Management, Agile Leadership, Education, EdTech, product strategy, roadmap development, user stories, agile methodologies.
`,
    simulatedCoverLetterContent: `
Dear Hiring Manager,

I am writing to express my enthusiastic interest in the Product Manager position at InnovateX Solutions, as advertised on LinkedIn. With a proven track record in leading cross-functional teams (5 engineers, 2 designers) to develop and launch new SaaS products in the fintech space. Increased user engagement by 20% and revenue by 15% within 6 months. Defined product strategy, managed roadmap, and oversaw entire product lifecycle., I am confident in my ability to contribute significantly to your team.

During my tenure as a Senior Product Manager at InnovateX Solutions, I successfully led the development and launch of several products within the Fintech sector. My responsibilities included defining product strategy, managing the entire product lifecycle, and collaborating closely with engineering, design, and marketing teams to ensure successful market entry and adoption. For example, I spearheaded a project that resulted in a 20% increase in user engagement and a 15% growth in revenue for the division.

I am particularly drawn to InnovateX Solutions' innovative approach to product development and believe my expertise in product strategy aligns perfectly with the requirements of this role. My ability to translate complex business requirements into actionable product roadmaps and drive cross-functional teams to achieve ambitious goals would be a valuable asset.

Thank you for your time and consideration. I have attached my resume for your review and welcome the opportunity to discuss how my skills and experience align with your needs in more detail.

Sincerely,
John Doe
`,
  },
  {
    id: "v2",
    name: "Program Manager - Google",
    createdAt: "2023-11-01, 09:00 AM",
    lastModified: "2023-11-01, 09:15 AM",
    masterLastSynced: "2023-10-26, 10:00 AM",
    contentHash: "def2",
    templateUsed: "simple",
    hasUnsyncedChanges: true,
    simulatedResumeContent: `
**John Doe**
john.doe@example.com | (555) 123-4567 | LinkedIn.com/in/johndoe

**Tagline:** Experienced Program Manager in EdTech.

**Role-Specific Summary:**
Highly accomplished Program Manager with a proven track record in Education and 3 key experiences. Specializing in project planning, stakeholder management, risk mitigation and leading cross-functional teams to deliver impactful solutions.

**Experience:**
*   **Program Manager, EduTech Global**
    *   Managed large-scale educational technology projects, ensuring on-time and on-budget delivery for a portfolio of 5 projects with a combined budget of $2M. Implemented agile methodologies, improving project completion rates by 25%.
    *   *Relevant Tags:* Program Management, Project Management, Agile Leadership, Education, EdTech
*   **Senior Product Manager, InnovateX Solutions**
    *   Led cross-functional teams (5 engineers, 2 designers) to develop and launch new SaaS products in the fintech space. Increased user engagement by 20% and revenue by 15% within 6 months. Defined product strategy, managed roadmap, and oversaw entire product lifecycle.
    *   *Relevant Tags:* Product Management, Team Leadership, SaaS Product Development, Fintech, SaaS

**Skills:** Program Management, Project Management, Agile Leadership, Education, EdTech, Product Management, Team Leadership, SaaS Product Development, Fintech, SaaS, project planning, stakeholder management, risk mitigation, cross-functional collaboration.
`,
    simulatedCoverLetterContent: `
Dear Hiring Manager,

I am writing to express my enthusiastic interest in the Program Manager position at Google, as advertised on LinkedIn. With a proven track record in managing large-scale educational technology projects, ensuring on-time and on-budget delivery for a portfolio of 5 projects with a combined budget of $2M. Implemented agile methodologies, improving project completion rates by 25%., I am confident in my ability to contribute significantly to your team.

During my tenure as a Program Manager at EduTech Global, I successfully led the development and launch of several products within the Education sector. My responsibilities included defining product strategy, managing the entire product lifecycle, and collaborating closely with engineering, design, and marketing teams to ensure successful market entry and adoption. For example, I spearheaded a project that resulted in a 20% increase in user engagement and a 15% growth in revenue for the division.

I am particularly drawn to Google's innovative approach to project management and believe my expertise in project planning aligns perfectly with the requirements of this role. My ability to translate complex business requirements into actionable product roadmaps and drive cross-functional teams to achieve ambitious goals would be a valuable asset.

Thank you for your time and consideration. I have attached my resume for your review and welcome the opportunity to discuss how my skills and experience align with your needs in more detail.

Sincerely,
John Doe
`,
  },
];

// --- Mock AI Suggestions ---
export const mockAiSuggestions: SimulatedChange[] = [
  { id: "ai_quantify", description: "Quantify achievements with specific numbers (e.g., 'increased revenue by 15%')." },
  { id: "ai_verbs", description: "Use stronger action verbs (e.g., 'spearheaded' instead of 'was responsible for')." },
  { id: "ai_summary", description: "Tailor your summary to directly address the job description's key requirements." },
  { id: "ai_accomplishments", description: "Add a section for 'Key Accomplishments' at the top." },
  { id: "ai_keywords", description: "Integrate more keywords from the job description naturally." },
];

// --- Mock Master Resume Update Changes (for Version Management) ---
export const simulatedMasterChanges: SimulatedChange[] = [
  { id: "exp_update", description: "Updated description for 'Senior Product Manager' role at InnovateX (e.g., added new metrics)." },
  { id: "skills_update", description: "Added new skill 'AI Prompt Engineering' and removed 'Legacy System Integration'." },
  { id: "contact_update", description: "Revised email address from old@example.com to new@example.com." },
  { id: "edu_update", description: "Updated graduation date for MBA." },
];

// --- Mock Version Specific Changes (for Version Management) ---
export const simulatedVersionChanges: SimulatedChange[] = [
  { id: "bullet_adjust", description: "Adjusted bullet points for 'Program Manager' role." },
  { id: "cert_add", description: "Added a new certification: 'Advanced Project Management'." },
];

// --- Mock Templates (for Application Material Generator) ---
export const mockTemplates = [
  { id: "simple", name: "Simple", description: "A clean and straightforward design.", isPro: false },
  { id: "modern", name: "Modern", description: "Contemporary layout with a touch of flair.", isPro: false },
  { id: "professional", name: "Professional", description: "Classic and elegant for formal applications.", isPro: false },
  { id: "creative", name: "Creative", description: "Unique design to stand out.", isPro: true },
  { id: "minimalist", name: "Minimalist", description: "Focus on content with minimal distractions.", isPro: true },
  { id: "executive", name: "Executive", description: "Sophisticated design for senior roles.", isPro: true },
];