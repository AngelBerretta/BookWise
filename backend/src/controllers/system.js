import { runReseed } from "../services/scheduler.service.js";
import catchAsync    from "../utils/catchAsync.js";

// POST /api/system/reseed
const triggerReseed = catchAsync(async (req, res) => {
  console.log("🌐 Reseed disparado vía HTTP (trigger externo)");
  try {
    await runReseed();
    return res.status(200).json({ ok: true, message: "Reseed completado" });
  } catch (err) {
    // No relanzamos como ApiError acá: preferimos que el cron externo
    // (GitHub Actions) vea un 500 con el mensaje real para poder
    // diagnosticar sin tener que entrar a los logs de Render.
    return res.status(500).json({ ok: false, message: "Reseed falló", error: err.message });
  }
});

export { triggerReseed };
