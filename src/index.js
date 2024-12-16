const express = require("express");
const multer = require("multer");
const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

const upload = multer({ dest: path.join(__dirname, "uploads") });

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "document_pipeline",
  password: "Ah14432ewe",
  port: 5432,
});


const createTablesIfNotExist = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS documents (
                id SERIAL PRIMARY KEY,
                filename TEXT NOT NULL,
                original_name TEXT NOT NULL,
                upload_time TIMESTAMP NOT NULL,
                status TEXT NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS processed_data (
                id SERIAL PRIMARY KEY,
                document_id INT REFERENCES documents(id) ON DELETE CASCADE,
                data JSONB NOT NULL
            );
        `);

        console.log('Tables are ready!');
    } catch (err) {
        console.error('Error creating tables:', err);
    }
};


createTablesIfNotExist();

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { originalname, filename } = req.file;
    const uploadTime = new Date();

    const result = await pool.query(
      `INSERT INTO documents (filename, original_name, upload_time, status)
             VALUES ($1, $2, $3, $4) RETURNING id`,
      [filename, originalname, uploadTime, "uploaded"]
    );

    const filePath = path.join(__dirname, "uploads", filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent);

    await pool.query(
      `INSERT INTO processed_data (document_id, data)
             VALUES ($1, $2)`,
      [result.rows[0].id, JSON.stringify(jsonData)]
    );

    res.json({ documentId: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error uploading file" });
  }
});

app.get("/status/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT status FROM documents WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({ documentId: id, status: result.rows[0].status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching status" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
