import React, { VFC, useEffect, useRef } from 'react';
import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from './styles';
import autosize from 'autosize';
import { Mention, OnChangeHandlerFunc, SuggestionDataItem } from 'react-mentions';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { IUser, IUserWithOnline } from '@typings/db';
import fetcher from '@utils/fetcher';
import gravatar from 'gravatar';

interface Props {
  chat: string;
  onSubmitForm: (e: React.FormEvent<any>) => void;
  onChangeChat: (e: any) => void;
  placeholder?: string;
}

const ChatBox: VFC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder }) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: userData, error, mutate } = useSWR<IUser | false>('/api/users', fetcher);

  const { data: memberData } = useSWR<IUserWithOnline[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );
  const textareaRef = useRef(null);
  const onKeydownChat = (e: React.KeyboardEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault();
        onSubmitForm(e);
      }
    }
  };

  const renderSuggestion = (
    suggestion: SuggestionDataItem,
    search: string,
    highlightedDisplay: React.ReactNode,
    index: number,
    focus: boolean,
  ): React.ReactNode => {
    if (!memberData) return;
    return (
      <EachMention focus={focus}>
        <img src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })} alt={memberData[index].nickname} />
        <span>{highlightedDisplay}</span>
      </EachMention>
    );
  };

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);
  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyDown={onKeydownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          forceSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--size_small c-wysiwyg_container__button c-wysiwyg_container__button--send c-wysiwyg_container__button--disabled c-button--disabled c-icon_button--default' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            send
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
