import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import axios from "axios";


dotenv.config();
const PYTHON_API_URL = process.env.PYTHON_URL

const app = express();
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on('connection', async (socket) => {
  try {
    const response = await axios.get(`${PYTHON_API_URL}/items`);
    socket.emit('updateItems', response.data);
  } catch (error) {
    console.error('Error fetching items on new connection:', error);
  }

  socket.on('newItem', async (data) => {
    await axios.post(`${PYTHON_API_URL}/items`, data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get("/items", async (req: Request, res: Response) => {
  const items = await axios.get(`${PYTHON_API_URL}/items`);
  res.status(200).send(items.data);
});

app.post("/notify", async (req: Request, res: Response) => {
  try {
    console.log('Received notification', req.body);
    const items = await axios.get(`${PYTHON_API_URL}/items`);
    io.emit('updateItems', items.data);
    res.status(200).send(items.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

server.listen(4000, () => {
  console.log('Node server running on port 4000');
});
