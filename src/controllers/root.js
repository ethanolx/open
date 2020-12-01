import express from 'express';

const router = express.Router();

router.all('/', (req, res) => {
    res.send(':)');
});

export default router;