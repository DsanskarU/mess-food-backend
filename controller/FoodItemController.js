const db = require('../config/db')
// CHEF:ADD FOOD ITEM
exports.addFoodItem = (req, res) => {
    const { name, category, is_veg } = req.body;

    if (!name || !category) {
        return res.status(400).json({ message: "Name and category are required" });
    }

    db.query("insert into food_items (name,category,is_veg) values (?,?,?)", [name, category, is_veg ?? true],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "DB ERROR", error: err });
            }
            res.status(200).json({
                message: "Food is added Successfully",
                foodItemId: result.insertId
            })
        }
    )
}

//CHEF,STUDENT GET ALL FOOD ITEMS

exports.getAllFoodItems = (req, res) => {
    db.query("select * from food_items",
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "DB ERROR", error: err });
            }

            res.json(result);
        }
    )
}

//CHEF,STUDENT GET FOOD ITEMS BY ID

exports.getFoodItemsById = (req, res) => {
    const { id } = req.params;

    db.query("select *  from food_items where id = ?", [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "DB ERROR", error: err });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: "Food item not found" });
            }

            res.json(result[0]);
        }
    )
}

// CHEF UPDATE THE FOOD_ITEMS
exports.updateFoodItems = (req, res) => {
    const { id } = req.params;
    const { name, category, is_veg } = req.body;

    const fields = [];
    const values = [];

    if (name !== undefined) {
        fields.push("name = ?");
        values.push(name);
    }

    if (category !== undefined) {
        fields.push("category = ?");
        values.push(category);
    }

    if (is_veg !== undefined) {
        fields.push("is_veg = ?");
        values.push(is_veg);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: "Nothing to update" });
    }

    const sql = `
    UPDATE food_items
    SET ${fields.join(", ")}
    WHERE id = ?
  `;

    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log("UPDATE SQL ERROR:", err);
            return res.status(500).json({ message: "DB ERROR", error: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Food item not found" });
        }

        res.json({ message: "Food item updated successfully" });
    });
};

exports.deleteFoodItem = (req, res) => {
    const { id } = req.params;
    db.query("delete from food_items where id = ?", [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "DB ERROR", error: err });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Food item not found" });
            }

            res.json({ message: "food item deleted successfully" });
        }
    )
}