// src/utils/materialGenerators.ts

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  description: string;
  functionalRoles: string[];
  industryDomains: string[];
}

interface JobDescriptionInfo {
  roles: string[];
  domains: string[];
  keywords: string[];
}

export const mockResumeContent = (
  template: string,
  experienceEntries: ExperienceEntry[],
  jobDescriptionInfo: JobDescriptionInfo,
  appliedSuggestions: string[] = []
) => {
  const { roles, domains, keywords } = jobDescriptionInfo;

  // Generate experience section
  const experienceSection = experienceEntries.map(entry => `
*   **${entry.title}, ${entry.company}**
    *   ${entry.description}
    *   *Relevant Tags:* ${[...entry.functionalRoles, ...entry.industryDomains].join(", ")}
  `).join('\n');

  // Generate skills section
  const allFunctionalRoles = new Set<string>();
  const allIndustryDomains = new Set<string>();
  experienceEntries.forEach(entry => {
    entry.functionalRoles.forEach(role => allFunctionalRoles.add(role));
    entry.industryDomains.forEach(domain => allIndustryDomains.add(domain));
  });
  const combinedSkills = [...Array.from(allFunctionalRoles), ...Array.from(allIndustryDomains), ...keywords];
  const skillsSection = `**Skills:** ${[...new Set(combinedSkills)].join(", ")}.`;

  // Generate a dynamic tagline and summary based on job description info and master resume
  const primaryRole = roles.length > 0 ? roles[0] : "Experienced Professional";
  const primaryDomain = domains.length > 0 ? domains[0] : "Diverse Industries";
  const tagline = `Driving Results as a ${primaryRole} in ${primaryDomain}.`;
  const summary = `Highly accomplished ${primaryRole} with a proven track record in ${primaryDomain} and ${experienceEntries.length} key experiences. Specializing in ${keywords.slice(0, 3).join(", ")} and leading cross-functional teams to deliver impactful solutions.`;


  let baseContent = `
**[Your Name]**
[Your Contact Info]

**Tagline:** ${tagline}

**Role-Specific Summary:**
${summary}

**Experience:**
${experienceSection}

${skillsSection}
`;

  if (template === "creative") {
    baseContent = `
**[Your Name]** | [Your Contact Info]
*Innovative ${primaryRole} Leader*

**Summary:**
A visionary ${primaryRole} with a flair for creative problem-solving and a track record of launching impactful products in ${primaryDomain}. I thrive on transforming complex ideas into user-centric solutions.

**Key Projects:**
${experienceEntries.map(entry => `*   **${entry.company} - ${entry.title}:** ${entry.description}`).join('\n')}

**Expertise:** ${[...new Set([...Array.from(allFunctionalRoles), ...Array.from(allIndustryDomains), ...keywords])].join(", ")}.
`;
  } else if (template === "minimalist") {
    baseContent = `
**[Your Name]**
[Email] | [Phone] | [LinkedIn]

**Summary**
${primaryRole} leader with ${experienceEntries.length}+ key experiences in ${primaryDomain}. Drives product vision, execution, and growth.

**Experience**
${experienceEntries.map(entry => `**${entry.company}** | ${entry.title}
- ${entry.description}`).join('\n')}

**Skills**
${[...new Set(combinedSkills)].join(", ")}.
`;
  } else if (template === "executive") {
    baseContent = `
**[Your Name]**
[Your Professional Title] | [Your Contact Info]

---

**Executive Summary:**
A highly strategic and results-oriented executive with extensive experience in leading ${primaryRole} initiatives across complex global organizations. Proven expertise in driving digital transformation, fostering innovation, and achieving significant business growth in competitive ${primaryDomain} markets.

**Professional Experience:**
${experienceEntries.map(entry => `*   **${entry.title}, ${entry.company}**
    *   ${entry.description}`).join('\n')}

**Core Competencies:** Strategic Planning, P&L Management, Global Team Leadership, Digital Transformation, Market Expansion, Executive Communication, ${keywords.join(", ")}.
`;
  }

  // Append applied suggestions
  if (appliedSuggestions.length > 0) {
    baseContent += `\n\n--- Applied AI Enhancements ---\n`;
    appliedSuggestions.forEach(suggestion => {
      baseContent += `- ${suggestion}\n`;
    });
  }

  return baseContent.trim();
};

