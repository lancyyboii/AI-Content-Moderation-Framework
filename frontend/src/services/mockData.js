// Mock data for the AI Content Moderation Dashboard

export const mockModerationResults = [
  {
    id: "mod_001",
    content: "This is a great product! I love using it every day.",
    type: "text",
    status: "approved",
    confidence: 0.95,
    categories: [],
    flaggedReasons: [],
    timestamp: "2024-01-15T10:30:00Z",
    reviewer: "AI System"
  },
  {
    id: "mod_002",
    content: "I hate this stupid thing, it's complete garbage!",
    type: "text",
    status: "flagged",
    confidence: 0.82,
    categories: ["hate_speech", "toxicity"],
    flaggedReasons: ["Offensive language", "Negative sentiment"],
    timestamp: "2024-01-15T09:45:00Z",
    reviewer: "AI System"
  },
  {
    id: "mod_003",
    content: "image_vacation_beach.jpg",
    type: "image",
    status: "review",
    confidence: 0.67,
    categories: ["suggestive"],
    flaggedReasons: ["Potentially suggestive content detected"],
    timestamp: "2024-01-15T08:20:00Z",
    reviewer: "AI System"
  },
  {
    id: "mod_004",
    content: "Check out this amazing deal: www.example.com/offer",
    type: "text",
    status: "approved",
    confidence: 0.88,
    categories: [],
    flaggedReasons: [],
    timestamp: "2024-01-15T07:15:00Z",
    reviewer: "AI System"
  },
  {
    id: "mod_005",
    content: "promotional_video.mp4",
    type: "video",
    status: "flagged",
    confidence: 0.91,
    categories: ["spam", "promotional"],
    flaggedReasons: ["Excessive promotional content", "Spam indicators"],
    timestamp: "2024-01-14T16:30:00Z",
    reviewer: "AI System"
  }
];

export const mockStats = {
  totalModerated: 15847,
  approvedCount: 12456,
  flaggedCount: 2891,
  reviewCount: 500,
  todayProcessed: 234,
  accuracy: 94.2,
  avgProcessingTime: 0.8,
  categoryBreakdown: {
    hate_speech: 145,
    spam: 298,
    adult_content: 87,
    violence: 56,
    harassment: 123,
    misinformation: 78
  },
  dailyTrends: [
    { date: "2024-01-08", approved: 45, flagged: 12, review: 3 },
    { date: "2024-01-09", approved: 52, flagged: 18, review: 7 },
    { date: "2024-01-10", approved: 48, flagged: 15, review: 5 },
    { date: "2024-01-11", approved: 61, flagged: 22, review: 8 },
    { date: "2024-01-12", approved: 58, flagged: 19, review: 6 },
    { date: "2024-01-13", approved: 55, flagged: 16, review: 4 },
    { date: "2024-01-14", approved: 63, flagged: 25, review: 9 }
  ]
};

export const mockSettings = {
  sensitivity: {
    hate_speech: 0.75,
    spam: 0.80,
    adult_content: 0.85,
    violence: 0.90,
    harassment: 0.70,
    misinformation: 0.65
  },
  enabledCategories: {
    hate_speech: true,
    spam: true,
    adult_content: true,
    violence: true,
    harassment: true,
    misinformation: false
  },
  autoApprovalThreshold: 0.95,
  manualReviewThreshold: 0.70,
  notifications: {
    email: true,
    slack: false,
    webhook: true
  }
};

// Simulate API calls
export const simulateModeration = async (content, type) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const isOffensive = content.toLowerCase().includes('hate') || 
                    content.toLowerCase().includes('stupid') ||
                    content.toLowerCase().includes('spam');
  
  const confidence = Math.random() * 0.3 + (isOffensive ? 0.7 : 0.85);
  
  const result = {
    id: `mod_${Date.now()}`,
    content,
    type,
    status: confidence > 0.9 ? 'approved' : confidence > 0.7 ? 'review' : 'flagged',
    confidence: Math.round(confidence * 100) / 100,
    categories: isOffensive ? ['hate_speech', 'toxicity'] : [],
    flaggedReasons: isOffensive ? ['Potentially offensive language detected'] : [],
    timestamp: new Date().toISOString(),
    reviewer: 'AI System'
  };
  
  return result;
};