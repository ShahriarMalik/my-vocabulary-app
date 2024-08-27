<?php
namespace Shahr\Backend\Gateways;

use Shahr\Backend\Models\RefreshToken;

interface RefreshTokenGatewayInterface {
    /**
     * Save a new refresh token to the database
     *
     * @param RefreshToken $refreshToken
     * @return void
     */
    public function save(RefreshToken $refreshToken): void;

    /**
     * Find a refresh token record by token string
     *
     * @param string $token
     * @return RefreshToken|null
     */
    public function findByToken(string $token): ?RefreshToken;
}
