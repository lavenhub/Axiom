import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { prisma } from "../config/prisma.js";
import { logger } from "../config/logger.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "axiom-secret-key-123";

// ─────────────────────────────────────────
// POST /api/auth/register
// Creates the very first ADMIN user
// ─────────────────────────────────────────
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, password, role } = req.body;

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing)
        return res.status(409).json({ error: "Email already registered." });

      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          role: role || "ADMIN",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: null,
          cityId: null,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      logger.info(`User registered: ${email} (${user.role})`);
      res.status(201).json({ user, token });
    } catch (error: any) {
      logger.error("Registration failed:", error);
      res.status(500).json({ error: "Registration failed", details: error.message });
    }
  }
);

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email, deletedAt: null },
        include: { organization: true, city: true },
      });

      if (!user)
        return res.status(401).json({ error: "Invalid email or password." });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.status(401).json({ error: "Invalid email or password." });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          organizationId: user.organizationId,
          cityId: user.cityId,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      logger.info(`User logged in: ${email}`);
      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          organization: user.organization,
          city: user.city,
        },
        token,
      });
    } catch (error: any) {
      logger.error("Login failed:", error);
      res.status(500).json({ error: "Login failed", details: error.message });
    }
  }
);

export { router as authRoutes };
