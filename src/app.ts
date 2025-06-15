import express from "express";
import { createServer } from "http";
import "dotenv/config";
import cors from "cors";
import { dbConection } from "./config/dbcontection";
import fs from 'fs';

import { router } from "./routes";
import path from "path";

import { initSocketio } from "./utils/initSocket";

const PORT = Number(process.env.PORT) || 3001;

const app = express();
const server = createServer(app);

// create temp folder
const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir);
}

// Middleware  'public'
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ruta '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
  }));
app.use(express.json());
app.use(router);

initSocketio(server);

dbConection().then(()=>console.log('BD Conectada al Server Transportia😎'));
server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server escuchando en puerto ${PORT}`));
