import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();


const DEMO_USER = {
  id: "u_demo_1",
  username: "demo",
  
  password: "password"
};
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }


  if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign(
    {
      sub: DEMO_USER.id,           
      username: DEMO_USER.username
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" } 
  );

  return res.json({ token });
});

export default router;
