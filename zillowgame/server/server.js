import {PORT} from '../ServerConfig.mjs';
import routes from './routes/routes.js'
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Middleware
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use(routes);

// Listen
app.listen(PORT, () => {
    console.log("Express started on http://localhost:"+PORT+"; press Ctrl-C to terminate.");
});