// app/index.ts
import express, { Express, Request, Response } from 'express';
import { connectDatabase } from '@/utils/config/database';
import postRoutes from '@/app/api/posts/route';

const app: Express = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Database Connection
connectDatabase();

// Routes
app.use('/api/posts', postRoutes);

// Default route for testing the server
app.get('/', (req: Request, res: Response) => {
  res.send('The API is working!');
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
