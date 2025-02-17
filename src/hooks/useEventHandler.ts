import { useCallback } from "react";

export const useOnKeyDown = <T>(callback: (param?: T) => void) => {
  return useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        callback();
      }
    },
    [callback]
  );
};
