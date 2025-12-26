const db = require('../config/db');

//CHEF : ADD DAILY MENU
exports.addMenu = (req, res) => {
    const { food_id } = req.body;
    const chef_id = req.user.id; 

    if (!food_id) {
        return res.status(400).json({ message: "food_id is required" });
    }

    // Prevent duplicate menu for today
    db.query(
        "SELECT id FROM daily_menu WHERE food_id = ? AND menu_date = CURRENT_DATE",
        [food_id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ message: "DB ERROR", error: err });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Menu already exists for today"
                });
            }

            // Insert menu (menu_date auto, created_by manual)
            db.query(
                "INSERT INTO daily_menu (food_id, created_by) VALUES (?, ?)",
                [food_id, chef_id],
                (err) => {
                    if (err) {
                        return res.status(500).json({ message: "DB ERROR", error: err });
                    }

                    res.status(201).json({
                        message: "Daily menu added successfully"
                    });
                }
            );
        }
    );
};

//GET TODAYS MENU (ANY USER)
exports.getTodayMenu = (req, res) => {
    const today = new Date().toISOString().slice(0, 10);

    db.query(
        `select dm.id AS menu_id, fi.id AS food_id, fi.name AS food_name, fi.category, fi.is_veg, u.name AS chef_name
        from daily_menu dm 
        join food_items fi on dm.food_id = fi.id
        join users u on dm.created_by  = u.id
        where dm.menu_date = ? `, [today],
        (err, result) => {
            if (err) return res.status(500).json({ message: "DataBASE ERROR", error: err });

            res.json(result);
        }
    )
}

//GET MENU BY DATE 
exports.getMenuByDate = (req, res) => {
    const { date } = req.params;

    db.query(
        `select dm.id AS menu_id, fi.id AS food_id, fi.name AS food_name, fi.category, fi.is_veg, u.name AS chef_name
         from daily_menu dm
         JOIN food_items fi ON dm.food_id = fi.id
         JOIN users u ON dm.created_by = u.id
         WHERE dm.menu_date = ?
        `,[date],
        (err,result) => {
            if (err) return res.status(500).json({ message: "Database error", error: err });
            res.json(result);
        }
    )
}