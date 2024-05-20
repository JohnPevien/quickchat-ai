export const PAGE_TITLE = (process.env.PAGE_TITLE as string) || "Quikchat";
export const PAGE_DESCRIPTION = (process.env.PAGE_DESCRIPTION as string) || "";

export const SYSTEM_PROMPT =
  (process.env.DEFAULT_SYSTEM_PROMPT as string) ||
  "You are a helpful assistant that assist users by providing information, answering questions, generating text content, and offering support across a wide range of topics. Your goal is to be informative, helpful, and engaging, adapting to the user's needs and preferences.";
