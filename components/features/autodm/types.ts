export type AutomationStatsDTO = {
  totalDmsSent: number;
  totalFollowersGained: number;
  activeAutomationsCount: number;
};

export type AutomationCardDTO = {
  id: string;
  thumbnailUrl: string;
  caption: string;
  username: string;
  triggerKeyword: string[];
  isActive: boolean;
  mediaType?: string;
  followersGained: number;
  dmsSent: number;
};

export type CarouselElement = {
  id: string;
  imageUrl: string;
  imageFile: File | null;
  title: string;
  subtitle: string;
  buttons: Array<{ type: "web_url" | "postback"; title: string; url: string; payload: string }>;
};

export const defaultFormData = {
  mediaId: "",
  triggerKeywords: [] as string[],
  keywordInput: "",
  
  replyPublicly: true,
  commentText: "Thanks for commenting! Check your DMs 🚀",
  
  templateType: "TEXT_BUTTON" as "TEXT_BUTTON" | "BANNER_BUTTON",
  
  // Array of elements for the Generic Template Carousel
  elements: [
    {
      id: "elem_1",
      imageUrl: "",
      imageFile: null,
      title: "",
      subtitle: "",
      buttons: [
        { type: "web_url" as const, title: "Visit Link", url: "", payload: "" },
      ],
    }
  ] as CarouselElement[],

  openingMessage: {
    text: "Hey! Here is the link you asked for 👇",
    button: { text: "Get Access", url: "" },
  },

  requireFollow: false,
  askFollowMessage: {
    text: "Before I send the link, please follow our page! It helps us a lot. 🙏",
    buttons: [{ text: "I Followed!", url: "" }],
  },

  finalGoalMessage: {
    text: "Awesome, thanks for following! Here is your exclusive content.",
    buttons: [{ text: "Download Guide", url: "" }],
  },
};

export type FormData = typeof defaultFormData;
