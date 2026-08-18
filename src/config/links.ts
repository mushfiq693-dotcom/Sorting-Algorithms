/**
 * External Links & Integrations Configuration
 *
 * Update these URLs with your official Google Form links for Beta feedback
 * and bug reports.
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
};
