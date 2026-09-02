/**
 * External Links & Integrations Configuration
 *
 * Update these URLs with your official Google Form links for Beta feedback
 * and bug reports, as well as developer social links.
 */

export const LINKS = {
  // Official Google Form for Beta User Feedback
  GOOGLE_FEEDBACK_FORM_URL:
    process.env.NEXT_PUBLIC_GOOGLE_FEEDBACK_FORM_URL ||
    "https://forms.gle/dsa-algohub-beta-feedback",

  // Official Google Form for Algorithm Bug Reports
  GOOGLE_BUG_REPORT_FORM_URL:
    process.env.NEXT_PUBLIC_GOOGLE_BUG_REPORT_FORM_URL ||
    "https://forms.gle/dsa-algohub-bug-report",

  // Departmental Coordinator Contact
  DEPARTMENT_ADMIN_EMAIL: "mushfiq693@gmail.com",

  // Developer Profile & Socials
  DEVELOPER: {
    name: "Mushfiqur Rahman",
    role: "Full-stack Developer",
    bio: "Architected & developed with modern web standards by Mushfiq.",
    portfolioUrl:
      process.env.NEXT_PUBLIC_DEVELOPER_PORTFOLIO_URL ||
      "https://mushfiq.dev",
    githubUrl:
      process.env.NEXT_PUBLIC_DEVELOPER_GITHUB_URL ||
      "https://github.com/mushfiq693-dotcom",
    linkedinUrl:
      process.env.NEXT_PUBLIC_DEVELOPER_LINKEDIN_URL ||
      "https://www.linkedin.com/in/mushfique693",
  },
};
