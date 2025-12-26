const Sentiment = require("sentiment");
const sentiment = new Sentiment();

/**
 * Analyze one feedback
 */
function analyzeFeedback(rating, comment) {
  const text = comment || "";
  const sentimentResult = sentiment.analyze(text);

  let finalLabel = "NEUTRAL";

  // Rating based decision
  if (rating >= 4) finalLabel = "LIKE";
  else if (rating <= 2) finalLabel = "DISLIKE";

  // Comment sentiment adjustment
  if (sentimentResult.score > 1) finalLabel = "LIKE";
  else if (sentimentResult.score < -1) finalLabel = "DISLIKE";

  return {
    sentiment_score: sentimentResult.score,
    result: finalLabel
  };
}

module.exports = { analyzeFeedback };
