<?php

namespace Shahr\Backend\Gateways;

use PDO;

class PasswordResetGateway {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Save a new password reset token to the database
     *
     * @param object $passwordReset
     * @return void
     */
    public function save(object $passwordReset): void {
        $stmt = $this->db->prepare("INSERT INTO password_resets (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)");
        $stmt->bindParam(':user_id', $passwordReset->user_id);
        $stmt->bindParam(':token', $passwordReset->token);
        $stmt->bindParam(':expires_at', $passwordReset->expires_at);
        $stmt->execute();
    }

    /**
     * Find a password reset record by its token
     *
     * @param string $token
     * @return object|null
     */
    public function findByToken(string $token): ?object {
        $stmt = $this->db->prepare("SELECT * FROM password_resets WHERE token = :token");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_OBJ) ?: null;
    }

    /**
     * Invalidate a password reset token by deleting it from the database
     *
     * @param string $token
     * @return bool
     */
    public function invalidateToken(string $token): bool {
        $stmt = $this->db->prepare("DELETE FROM password_resets WHERE token = :token");
        $stmt->bindParam(':token', $token);
        return $stmt->execute();
    }
}
