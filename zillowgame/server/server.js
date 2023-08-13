import {PORT} from '../client/src/config/ServerConfig.mjs';
import propertiesRoutes from './routes/properties.js'
import userRoutes from './routes/user.js'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Middleware
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use(propertiesRoutes);
app.use(userRoutes);

// Listen
app.listen(PORT, () => {
    console.log("Express started on http://localhost:"+PORT+"; press Ctrl-C to terminate.");
});