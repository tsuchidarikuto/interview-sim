/**
 * キャメルケースをスネークケースに変換
 * @param str 変換対象の文字列
 * @returns スネークケースの文字列
 */
export const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * スネークケースをキャメルケースに変換
 * @param str 変換対象の文字列
 * @returns キャメルケースの文字列
 */
export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * オブジェクトのキーをスネークケースに変換
 * @param obj 変換対象のオブジェクト
 * @returns キーがスネークケースのオブジェクト
 */
export const convertKeysToSnakeCase = <T extends object>(obj: T): Record<string, unknown> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[toSnakeCase(key)] = value;
    return acc;
  }, {} as Record<string, unknown>);
};

/**
 * オブジェクトのキーをキャメルケースに変換
 * @param obj 変換対象のオブジェクト
 * @returns キーがキャメルケースのオブジェクト
 */
export const convertKeysToCamelCase = <T extends object>(obj: T): Record<string, unknown> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[toCamelCase(key)] = value;
    return acc;
  }, {} as Record<string, unknown>);
}; 