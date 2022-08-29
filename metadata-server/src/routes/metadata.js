import { Router } from "express";

import { MetadataController } from "../controllers/MetadataController";

const router = Router();

router.get("/monster", MetadataController.getApi);

export default router;
