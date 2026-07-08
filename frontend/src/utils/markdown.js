/**
 * Convierte contenido markdown a texto plano — para excerpts y previews
 * donde no queremos renderizar formato, solo mostrar el texto limpio.
 */
export const stripMarkdown = (content = '') => {
  return content
    .replace(/```[\s\S]*?```/g, ' ')           // bloques de código
    .replace(/`([^`]+)`/g, '$1')               // código inline
    .replace(/!\[.*?\]\(.*?\)/g, ' ')          // imágenes
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')     // links → solo el texto
    .replace(/^#{1,6}\s+/gm, '')               // headers
    .replace(/^>\s?/gm, '')                    // citas
    .replace(/^[-*+]\s+/gm, '')                // listas
    .replace(/^\d+\.\s+/gm, '')                // listas numeradas
    .replace(/(\*\*|__)(.*?)\1/g, '$2')        // negrita
    .replace(/(\*|_)(.*?)\1/g, '$2')           // cursiva
    .replace(/~~(.*?)~~/g, '$1')               // tachado
    .replace(/<[^>]*>/g, '')                   // HTML residual (compat posts viejos)
    .replace(/\s+/g, ' ')
    .trim();
};