export const mockCoverLetterContent = (
  length: string,
  customQuestions: string,
  jobDescriptionInfo: JobDescriptionInfo,
  experienceEntries: ExperienceEntry[]
) => {
  const { roles, domains, keywords } = jobDescriptionInfo;
  const targetRole = roles.length > 0 ? roles[0] : "[Job Title]";
  const targetCompany = "[Company Name]"; // Placeholder for now
  const relevantExperienceSnippet = experienceEntries.length > 0 ? experienceEntries[0].description : "[relevant experience/skills]";
  const keywordSentence = keywords.length > 0 ? `I possess strong skills in ${keywords.slice(0, -1).join(", ")} and ${keywords[keywords.length - 1]}.` : "";

  let baseContent = `
Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${targetRole} position at ${targetCompany}, as advertised on [Platform]. With a proven track record in ${relevantExperienceSnippet}, I am confident in my ability to contribute significantly to your team.

My experience at [Previous Company] involved ${relevantExperienceSnippet}. ${keywordSentence} I am particularly drawn to ${targetCompany}'s mission/values/project because [specific reason].

Thank you for your time and consideration. I look forward to discussing how my skills and experience align with your needs.

Sincerely,
[Your Name]
`;

  if (length === "medium") {
    baseContent = `
Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${targetRole} position at ${targetCompany}, as advertised on [Platform]. With a proven track record in ${relevantExperienceSnippet}, I am confident in my ability to contribute significantly to your team.

During my tenure as a ${experienceEntries[0]?.title || "Professional"} at ${experienceEntries[0]?.company || "[Previous Company]"}, I successfully led the development and launch of several products within the ${domains[0] || "various"} sector. My responsibilities included defining product strategy, managing the entire product lifecycle, and collaborating closely with engineering, design, and marketing teams to ensure successful market entry and adoption. For example, I spearheaded a project that resulted in a 20% increase in user engagement and a 15% growth in revenue for the division.

I am particularly drawn to ${targetCompany}'s innovative approach to [specific area] and believe my expertise in ${keywords[0] || "[specific skill]"} aligns perfectly with the requirements of this role. My ability to translate complex business requirements into actionable product roadmaps and drive cross-functional teams to achieve ambitious goals would be a valuable asset.

Thank you for your time and consideration. I have attached my resume for your review and welcome the opportunity to discuss how my skills and experience align with your needs in more detail.

Sincerely,
[Your Name]
`;
  } else if (length === "long") {
    baseContent = `
Dear Hiring Manager,

I am writing to express my enthusiastic interest in the ${targetRole} position at ${targetCompany}, as advertised on [Platform]. With a proven track record in ${relevantExperienceSnippet}, I am confident in my ability to contribute significantly to your team.

My career has been defined by a passion for driving innovation and delivering tangible results, particularly within dynamic environments like the ${domains[0] || "various"} industries. As a ${experienceEntries[0]?.title || "Professional"} at ${experienceEntries[0]?.company || "[Previous Company]"}, I was instrumental in leading the end-to-end development and successful launch of multiple products. This involved comprehensive market research, competitive analysis, defining detailed product roadmaps, and overseeing execution with cross-functional teams comprising engineers, designers, and sales professionals. A notable achievement was leading a strategic initiative that not only enhanced product features but also resulted in a 20% increase in user adoption and a 15% year-over-year revenue growth for the division.

Prior to this, as a ${experienceEntries[1]?.title || "Manager"} at ${experienceEntries[1]?.company || "[Another Company]"}, I managed large-scale projects, consistently ensuring on-time and on-budget delivery while maintaining high-quality standards. My ability to manage complex projects, mitigate risks, and foster strong stakeholder relationships has been a consistent theme throughout my professional journey.

I am particularly drawn to ${targetCompany}'s commitment to [specific company value/project] and believe my expertise in ${keywords[0] || "[specific skill, e.g., agile methodologies, market expansion, strategic partnerships]"} aligns perfectly with the requirements of this role and your organizational goals. My approach to product development is deeply rooted in user-centric design and data-driven decision-making, which I understand are core tenets at ${targetCompany}.

Thank you for your time and consideration. I have attached my resume for your review and am eager to discuss how my skills and experience can directly benefit ${targetCompany} in achieving its objectives. I am available for an interview at your earliest convenience.

Sincerely,
[Your Name]
`;
  }

  if (customQuestions.trim()) {
    baseContent += `\n\nRegarding your custom questions: "${customQuestions.trim()}", I would address them by [simulated answer based on general experience].`;
  }

  return baseContent.trim();
};