import {PORT} from './src/config/ServerConfig.js';
import propertiesRoutes from './api/routes/properties.js'
import userRoutes from './api/routes/user.js'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// File Structure
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
const app = express();
app.use(cors({
  origin: ['http://localhost:5005', 'https://zillowguess.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static Files
console.log(path.join(__dirname, '../build'))
app.use(express.static(path.join(__dirname, '../build')));

// Routes -- Using Vercel serverless functions

// Listen
app.listen(process.env.PORT || PORT, () => {
    console.log("Express started on http://localhost:"+PORT+"; press Ctrl-C to terminate.");
});