export const localStorageHelper = {
  get: <T>(param: string): T | null => {
    const localStoredItems = localStorage.getItem(param);
    if (!localStoredItems) return null;
    const parsedItems = JSON.parse(localStoredItems);
    return parsedItems;
  },
  set: (param: string, item: any): void => {
    localStorage.setItem(param, JSON.stringify(item));
  },
  remove: (param: string): void => {
    localStorage.removeItem(param);
  },
};
