import {io} from '../app'
io.on('connection', (socket) => {
    console.log('socket: a user connected');
    
    socket.on('disconnect', () => {
        console.log('socket: a user disconnected');
    });
});