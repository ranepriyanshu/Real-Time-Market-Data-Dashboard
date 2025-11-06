import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT tokens in Authorization header.
 * Example header: Authorization: Bearer <token>
 */
export function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded info to request object for later use
    req.user = {
      id: decoded.sub,
      username: decoded.username,
    };

    next(); // continue to route handler
  } catch (err) {
    console.error("JWT Verification Failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
