export const sessionStorageHelper = {
  get: <T>(param: string): T | null => {
    const sessionStorageItems = sessionStorage.getItem(param);
    if (!sessionStorageItems) return null;
    const parsedItems = JSON.parse(sessionStorageItems);
    return parsedItems;
  },
  set: (param: string, item: any): void => {
    sessionStorage.setItem(param, JSON.stringify(item));
  },
};
