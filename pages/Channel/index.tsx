import React from 'react';
import { Container, Header } from './styels';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import { useInput } from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';

const Channel = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chat?.trim()) {
      axios
        .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
          content: chat,
        })
        .then(() => {
          setChat('');
        })
        .catch(console.error);
    }
  };
  return (
    <Container>
      <Header>채널</Header>
      {/* <ChatList /> */}
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
};

export default Channel;
