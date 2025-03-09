// src/utils/apiUtils.js

/**
 * Converts an object's keys from snake_case to camelCase
 */
export const snakeToCamel = (str) => str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

/**
 * Recursively transforms an API response from snake_case to camelCase
 */
export const transformApiResponse = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => transformApiResponse(item));
  }
  
  if (data !== null && typeof data === 'object') {
    return Object.keys(data).reduce((result, key) => {
      const camelKey = snakeToCamel(key);
      result[camelKey] = transformApiResponse(data[key]);
      return result;
    }, {});
  }
  
  return data;
};