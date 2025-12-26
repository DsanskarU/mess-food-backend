const db = require("../config/db");
const { analyzeFeedback } = require("../analysis/feedbackAnalysis");

// Analyze today's feedback
exports.analyzeTodayFeedback = (req, res) => {
  db.query(
    `SELECT f.id, f.rating, f.comment, f.meal_time, fi.name AS food_name , fi.is_veg AS is_veg
     FROM feedback f
     JOIN food_items fi ON f.food_id = fi.id
     WHERE f.feedback_date = CURRENT_DATE`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      const analyzed = results.map(row => {
        const analysis = analyzeFeedback(row.rating, row.comment);

        return {
          food_name: row.food_name,
          meal_time: row.meal_time,
          is_veg : row.is_veg,
          rating: row.rating,
          comment: row.comment,
          sentiment: analysis.result,
          sentiment_score: analysis.sentiment_score
        };
      });

      res.json(analyzed);
    }
  );
};
