const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//SIGNUP? REGISTER
exports.signUp = (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    //check if user exists
    db.query("select id from users where email = ?", [email],
        async (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                return res.status(400).json({ message: "User Already exists" });
            }

            //hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            db.query("insert into users (name,email,password,role) values (?,?,?,'STUDENT')", [name, email, hashedPassword],
                (err) => {
                    if (err) {
                        return res.status(500).send(err);
                    }

                    res.status(201).json({ message: "User registered successfully" });
                }
            )
        }
    )
}

//LOGIN OR SIGNIN
exports.login = (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Request body missing" });
    }
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    db.query("select * from users where email = ?", [email],
        async (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            if (result.length === 0) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const user = result[0];
            // console.log("INPUT PASSWORD:", password);
            // console.log("DB HASH:", user.password);
            const isMatch = await bcrypt.compare(password, user.password);
            // console.log("MATCH:", isMatch);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const token = jwt.sign(
                { id: user.id, email: user.email,role:user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            )

            res.json(
                {
                    message: "Login Successfully",
                    token
                }
            )
        }
    )
}