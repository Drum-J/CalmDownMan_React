import { useEffect } from 'react';


const usePreventLeave = (message: string) => {
  const listener = (event: BeforeUnloadEvent) => {
    event.preventDefault();
    event.returnValue = message;
  };

  const enablePrevent = () => {
    window.addEventListener('beforeunload', listener);
  };

  const disablePrevent = () => {
    window.removeEventListener('beforeunload', listener);
  };

  useEffect(() => {
    return () => {
      disablePrevent();
    };
  }, []);

  return { enablePrevent, disablePrevent };
};

export default usePreventLeave;
