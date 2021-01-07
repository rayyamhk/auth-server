const express = require('express');
const cors = require('cors')
const app = express();
const dotenv = require('dotenv');
const { logger } = require('./src/utils');
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  authenticate,
  authorize,
  logout,
  recovery,
} = require('./src/routes');
const { secureAccess, ipService } = require('./src/middlewares');

const PORT = process.env.PORT || 8080;
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(ipService());

app.get('/users', secureAccess, getUsers);
app.get('/user', secureAccess, getUser);
app.post('/user', createUser);
app.delete('/user', secureAccess, deleteUser);
app.put('/user', secureAccess, updateUser);
app.post('/authenticate', authenticate);
app.post('/authorize', authorize);
app.post('/logout', logout);
app.post('/recovery', recovery);

app.listen(PORT, () => {
  logger.log(`Server is listening to port ${PORT}...`);
});
