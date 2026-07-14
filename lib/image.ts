// Compresión de imágenes en el navegador antes de subirlas. Así una foto de
// móvil (varios MB) baja a ~0,5 MB y no choca con los límites de subida
// (Server Actions de Next 1 MB, Vercel 4,5 MB, PHP/nginx de la API).

interface CompressOptions {
  /** Lado mayor máximo en px (no amplía). */
  maxSize?: number;
  /** Calidad JPEG 0–1 (se ignora si se conserva PNG). */
  quality?: number;
  /**
   * Conservar la transparencia (para logos): un PNG se recomprime como PNG en
   * vez de aplanarse a JPEG con fondo blanco. Las fotos no lo necesitan.
   */
  preserveAlpha?: boolean;
}

/**
 * Redimensiona (lado mayor <= maxSize) y recomprime la imagen.
 * - Fotos: se exportan a JPEG (fondo blanco si tenían transparencia).
 * - Logos (preserveAlpha): un PNG se mantiene PNG para no perder la transparencia.
 * - SVG y tipos no rasterizables se devuelven tal cual.
 * - Si el resultado no es más pequeño que el original, se queda el original.
 */
export async function compressImage(file: File, { maxSize = 1600, quality = 0.82, preserveAlpha = false }: CompressOptions = {}): Promise<File> {
  // Solo comprimimos rasterizados. SVG y otros se dejan igual.
  if (!/^image\/(png|jpe?g|webp)$/i.test(file.type)) {
    return file;
  }

  const dataUrl = await readAsDataURL(file);
  const img = await loadImage(dataUrl);

  // Escala para que el lado mayor no pase de maxSize (nunca amplía).
  const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return file; // sin canvas disponible, subimos el original
  }

  // Un PNG con preserveAlpha se mantiene PNG (transparencia intacta). En otro
  // caso vamos a JPEG y rellenamos de blanco para que la transparencia no
  // acabe en negro.
  const keepAlpha = preserveAlpha && /png/i.test(file.type);
  const outputType = keepAlpha ? "image/png" : "image/jpeg";
  if (!keepAlpha) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, outputType, quality));
  if (!blob || blob.size >= file.size) {
    return file; // no hemos mejorado nada, nos quedamos con el original
  }

  const name = file.name.replace(/\.\w+$/, "") + (keepAlpha ? ".png" : ".jpg");
  return new File([blob], name, { type: outputType });
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar la imagen."));
    img.src = src;
  });
}
