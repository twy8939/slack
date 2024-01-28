import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type ReturnTypes<T = any> = [T, (e: any) => void, Dispatch<SetStateAction<T>>];

export const useInput = <T>(initalData: T): ReturnTypes => {
  const [value, setValue] = useState(initalData);
  const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);
  return [value, handler, setValue];
};
