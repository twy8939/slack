import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react';

type ReturnTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

export const useInput = <T>(initalData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initalData);
  const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value as unknown as T);
  }, []);
  return [value, handler, setValue];
};
