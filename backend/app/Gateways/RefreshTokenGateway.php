<?php
namespace Shahr\Backend\Gateways;

use Shahr\Backend\Models\RefreshToken;
use PDO;

class RefreshTokenGateway implements RefreshTokenGatewayInterface
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Save a new refresh token to the database
     *
     * @param RefreshToken $refreshToken
     * @return void
     */
    public function save(RefreshToken $refreshToken): void
    {
        $stmt = $this->db->prepare("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (:user_id, :token, :expires_at)");
        $stmt->bindParam(':user_id', $refreshToken->user_id);
        $stmt->bindParam(':token', $refreshToken->token);
        $stmt->bindParam(':expires_at', $refreshToken->expires_at);
        $stmt->execute();
        $refreshToken->id = (int)$this->db->lastInsertId();
    }

    /**
     * Find a refresh token record by token string
     *
     * @param string $token
     * @return RefreshToken|null
     */
    public function findByToken(string $token): ?RefreshToken
    {
        $stmt = $this->db->prepare("SELECT * FROM refresh_tokens WHERE token = :token");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, RefreshToken::class);
        return $stmt->fetch() ?: null;
    }

    /**
     * Invalidate a refresh token by deleting it from the database
     *
     * @param string $token
     * @return void
     */
    public function invalidateToken(string $token): void
    {
        $stmt = $this->db->prepare("DELETE FROM refresh_tokens WHERE token = :token");
        $stmt->bindParam(':token', $token);
        $stmt->execute();
    }
}
