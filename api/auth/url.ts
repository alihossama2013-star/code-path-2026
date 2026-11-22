import type { ApiRequest, ApiResponse } from '../../server/lib/http.js';
import { handleAuthUrl } from '../../server/lib/handlers.js';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  await handleAuthUrl(req, res);
}
