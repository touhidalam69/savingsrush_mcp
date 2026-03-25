import { CacheService } from '../services/cacheService';
import { ApiClient } from '../services/apiClient';
import { Logger } from '../utils/logger';
import { formatSuccess, formatError } from '../utils/responseFormatter';

export interface ToolExecutionOptions<TRaw, TTransformed> {
  name: string;
  cacheKey: string;
  apiCall: () => Promise<TRaw>;
  transform: (data: TRaw) => TTransformed;
}

export const executeTool = async <TRaw, TTransformed>(
  options: ToolExecutionOptions<TRaw, TTransformed>
) => {
  const cache = CacheService.getInstance();
  const { name, cacheKey, apiCall, transform } = options;

  try {
    // 1. Check Cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      Logger.info(`[${name}] Cache HIT: ${cacheKey}`);
      return formatSuccess(cachedData, true);
    }

    // 2. Call API
    Logger.info(`[${name}] API Call: ${cacheKey}`);
    const rawData = await apiCall();

    // 3. Transform
    const transformedData = transform(rawData);

    // 4. Cache
    cache.set(cacheKey, transformedData);

    // 5. Return
    return formatSuccess(transformedData, false);
  } catch (error: any) {
    Logger.error(`[${name}] Error: ${error.message}`);
    return formatError(`Error executing tool ${name}: ${error.message}`, error);
  }
};
