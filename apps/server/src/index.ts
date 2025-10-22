import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import matchRoutes from './routes/matches.js';

const app = express();
app.use(cors());
app.use(express.json());

// routes
authRoutes(app);
matchRoutes(app);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));