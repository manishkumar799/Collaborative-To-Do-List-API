const socketIO = require('socket.io');

let io;

function init(server) {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('taskUpdated', (taskId) => {
      console.log(`Task ${taskId} updated`);
      // Notify the connected users about the task update
      io.emit('taskUpdated', taskId);
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
}

module.exports = {
  init,
  getIo,
};
