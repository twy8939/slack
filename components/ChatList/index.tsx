import React, { VFC, useRef } from 'react';
import { ChatZone, Section } from './styles';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';
import Scrollbars from 'react-custom-scrollbars-2';

interface Props {
  chatData?: IDM[];
}

const ChatList: VFC<Props> = ({ chatData }) => {
  const scrollbarRef = useRef(null);
  const onScroll = () => {};

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {chatData?.map((chat) => (
          <Chat key={chat.id} data={chat} />
        ))}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
