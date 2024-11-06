require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const authRoutes = require('./src/routes/authRoutes');
const cookieParser = require("cookie-parser");
const config = require('./src/db/config/database.json')['development']; // or 'test' or 'production'

const app = express();
const cors = require('cors');

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
});

sequelize.authenticate()
    .then(() => {
        console.log(`Koneksi ke database ${config.database} berhasil`);
    })
    .catch((error) => {
        console.error('Gagal terhubung ke database:', error);
    });

app.use((req, res, next) => {
    req.db = sequelize;
    next();
});

app.use('/api', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
