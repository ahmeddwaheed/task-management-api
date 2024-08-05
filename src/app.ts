import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './utils/errorHandler';

const app: Express = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
// handle missing routes
app.use((req, res) => {
  res.status(404).send({
    message: 'Request Not Found',
  });
});

app.use(errorHandler);
app.use(express.json());

export default app;