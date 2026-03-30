import { CacheService } from '../services/cacheService';
import { Logger } from '../utils/logger';
import { formatSuccess, formatError, ErrorResponse, SuccessResponse, getErrorMessage } from '../utils/responseFormatter';

export interface ToolExecutionOptions<TRaw, TTransformed> {
  name: string;
  cacheKey: string;
  apiCall: () => Promise<TRaw>;
  transform: (data: TRaw) => TTransformed;
}

export const executeTool = async <TRaw, TTransformed>(
  options: ToolExecutionOptions<TRaw, TTransformed>
): Promise<SuccessResponse<TTransformed> | ErrorResponse> => {
  const cache = CacheService.getInstance();
  const { name, cacheKey, apiCall, transform } = options;

  try {
    // 1. Check Cache
    const cachedData = cache.get<TTransformed>(cacheKey);
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
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    Logger.error(`[${name}] Error: ${message}`);
    return formatError(`Error executing tool ${name}: ${message}`, error);
  }
};
