const authService = require("../services/authService");

class AuthController {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const result = await authService.login(email, password);
      res.json({
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      res.status(401).json({ error: error.message || "Authentication failed" });
    }
  }

  async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(401).json({ error: "No token provided" });
      }

      const decoded = await authService.verifyToken(token);
      res.json({ valid: true, user: decoded });
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  }
}

module.exports = new AuthController();
