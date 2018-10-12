const express = require('express');
const projectsRouter = require('./projects');
const githubAuthRouter = require('./githubAuth');

const apiRouter = express.Router();

// you can nest routers by attaching them as middleware:
apiRouter.use('/projects', projectsRouter);
apiRouter.use('/github', githubAuthRouter);

module.exports = apiRouter;
