import { useState, createContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Error, Loading } from './components';

export const AppContext = createContext<{ patch: string }>({ patch: '9.11' });

export const AppProvider = (props: any) => {
  const { data, isLoading, isError } = useQuery<{ patch: string }>(
    'patch',
    getPatches
  );

  if (isLoading) return <Loading></Loading>;
  if (isError) return <Error></Error>;
  if (data)
    return (
      <AppContext.Provider value={{ patch: data.patch }}>
        {props.children}
      </AppContext.Provider>
    );
};

const getPatches = () => {
  return fetch('get_patches').then((res) => res.json());
};
