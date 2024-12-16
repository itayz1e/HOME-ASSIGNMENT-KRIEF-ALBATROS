const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

const upload = multer({ dest: path.join(__dirname, 'uploads') });

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'document_pipeline',
    password: 'Ah14432ewe',
    port: 5432,
});

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { originalname, filename } = req.file;
        const uploadTime = new Date();

        const result = await pool.query(
            `INSERT INTO documents (filename, original_name, upload_time, status)
             VALUES ($1, $2, $3, $4) RETURNING id`,
            [filename, originalname, uploadTime, 'uploaded']
        );

        res.json({ documentId: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error uploading file' });
    }
});

app.get('/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT 1 + 1 AS result');
        res.json({ health: 'ok', result: result.rows[0].result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

