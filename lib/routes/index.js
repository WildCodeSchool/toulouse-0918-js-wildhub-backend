const express = require('express');
const projectsRouter = require('./projects');
const usersRouter = require('./users');
const githubAuthRouter = require('./githubAuth');

const apiRouter = express.Router();

apiRouter.use('/projects', projectsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/github', githubAuthRouter);

module.exports = apiRouter;
