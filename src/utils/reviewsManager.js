// src/utils/reviewsManager.js
import staticData from "../data/googleReviews.json";
import { GOOGLE_CONFIG } from "../data/config";

const REVIEWS_STORAGE_KEY = "tse_custom_review_replies";

/**
 * Returns recorded replies from localStorage
 */
function getStoredReplies() {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(REVIEWS_STORAGE_KEY) : null;
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Saves a review reply to local storage
 */
export function recordReviewReply(reviewId, replyText) {
  try {
    const replies = getStoredReplies();
    replies[reviewId] = {
      reply: replyText,
      repliedAt: new Date().toISOString(),
    };
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(replies));
      window.dispatchEvent(new Event("tse_reviews_updated"));
    }
  } catch {}
}

/**
 * Retrieves all Google reviews merged with any local manager replies
 */
export function getGoogleReviews() {
  const localReplies = getStoredReplies();
  const reviews = staticData.reviews.map((r) => {
    if (localReplies[r.id]) {
      return {
        ...r,
        reply: localReplies[r.id].reply,
        status: "replied",
        repliedAt: localReplies[r.id].repliedAt,
      };
    }
    return { ...r };
  });

  return {
    ...staticData,
    reviews,
  };
}

/**
 * AI Reply Generator: Produces 3 tailored, on-brand responses for a given customer review.
 */
export function generateAiReviewReplies(review) {
  const author = review.authorName ? review.authorName.split(" ")[0] : "there";
  const dishes = review.tags && review.tags.length > 0 ? review.tags.join(" and ") : "your meal";
  const venue = "The Sixth Element";

  return [
    {
      id: "gracious",
      title: "Warm & Gracious",
      badge: "Hospitality Focus",
      text: `Dear ${author}, thank you so much for your kind words! We're thrilled that you enjoyed ${dishes} during your visit. Crafting a welcoming, mindful atmosphere in East Sheen is at the heart of everything we do. We look forward to welcoming you back to ${venue} very soon! Warmest regards, The Sixth Element Team`,
    },
    {
      id: "founders",
      title: "Founder-Led",
      badge: "From Pooja & Deepak",
      text: `Hi ${author}, thank you from the bottom of our hearts for this lovely review. Reading how much you enjoyed ${dishes} truly brightens our day! We poured our passion into building ${venue} as a neighbourhood sanctuary, and knowing it resonated with you means everything. Looking forward to your next visit! — Warmly, Pooja, Deepak & the Sixth Element family`,
    },
    {
      id: "crisp",
      title: "Crisp & Professional",
      badge: "Concise",
      text: `Thank you for dining with us and sharing your 5-star review, ${author}! Delighted you enjoyed the ${dishes} and our service. We truly appreciate your support of our independent venue and look forward to seeing you again soon.`,
    },
  ];
}
