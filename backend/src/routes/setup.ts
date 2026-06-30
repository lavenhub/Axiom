import express from "express";
import { body, validationResult } from "express-validator";
import { prisma } from "../config/prisma.js";
import { authenticateToken, AuthRequest } from "../middlewares/auth.js";
import { logger } from "../config/logger.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ─────────────────────────────────────────
// POST /api/setup/organization
// Create the organization for the admin
// ─────────────────────────────────────────
router.post(
  "/organization",
  authenticateToken,
  [body("name").notEmpty().withMessage("Organization name is required")],
  async (req: AuthRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name } = req.body;

      const org = await prisma.organization.create({ data: { name } });

      // Link admin user to org
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { organizationId: org.id },
      });

      logger.info(`Organization created: ${org.name}`);
      res.status(201).json(org);
    } catch (error: any) {
      logger.error("Failed to create organization:", error);
      res.status(500).json({ error: "Failed to create organization", details: error.message });
    }
  }
);

// ─────────────────────────────────────────
// GET /api/setup/organizations
// ─────────────────────────────────────────
router.get("/organizations", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  const orgs = await prisma.organization.findMany({ include: { cities: true } });
  res.json(orgs);
});

// ─────────────────────────────────────────
// POST /api/setup/city
// ─────────────────────────────────────────
router.post(
  "/city",
  authenticateToken,
  [
    body("name").notEmpty().withMessage("City name is required"),
    body("organizationId").notEmpty().withMessage("Organization ID is required"),
  ],
  async (req: AuthRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, organizationId } = req.body;

      const city = await prisma.city.create({ data: { name, organizationId } });

      // Link admin user to city
      await prisma.user.update({
        where: { id: req.user!.id },
        data: { cityId: city.id },
      });

      logger.info(`City created: ${city.name}`);
      res.status(201).json(city);
    } catch (error: any) {
      logger.error("Failed to create city:", error);
      res.status(500).json({ error: "Failed to create city", details: error.message });
    }
  }
);

// ─────────────────────────────────────────
// GET /api/setup/cities
// ─────────────────────────────────────────
router.get("/cities", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  const cities = await prisma.city.findMany({ include: { organization: true, departments: true, wards: true } });
  res.json(cities);
});

// ─────────────────────────────────────────
// POST /api/setup/department
// ─────────────────────────────────────────
router.post(
  "/department",
  authenticateToken,
  [
    body("name").notEmpty().withMessage("Department name is required"),
    body("cityId").notEmpty().withMessage("City ID is required"),
  ],
  async (req: AuthRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, description, cityId } = req.body;

      const dept = await prisma.department.create({ data: { name, description, cityId } });

      logger.info(`Department created: ${dept.name}`);
      res.status(201).json(dept);
    } catch (error: any) {
      logger.error("Failed to create department:", error);
      res.status(500).json({ error: "Failed to create department", details: error.message });
    }
  }
);

// ─────────────────────────────────────────
// GET /api/setup/departments?cityId=
// ─────────────────────────────────────────
router.get("/departments", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  const { cityId } = req.query;
  const where = cityId ? { cityId: cityId as string } : {};
  const depts = await prisma.department.findMany({ where, include: { users: { select: { id: true, name: true, email: true, role: true } } } });
  res.json(depts);
});

// ─────────────────────────────────────────
// POST /api/setup/ward
// ─────────────────────────────────────────
router.post(
  "/ward",
  authenticateToken,
  [
    body("name").notEmpty().withMessage("Ward name is required"),
    body("number").isInt().withMessage("Ward number must be an integer"),
    body("cityId").notEmpty().withMessage("City ID is required"),
  ],
  async (req: AuthRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, number, cityId, boundary } = req.body;

      const ward = await prisma.ward.create({
        data: { name, number: parseInt(number), cityId, boundary },
      });

      logger.info(`Ward created: ${ward.name}`);
      res.status(201).json(ward);
    } catch (error: any) {
      logger.error("Failed to create ward:", error);
      res.status(500).json({ error: "Failed to create ward", details: error.message });
    }
  }
);

