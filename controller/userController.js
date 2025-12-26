const db = require('../config/db');

//GET all users

exports.getAllUsers = (req,res) => {
    db.query("select id,name,email,role, is_active, created_at from users where role = 'STUDENT'",(err,result) => {
        if(err){
            return res.status(500).json({ message: "Database error", error: err });
        }else{
            res.json(result);
        }
    })
}

//GET FIND BY ID

exports.getUserById = (req,res) =>{
    const {id} = req.params;
    db.query("select id, name, email, role, is_active, created_at from users where id = ?",[id],
        (err,result) => {
            if(err) {
                return res.status(500).json({ message: "Database error", error: err });
            }

            if(result.length === 0){
                return res.status(404).json({ message: "User not found" });
            }

            res.json(result[0]);
        }
    );
}

//UPDATE USER AND FIND IT BY ID
exports.updateUser = (req,res) => {
    const{id} = req.params;
    const{name,email}=req.body;
    
    const field =[];
    const values = [];

    if(name !== undefined){
        field.push("name = ?");
        values.push(name);
    }
    if(email !== undefined){
        field.push("email = ?");
        values.push(email);
    }

    if(field.length === 0){
       return res.status(400).json({ message: "Nothing to update" });
    }

    values.push(id)

    db.query(`update users set ${field.join(",")} where id = ?`,values,
        (err,result) => {
            if(err) return res.status(500).json({ message: "Database error", error: err });

            if(result.affectedRows === 0){
                return res.status(404).json({ message: "User not found" });
            }

            res.json({ message:"User Updated Successfully"});
        }
    )
}

//DELETE USER BY FINDING ID
exports.deleteUser = (req,res) => {
    const{id} = req.params;
    db.query("delete from users where id = ?",[id],
        (err,result) => {
            if(err){
                return res.status(500).json({ message: "Database error", error: err });
            }
            if(result.affectedRows === 0){
                return res.status(404).json({ message: "User not found" });
            }
            res.json({message:"User deleted Successfully"});
        }
    )
}