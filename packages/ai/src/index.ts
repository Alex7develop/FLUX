export interface AIProcessor {
  analyzeText(input: string): Promise<unknown>;
  analyzeImage(input: unknown): Promise<unknown>;
  analyzeDocument(input: unknown): Promise<unknown>;
  analyzeUrl(input: string): Promise<unknown>;
}
