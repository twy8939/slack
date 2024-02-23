import io from 'socket.io-client';

const backUrl = 'http://localhost:3095';

const sockets: { [KEY: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string) => {
  const disconnect = () => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  };

  if (!workspace) {
    return [undefined, disconnect];
  }

  sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`);

  return [sockets[workspace], disconnect];
};

export default useSocket;
