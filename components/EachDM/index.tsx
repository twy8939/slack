import { IChannel, IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import React, { useEffect } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import useSWR from 'swr';

const EachDM = ({ member, isOnline }: { member: IUserWithOnline; isOnline: boolean }) => {
  const { workspace } = useParams<{ workspace?: string }>();
  const location = useLocation();
  const { data: userData } = useSWR<IUser>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const date = localStorage.getItem(`${workspace}-${member.id}`) || 0;

  const { data: count, mutate } = useSWR<number>(
    userData ? `/api/workspaces/${workspace}/dms/${member.id}/unreads?after=${date}` : null,
    fetcher,
  );

  useEffect(() => {
    if (location.pathname === `/workspace/${workspace}/dm/${member.id}`) {
      mutate();
    }
  }, [mutate, location.pathname, workspace, member]);

  return (
    <NavLink key={member.id} activeClassName="selected" to={`/workspace/${workspace}/dm/${member.id}`}>
      <span
        style={{
          width: '5px',
          height: '5px',
          marginRight: '5px',
          backgroundColor: isOnline ? 'green' : 'red',
        }}
      />
      <span className={member.id === userData?.id ? 'bold' : ''}>{member.nickname}</span>
      {member.id === userData?.id && <span> (나)</span>}
      {count !== undefined && count > 0 && <span className="count">{count}</span>}
    </NavLink>
  );
};

export default EachDM;
