const db = require("../config/db")

//CHEF ADD PREPARED FOOD FOR TODAY

exports.addPreparedFood = (req, res) => {
    const { food_id, quantity } = req.body;
     //console.log("REQ BODY:", req.body); 

    if (!food_id) {
        return res.status(400).json({ message: "food_id is required" });
    }

    db.query("insert into prepared_food (food_id,quantity) values (?,?)", [food_id, quantity || 1],
        (err) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({
                        message: "Food already marked as prepared today"
                    });
                }
                return res.status(500).json({ message: "DB error", error: err });
            }

            res.status(201).json({
                message: "Prepared food added successfully"
            });
        }
    )
}

//STUDENT+CHEF VIEW TODAYS PREPARED FOOD
exports.getTodayPreparedFood = (req,res) => {
    db.query(`select pf.id,fi.name as food_name,fi.is_veg as is_veg,fi.category as category, pf.quantity,pf.prepared_date
        from prepared_food pf
        join food_items fi on pf.food_id = fi.id
        where pf.prepared_date = current_date
        `,
        (err,result) => {
            if(err){
                 return res.status(500).json({ message: "DB error", error: err });
            }
            res.json(result);
        }
        )

}

exports.undoPreparedFood = (req, res) => {
    const { food_id } = req.params;

    if (!food_id) {
        return res.status(400).json({ message: "food_id is required" });
    }

    db.query(
        `DELETE FROM prepared_food 
         WHERE food_id = ? 
         AND prepared_date = CURRENT_DATE`,
        [food_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "DB error",
                    error: err
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Prepared food not found for today"
                });
            }

            res.json({
                message: "Prepared food removed successfully"
            });
        }
    );
};