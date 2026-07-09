import cron from "node-cron";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendRoot = join(__dirname, "../..");

const runReseed = () => {
  console.log("⏰ Ejecutando reseed programado...");
  exec("npm run seed:all", { cwd: backendRoot }, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Error en reseed programado:", error.message);
      return;
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
    console.log("✅ Reseed programado completado");
  });
};

/**
 * Programa un reseed automático del catálogo/blog/cuentas demo.
 */
const startScheduledReseed = () => {
  // Todos los días a las 4:00 AM (hora del servidor)
  cron.schedule("0 4 * * *", runReseed);
  console.log("⏰ Reseed automático programado (diario 04:00)");
};

export { startScheduledReseed };