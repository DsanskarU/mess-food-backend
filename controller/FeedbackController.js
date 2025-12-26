const db = require('../config/db');

//STUDENT SUBMIT FEEDBACK WITH RATING AND COMMENTS

exports.addFeedback = (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const { food_id, rating, comment, meal_time } = req.body;

    if (!food_id || !rating || !meal_time) {
        return res.status(400).json({
            message: "food_id, rating and meal_time are required"
        });
    }

    if (!["BREAKFAST", "LUNCH", "DINNER"].includes(meal_time)) {
        return res.status(400).json({ message: "Invalid meal_time" });
    }

    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Check prepared_food table instead of food_items
    db.query(
        `SELECT pf.id AS prepared_id, pf.food_id, fi.name 
         FROM prepared_food pf
         JOIN food_items fi ON pf.food_id = fi.id
         WHERE pf.id = ?`,
        [food_id],
        (err, prepared) => {
            if (err) return res.status(500).json({ message: "DB error", error: err });

            if (prepared.length === 0) {
                return res.status(404).json({ message: "Prepared food not found" });
            }

            db.query(
                `INSERT INTO feedback (user_id, food_id, rating, comment, meal_time)
                 VALUES (?, ?, ?, ?, ?)`,
                [userId, prepared[0].food_id, rating, comment || null, meal_time],
                (err, result) => {
                    if (err) {
                        if (err.code === "ER_DUP_ENTRY") {
                            return res.status(400).json({
                                message: "You already submitted feedback for this meal today"
                            });
                        }
                        return res.status(500).json({ message: "DB error", error: err });
                    }

                    res.status(201).json({
                        message: "Feedback submitted successfully",
                        feedback_id: result.insertId
                    });
                }
            );
        }
    );
};




//CHEF VIEWS TODAYS FEEDBACK

exports.getTodayFeedback = (req, res) => {
    db.query(
        `SELECT 
            fi.name AS food_name,
            f.meal_time,
            AVG(f.rating) AS avg_rating,
            COUNT(f.id) AS total_feedback,
            fi.category,
            fi.is_veg
        FROM feedback f
        JOIN food_items fi ON f.food_id = fi.id
        WHERE f.feedback_date = CURRENT_DATE
        GROUP BY fi.id, f.meal_time
        ORDER BY f.meal_time, avg_rating DESC`,
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "DB error", error: err });
            }
            res.json(result);
        }
    );
};


//CHEF views detailed feedback for a food (optional)
exports.getFoodFeedback = (req, res) => {
    const { food_id } = req.params;

    db.query(
        `SELECT 
            u.name AS student_name,
            f.meal_time,
            f.rating,
            f.comment,
            f.feedback_date
        FROM feedback f
        JOIN users u ON f.user_id = u.id
        WHERE f.food_id = ?
        ORDER BY f.feedback_date DESC`,
        [food_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "DB error", error: err });
            }
            res.json(result);
        }
    );
};
