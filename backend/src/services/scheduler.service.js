import cron from "node-cron";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendRoot = join(__dirname, "../..");

/**
 * Corre `npm run seed:all` y devuelve una promesa con el resultado.
 *
 * La usa tanto el cron interno (node-cron, más abajo — best-effort, solo
 * corre si el proceso está despierto justo a las 4 AM) como el endpoint
 * POST /api/system/reseed (pensado para ser llamado por un cron EXTERNO,
 * ver system.router.js — es el disparador confiable de verdad en el plan
 * free de Render, donde el proceso se duerme por inactividad y node-cron
 * solo no alcanza).
 */
const runReseed = () =>
  new Promise((resolve, reject) => {
    console.log("⏰ Ejecutando reseed...");
    exec("npm run seed:all", { cwd: backendRoot, timeout: 60_000 }, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Error en reseed:", error.message);
        return reject(error);
      }
      console.log(stdout);
      if (stderr) console.error(stderr);
      console.log("✅ Reseed completado");
      resolve({ stdout, stderr });
    });
  });

/**
 * Programa un reseed automático del catálogo/blog/cuentas demo.
 * best-effort: en el plan free de Render el proceso se duerme por
 * inactividad, así que esto solo dispara si el server está despierto en
 * el instante exacto de las 4 AM. No confiar en esto como único mecanismo
 * — ver /api/system/reseed para el disparador externo confiable.
 */
const startScheduledReseed = () => {
  cron.schedule("0 4 * * *", () => {
    runReseed().catch(() => {
      // Ya se loguea adentro de runReseed — acá solo evitamos un
      // unhandled rejection si el cron interno corre sin nadie esperando.
    });
  });
  console.log("⏰ Reseed automático programado (diario 04:00, best-effort)");
};

export { startScheduledReseed, runReseed };
