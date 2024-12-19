
import express, { Request, Response} from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import {connectDB} from './DAL/mongoConnect';
import analysis from './routers/analysisRouter';
import relationships from './routers/relationshipsRouter';
const PORT = process.env.PORT

export const app = express();
export const server = http.createServer(app);

app.use(cors());
app.use(express.json());
connectDB().then(() => console.log('db connected')).catch((err) => console.log(err));
app.get('/ping', (req: Request, res: Response) => {
    res.status(200).send('pong')
})

app.use('/api/analysis', analysis);
app.use('/api/relationships', relationships);

export const io = new Server(server,{ cors: { origin: "*" } });
io.on('connection', (socket) => {
    console.log('socket: a user connected');
    
    socket.on('disconnect', () => {
        console.log('socket: a user disconnected');
    });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT},visit http://localhost:${PORT}`));