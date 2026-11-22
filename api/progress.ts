import type { ApiRequest, ApiResponse } from '../server/lib/http.js';
import { handleProgress } from '../server/lib/handlers.js';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  await handleProgress(req, res);
}
