import React from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface Props {
  show?: boolean;
  onCloseModal: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
  style: React.CSSProperties;
  closeButton?: boolean;
}

const Menu: React.FC<Props> = ({ show, children, style, closeButton, onCloseModal }) => {
  const stopPropagation = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (!show) {
    return null;
  }

  return (
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
