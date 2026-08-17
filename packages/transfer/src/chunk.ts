export function splitBytes(bytes: ArrayBuffer, chunkSize: number): ArrayBuffer[] {
  const source = new Uint8Array(bytes);
  if (source.byteLength === 0) {
    return [new ArrayBuffer(0)];
  }

  const chunks: ArrayBuffer[] = [];
  for (let offset = 0; offset < source.byteLength; offset += chunkSize) {
    chunks.push(source.slice(offset, offset + chunkSize).buffer);
  }
  return chunks;
}

export function assembleChunks(chunks: ArrayBuffer[]): ArrayBuffer {
  const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  }
  return output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength);
}
