require('dotenv').config();
const express = require('express');
const { StatusCodes } = require('http-status-codes');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;

const { conenctDB } = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const galleryRoutes = require('./routes/galleryCardRoutes');


conenctDB();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const app = express();


app.use(express.json());


app.use(cors({
    origin: '*'
}));


app.get('/', (req, res) => {
    res.status(StatusCodes.OK).json({
        success: true,
        message: 'server is up and running successfully'
    });
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/gallery-card', galleryRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server listening on PORT ${PORT}`);
});