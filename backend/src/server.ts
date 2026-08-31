import 'dotenv/config';
import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db';
import { globalErrorHandler } from './middlewares/globalErorrHandler.middleware';
import { redis } from './lib/redis';
import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import chatRouter from './routes/chat.routes';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}))

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);

app.use(globalErrorHandler);

const port = process.env.PORT || 7006;
const startServer = async () => {
  try {
    await connectDB();  
    await redis.connect(); // connect redis
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } 
  catch (error) {
    console.log("Error starting server: ", error);
    process.exit(1);
  }
}

startServer();