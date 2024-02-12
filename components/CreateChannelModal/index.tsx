import Modal from '@components/Modal';
import { useInput } from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import React from 'react';

interface Props {
  show: boolean;
  onCloseModal: () => void;
}

const CreateChannelModal: React.VFC<Props> = ({ show, onCloseModal }) => {
  const [newChannel, onNewChannel] = useInput('');
  const onCreateChannel = () => {};

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
