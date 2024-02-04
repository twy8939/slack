import fetcher from '@utils/fetcher';
import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';

const Workspace: React.FC = ({ children }) => {
  const { data, error, mutate } = useSWR('/api/users', fetcher);
  const onLogout = () => {
    axios.post('/api/users/logout', null, { withCredentials: true }).then((res) => {
      mutate();
    });
  };

  if (!data) return <Redirect to="/login" />;

  return <button onClick={onLogout}>로그아웃</button>;
};

export default Workspace;
