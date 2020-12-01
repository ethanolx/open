import app from './controllers/app.js';

const PORT = 3000;

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server started on port ${PORT}`);
});