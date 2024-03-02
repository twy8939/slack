import React, { forwardRef } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import { IDM } from '@typings/db';
import Chat from '@components/Chat';
import Scrollbars, { positionValues } from 'react-custom-scrollbars-2';

interface Props {
  chatSections: { [KEY: string]: IDM[] };
  setSize: (f: (indeX: number) => number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isEmpty, isReachingEnd }, ref) => {
  const onScroll = (values: positionValues) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      console.log('위');
      setSize((prevSize) => prevSize + 1).then(() => {
        // 스크롤 위치 유지
      });
    }
  };

  return (
    <ChatZone>
      <Scrollbars autoHide ref={ref} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => (
          <Section className={`section-${date}`} key={date}>
            <StickyHeader>
              <button>{date}</button>
            </StickyHeader>
            {chats.map((chat) => (
              <Chat key={chat.id} data={chat} />
            ))}
          </Section>
        ))}
      </Scrollbars>
    </ChatZone>
  );
});

export default ChatList;
