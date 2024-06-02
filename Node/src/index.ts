import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';
import axios from "axios";


dotenv.config();
const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:8000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.get("/", (request: Request, response: Response) => { 
  io.emit('updateItems', { 
    items: ['item1', 'item2', 'item3']
   });
  response.status(200).send("Hello World");
}); 

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.post("/webhook", async (req: Request, res: Response) => {
  try {
    console.log('Received notification', req.body);
    const updatedItems = await axios.get('http://localhost:8000/items');
    io.emit('updateItems', updatedItems.data);
    res.status(200).send('Notification received');
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

server.listen(4000, () => {
  console.log('Node server running on port 4000');
});
