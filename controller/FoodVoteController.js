const db = require('../config/db');
//STUDENTS VOTE FOR FOOD

exports.voteFood = (req, res) => {
    const user_Id = req.user.id;
    const { food_id } = req.body;

    if (!food_id) {
        return res.status(400).json({ message: "food_id is required" });
    }
    db.query("insert into food_votes (user_id,food_id) values (?,?)", [user_Id, food_id],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({
                        message: "You already voted today"
                    });
                }
                return res.status(500).json({ message: "DB error", error: err });
            }
            res.status(201).json({ message: "Vote submitted successfully" });
        }
    )
}

exports.getTodayVoteResults = (req,res) => {
    db.query(`select fi.id as food_id,fi.name as food_name,fi.is_veg as is_veg,fi.category as category ,count(fv.id) as total_votes
            from food_votes fv
            join food_items fi on fv.food_id = fi.id
            where fv.vote_date = CURRENT_DATE
            group by fi.id,fi.name
            order by total_votes desc`,
            (err,result) =>{
                if(err){
                    return res.status(500).json({ message: "DB error", error: err });
                }

                res.json(result);
            }
        )
}
exports.getMyTodayVotes = (req, res) => {
    const userId = req.user.id;

    db.query(
        `SELECT food_id 
         FROM food_votes 
         WHERE user_id = ? AND vote_date = CURRENT_DATE`,
        [userId],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "DB error",
                    error: err
                });
            }

            // return array of food_ids
            res.json(result.map(r => r.food_id));
        }
    );
};