// ─────────────────────────────────────────
// GET /api/setup/wards?cityId=
// ─────────────────────────────────────────
router.get("/wards", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  const { cityId } = req.query;
  const where = cityId ? { cityId: cityId as string } : {};
  const wards = await prisma.ward.findMany({ where, include: { _count: { select: { issues: true, memories: true } } } });
  res.json(wards);
});

// ─────────────────────────────────────────
// POST /api/setup/engineer
// Add engineer user to a department
// ─────────────────────────────────────────
router.post(
  "/engineer",
  authenticateToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("departmentId").notEmpty().withMessage("Department ID is required"),
    body("cityId").notEmpty().withMessage("City ID is required"),
  ],
  async (req: AuthRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name, email, departmentId, cityId, organizationId } = req.body;
      const defaultPassword = await bcrypt.hash("Engineer@123", 12);

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing)
        return res.status(409).json({ error: "Email already registered." });

      const engineer = await prisma.user.create({
        data: {
          name,
          email,
          password: defaultPassword,
          role: "ENGINEER",
          departmentId,
          cityId,
          organizationId,
        },
        select: { id: true, name: true, email: true, role: true, department: true },
      });

      logger.info(`Engineer added: ${email}`);
      res.status(201).json({ ...engineer, defaultPassword: "Engineer@123" });
    } catch (error: any) {
      logger.error("Failed to add engineer:", error);
      res.status(500).json({ error: "Failed to add engineer", details: error.message });
    }
  }
);

// ─────────────────────────────────────────
// GET /api/setup/engineers
// ─────────────────────────────────────────
router.get("/engineers", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  const { cityId } = req.query;
  const where: any = { role: "ENGINEER", deletedAt: null };
  if (cityId) where.cityId = cityId as string;
  const engineers = await prisma.user.findMany({
    where,
    select: { id: true, name: true, email: true, role: true, department: { select: { id: true, name: true } } },
  });
  res.json(engineers);
});

// ─────────────────────────────────────────
// POST /api/setup/infrastructure-type
// ─────────────────────────────────────────
router.post(
  "/infrastructure-type",
  authenticateToken,
  [body("name").notEmpty()],
  async (req: AuthRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, description, icon } = req.body;
      const type = await prisma.infrastructureType.create({ data: { name, description, icon } });
      res.status(201).json(type);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to create infrastructure type", details: error.message });
    }
  }
);

// ─────────────────────────────────────────
// GET /api/setup/infrastructure-types
// ─────────────────────────────────────────
router.get("/infrastructure-types", authenticateToken, async (_req, res) => {
  const types = await prisma.infrastructureType.findMany({ where: { deletedAt: null } });
  res.json(types);
});

// ─────────────────────────────────────────
// POST /api/setup/infrastructure-asset
// ─────────────────────────────────────────
router.post(
  "/infrastructure-asset",
  authenticateToken,
  [
    body("name").notEmpty(),
    body("typeId").notEmpty(),
    body("wardId").notEmpty(),
  ],
  async (req: AuthRequest, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name, description, typeId, wardId, latitude, longitude, address, age, material } = req.body;

      // Create location first
      const location = await prisma.location.create({
        data: {
          latitude: parseFloat(latitude) || 0,
          longitude: parseFloat(longitude) || 0,
          address,
          wardId,
        },
      });

      const asset = await prisma.infrastructureAsset.create({
        data: {
          name,
          description,
          typeId,
          locationId: location.id,
          age: age ? parseInt(age) : null,
          material,
        },
        include: { type: true, location: { include: { ward: true } } },
      });

      logger.info(`Infrastructure asset created: ${asset.name}`);
      res.status(201).json(asset);
    } catch (error: any) {
      logger.error("Failed to create asset:", error);
      res.status(500).json({ error: "Failed to create infrastructure asset", details: error.message });
    }
  }
);

// ─────────────────────────────────────────
// GET /api/setup/infrastructure-assets
// ─────────────────────────────────────────
router.get("/infrastructure-assets", authenticateToken, async (req: AuthRequest, res: express.Response) => {
  const assets = await prisma.infrastructureAsset.findMany({
    where: { deletedAt: null },
    include: {
      type: true,
      location: { include: { ward: true } },
      _count: { select: { issues: true, memories: true } },
    },
  });
  res.json(assets);
});

export { router as setupRoutes };
