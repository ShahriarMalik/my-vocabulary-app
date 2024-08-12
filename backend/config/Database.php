<?php

namespace Shahr\Backend\Config;

use PDO;
use PDOException;

class Database {
    private ?PDO $conn = null; // The PDO connection object

    /**
     * Establish a connection to the database.
     *
     * This method initializes a connection to a PostgreSQL database using the credentials
     * and configuration settings defined in the environment variables. It sets the charset
     * and error mode for the PDO connection.
     *
     * @return PDO|null The PDO connection object if successful, null otherwise.
     */
    public function getConnection(): ?PDO {
        if ($this->conn !== null) {
            return $this->conn;
        }

        try {
            $host = $_ENV['DB_HOST'] ?? ''; // Database host
            $port = $_ENV['DB_PORT'] ?? '5432'; // Database port
            $dbname = $_ENV['DB_DATABASE'] ?? ''; // Database name
            $username = $_ENV['DB_USERNAME'] ?? ''; // Database username
            $password = $_ENV['DB_PASSWORD'] ?? ''; // Database password
            $charset = $_ENV['DB_CHARSET'] ?? 'utf8'; // Database charset

            $dsn = "pgsql:host=$host;port=$port;dbname=$dbname"; // Data Source Name
            $this->conn = new PDO($dsn, $username, $password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("SET client_encoding TO '$charset'");
        } catch (PDOException $exception) {
            // Log the error to a file or logging service
            error_log("Connection error: " . $exception->getMessage());

            // Optionally rethrow or handle the exception as needed
            throw new \RuntimeException("Database connection failed.");
        }

        return $this->conn;
    }

    /**
     * Close the database connection.
     *
     * This method sets the connection object to null, effectively closing the connection.
     */
    public function closeConnection(): void {
        $this->conn = null;
    }
}
