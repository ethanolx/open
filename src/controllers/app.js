import express from 'express';

// routes
import root from './root.js';
import users from './users.js';
import posts from './posts.js';
import others from './others.js';

const app = express();

// register routes
app
    .use('/', root)
    .use('/', users)
    .use('/', posts)
    .use('/', others);

export default app;