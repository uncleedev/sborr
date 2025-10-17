export const isElectron = (): boolean => {
  return typeof window !== "undefined" && !!window.electronAPI;
};
