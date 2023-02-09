import * as http from 'http';
import app from './app.js';
import logger from './config/Logger.js';

const server = http.createServer(app);

const { API_PORT } = process.env;
const PORT = process.env.PORT || API_PORT;

server.listen(PORT, () => {
  logger.info(`Server Running on Port ${PORT}`);
});
