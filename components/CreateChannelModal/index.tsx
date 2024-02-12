import Modal from '@components/Modal';
import { useInput } from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { SetStateAction } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowCreateChannelModal: React.Dispatch<SetStateAction<boolean>>;
}

const CreateChannelModal: React.VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
  const [newChannel, onNewChannel, setNewChannel] = useInput('');
  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate } = useSWR<IChannel[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

  const onCreateChannel = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(
        `/api/workspaces/${workspace}/channels`,
        {
          name: newChannel,
        },
        {
          withCredentials: true,
        },
      )
      .then(() => {
        setShowCreateChannelModal(false);
        mutate();
        setNewChannel('');
      })
      .catch((error) => {
        console.dir(error);
      });
  };

  if (!show) return null;

  return (
    <Modal show={show} onCloseModal={onCloseModal}>
      <form onSubmit={onCreateChannel}>
        <Label id="workspace-label">
          <span>채널 이름</span>
          <Input id="workspace" value={newChannel} onChange={onNewChannel} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
};

export default CreateChannelModal;
