<?php
namespace Shahr\Backend\Gateways;

use Shahr\Backend\Models\User;
use PDO;

class UserGateway implements UserGatewayInterface {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Find a user by email.
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User {
        $stmt = $this->db->prepare("SELECT id, username, email, password_hash AS password, role FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, User::class);
        return $stmt->fetch() ?: null;
    }

    /**
     * Find a user by ID.
     *
     * @param int $id
     * @return User|null
     */
    public function findById(int $id): ?User {
        $stmt = $this->db->prepare("SELECT id, username, email, password_hash AS password, role FROM users WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, User::class);
        return $stmt->fetch() ?: null;
    }

    /**
     * Save a user to the database.
     *
     * @param User $user
     * @return void
     */
    public function save(User $user): void {
        if (isset($user->id)) {
            // Update existing user
            $stmt = $this->db->prepare("UPDATE users SET username = :username, email = :email, password_hash = :password WHERE id = :id");
            $stmt->bindParam(':id', $user->id);
        } else {
            // Insert new user
            $stmt = $this->db->prepare("INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password)");
        }

        $stmt->bindParam(':username', $user->username);
        $stmt->bindParam(':email', $user->email);
        $stmt->bindParam(':password', $user->password);
        $stmt->execute();

        if (!isset($user->id)) {
            $user->id = (int)$this->db->lastInsertId();
        }
    }

    /**
     * Update a user's password in the database.
     *
     * @param int $user_id
     * @param string $hashedPassword
     * @return void
     */
    public function updatePassword(int $user_id, string $hashedPassword): void {
        $stmt = $this->db->prepare("UPDATE users SET password_hash = :password WHERE id = :id");
        $stmt->bindParam(':id', $user_id);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->execute();
    }

    /**
     * Check if an email already exists in the database.
     *
     * @param string $email
     * @return bool
     */
    public function emailExists(string $email): bool {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }
}
