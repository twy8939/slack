import React, { MutableRefObject, forwardRef } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import { IChat, IDM } from '@typings/db';
import Chat from '@components/Chat';
import Scrollbars, { positionValues } from 'react-custom-scrollbars-2';

interface Props {
  chatSections: { [KEY: string]: (IDM | IChat)[] };
  setSize: (f: (indeX: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
  isReachingEnd: boolean;
}

const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isReachingEnd }, ref) => {
  const onScroll = (values: positionValues) => {
    const current = (ref as MutableRefObject<Scrollbars>)?.current;
    if (values.scrollTop === 0 && !isReachingEnd) {
      setSize((prevSize) => prevSize + 1).then(() => {
        // 스크롤 위치 유지
        if (current) {
          current.scrollTop(1);
        }
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
