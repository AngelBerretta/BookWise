import streamifier from "streamifier";
import { cloudinary, isCloudinaryConfigured } from "../services/cloudinary.service.js";
import catchAsync from "../utils/catchAsync.js";
import ApiError    from "../utils/ApiError.js";

const FOLDER_BY_TYPE = {
  product: "bookwise/products",
  post:    "bookwise/blog",
};

// Ancho/alto máximo del ORIGINAL guardado (evita archivos innecesariamente pesados)
const MAX_DIMENSION = 1600;

// ── POST /api/uploads/image ───────────────────────────────────────────────────

const uploadImage = catchAsync(async (req, res) => {
  if (!isCloudinaryConfigured) {
    throw new ApiError(503, "Cloudinary no está configurado en el servidor.");
  }

  if (!req.file) {
    throw new ApiError(400, "No se recibió ningún archivo.");
  }

  const { type = "product" } = req.body;
  const folder = FOLDER_BY_TYPE[type] ?? FOLDER_BY_TYPE.product;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { width: MAX_DIMENSION, height: MAX_DIMENSION, crop: "limit" },
        ],
      },
      (error, uploaded) => (error ? reject(error) : resolve(uploaded))
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });

  // URL de ENTREGA: formato (webp/avif) y calidad automáticos según el
  // navegador que la pida. Esto es lo que se guarda en la DB.
  const optimizedUrl = cloudinary.url(result.public_id, {
    secure:       true,
    quality:      "auto",
    fetch_format: "auto",
  });

  return res.status(201).json({
    status:   "success",
    url:      optimizedUrl,
    publicId: result.public_id,
  });
});

export { uploadImage };