import { v2 as cloudinary } from "cloudinary";
import config from "../../config.js";

const isCloudinaryConfigured =
  config.cloudinary.cloudName &&
  config.cloudinary.apiKey &&
  config.cloudinary.apiSecret;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key:    config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure:     true,
  });
  console.log("☁️  Cloudinary configurado correctamente");
} else {
  console.log("⚠️   Cloudinary no configurado - la carga de imágenes fallará");
}

export { cloudinary, isCloudinaryConfigured };

/**
+ * Elimina una imagen de Cloudinary por su public_id.
+ * No lanza si falla — un error de limpieza no debe romper el flujo principal
+ * (crear/editar/borrar producto o post).
+ */
const deleteImage = async (publicId) => {
  if (!publicId || !isCloudinaryConfigured) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("[cloudinary] Error al eliminar imagen:", err.message);
  }
};

export { deleteImage };