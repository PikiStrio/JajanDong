import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import authRoute from './routes/auth.route';
import menuRoute from './routes/menu.route';
import orderRoute from './routes/order.route';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const PORT = process.env.PORT || 3000;
// app.get('/', (req: express.Request, res: express.Response) => {
//   res.send('Hello, World!');
// });

app.use("/api/auth", authRoute);
app.use("/api/menu", menuRoute);
app.use("/api/order", orderRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


