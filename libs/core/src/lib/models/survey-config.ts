export interface SurveyQuestion {
  id: string;
  type: 'rating' | 'text' | 'multiple';
  title: string;
  skip: boolean;
  choices?: string[]; // Only for multiple-choice
}

export interface SurveyConfig {
  identifier: string; // Used as cookie key + sheet tab name
  title: string;
  questions: SurveyQuestion[];
  webhookUrl: string; // Google Apps Script endpoint
  extraParams?: Record<string, string>;
  feedbackUrl?: string; // Link to point users to advanced features
  expiresAt?: string; // Format: "DD/MM/YYYY"
}
