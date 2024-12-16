# Document Ingestion and Processing System

This project implements a document ingestion system that allows uploading files, processing them asynchronously, and storing metadata and processed data in a PostgreSQL database. It is dockerized for easy deployment.

## Features
- Upload documents via an API
- Store metadata in PostgreSQL
- Process uploaded files asynchronously
- Dockerized setup
- Automatic table creation if not exists

## Requirements
- Docker
- Docker Compose

## Setup

1. Clone the repository

git clone <repository-url>
cd <project-directory>



2. Build and run the Docker containers

Build the Docker containers by running the following command:

1 - docker-compose build
2 - docker-compose up


3. Uploading files

To upload files to the API, use Postman or any HTTP client with the following steps:

    Set the request type to POST.
    Set the URL to: http://localhost:3000/upload.
    In the Body tab, select form-data.
    Add a key named file and select the file you wish to upload.

    Description: Uploads a file, stores metadata in the database, and processes it asynchronously.
    Request Body: key = "file" value = select file
    Response: documentId of the uploaded document.



This project was created by [Itay Amosi](https://github.com/itayz1e). Feel free to reach out if you have any questions or feedback.