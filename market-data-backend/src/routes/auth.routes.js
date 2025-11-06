import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

// For the assignment, we hardcode a single user.
// In a real app, you'd verify from DB + hashed passwords.
const DEMO_USER = {
  id: "u_demo_1",
  username: "demo",
  // NEVER store plaintext in real life; this is ONLY per assignment.
  password: "password"
};

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "username and password are required" });
  }

  // Hardcoded credential check (assignment requirement)
  if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Create JWT
  const token = jwt.sign(
    {
      sub: DEMO_USER.id,           // subject (user id)
      username: DEMO_USER.username // helpful claim for debugging
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" } // short-lived access token
  );

  return res.json({ token });
});

export default router;
