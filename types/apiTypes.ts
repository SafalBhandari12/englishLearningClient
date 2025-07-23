// Type definitions for API responses

export type UserInfoResponse = {
  success: boolean;
  message: string;
  user?: {
    email: string;
    name: string;
    emailVerified: boolean;
    role: string;
    candidate: {
      context: string;
      accuracyScore: number;
      pronounciationScore: number;
      fluencyScore: number;
      completenessScore: number;
      nextQuestion: string;
    } | null;
  };
};

export type sendAnswerApiResponse = {
  success: boolean;
  url: string;
  recognizedText: string;
  assessment: Assessment;
};

export type Assessment = {
  recognizedText: string;
  accuracyScore: number;
  pronunciationScore: number;
  fluencyScore: number;
  completenessScore: number;
};

export type ChatHistoryItemSchema = {
  bot: string;
  createdAt: string;
  user: string;
  userAudio: string;
  id: string;
};

export type GetChatHistoryResponseSchema = {
  success: boolean;
  data: ChatHistoryItemSchema[];
  nextCursor: string | null;
};
