import React, { DragEvent, useEffect, useRef, useState } from 'react';
import { Container, DragOver, Header } from './styels';
import ChatList from '@components/ChatList';
import ChatBox from '@components/ChatBox';
import { useInput } from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import makeSection from '@utils/makeSection';
import gravatar from 'gravatar';
import useSocket from '@hooks/useSocket';
import useSWR, { mutate } from 'swr';
import Scrollbars from 'react-custom-scrollbars-2';
import fetcher from '@utils/fetcher';
import useSWRInfinite from 'swr/infinite';
import { IChannel, IChat, IUser } from '@typings/db';
import InviteChannelModal from '@components/inviteChannelModal';

const Channel = () => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [socket] = useSocket(workspace);
  const scrollbarRef = useRef<Scrollbars>(null);
  const { data: myData } = useSWR('/api/users', fetcher);
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const [chat, onChangeChat, setChat] = useInput('');
  const {
    data: chatData,
    mutate: mutateChat,
    setSize,
  } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );

  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
    fetcher,
  );

  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (chat?.trim() && chatData && channelData) {
      mutateChat((prevChatData) => {
        const savedChat = chat;
        prevChatData?.[0].unshift({
          id: (chatData[0][0]?.id || 0) + 1,
          content: savedChat,
          UserId: myData.id,
          User: myData,
          ChannelId: channelData.id,
          Channel: channelData,
          createdAt: new Date(),
        });
        return prevChatData;
      }, false).then(() => {
        localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
        setChat('');
        scrollbarRef.current?.scrollToBottom();
      });
      axios
        .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
          content: chat,
        })
        .then(() => {
          mutateChat();
        })
        .catch(console.error);
    }
  };

  const onMessage = (data: IChat) => {
    if (data.Channel.name === channel && (data.content.startsWith('uploads\\') || myData.id !== data.UserId)) {
      mutateChat((chatData) => {
        chatData?.[0].unshift(data);
        return chatData;
      }).then(() => {
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
          ) {
            scrollbarRef.current.scrollToBottom();
          }
        }
      });
    }
  };

  const onClickInviteChannel = () => {
    setShowInviteChannelModal(true);
  };

  const onCloseModal = () => {
    setShowInviteChannelModal(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const formData = new FormData();
    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        if (e.dataTransfer.items[i].kind === 'file') {
          const file = e.dataTransfer.items[i].getAsFile();

          if (file) formData.append('image', file);
        }
      }
    } else {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        formData.append('image', e.dataTransfer.files[i]);
      }
    }

    axios.post(`/api/workspaces/${workspace}/channels/${channel}/images`, formData).then(() => {
      setDragOver(false);
      localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
      mutateChat();
    });
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  useEffect(() => {
    if (chatData?.length === 1) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  useEffect(() => {
    socket?.on('message', onMessage);
    return () => {
      socket?.off('message', onMessage);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(`${workspace}-${channel}`, new Date().getTime().toString());
  }, [workspace, channel]);

  if (!myData) return null;

  const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

  return (
    <Container onDrop={onDrop} onDragOver={onDragOver}>
      <Header>
        <span>{channel}</span>
        <div className="header-right">
          <span>{channelMembersData?.length}</span>
          <button
            onClick={onClickInviteChannel}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            add
            {/* <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" /> */}
          </button>
        </div>
      </Header>
      <ChatList chatSections={chatSections} ref={scrollbarRef} setSize={setSize} isReachingEnd={isReachingEnd} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
      {dragOver && <DragOver>업로드 !</DragOver>}
      <InviteChannelModal
        show={showInviteChannelModal}
        onCloseModal={onCloseModal}
        setShowInviteChannelModal={setShowInviteChannelModal}
      />
    </Container>
  );
};

export default Channel;
