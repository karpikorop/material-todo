const CHUNK_SIZE = 50;

export function makeChunks<T>(arr: T[], chunkSize = CHUNK_SIZE): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}
