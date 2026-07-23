import { Router } from "express";
import { reseedAuth }    from "../middlewares/reseedAuth.middleware.js";
import { triggerReseed } from "../controllers/system.js";

const router = Router();

// POST /api/system/reseed — dispara el reseed selectivo bajo demanda.
// Pensado para ser llamado por un cron EXTERNO (ver
// .github/workflows/reseed-cron.yml), porque node-cron corriendo dentro
// del proceso de Render no es confiable en el plan free: el server se
// duerme por inactividad y el cron interno solo dispara si el proceso
// está despierto justo a la hora programada.
router.post("/reseed", reseedAuth, triggerReseed);

export default router;
