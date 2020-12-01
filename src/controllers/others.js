import express from 'express';

const router = express.Router();

router.all('*', (req, res) => {
    res.redirect('/');
});

export default router;