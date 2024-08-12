<?php
namespace Shahr\Backend\Models;

use Shahr\Backend\Gateways\RefreshTokenGatewayInterface;

class RefreshToken {
    public ?int $id = null;
    public int $user_id;
    public string $token;
    public string $expires_at;

    private static RefreshTokenGatewayInterface $gateway;

    /**
     * RefreshToken constructor.
     *
     * @param RefreshTokenGatewayInterface|null $gateway
     *    The gateway interface for accessing refresh token data. If provided, it will be set as the static gateway.
     */
    public function __construct(RefreshTokenGatewayInterface $gateway = null) {
        if ($gateway !== null) {
            self::$gateway = $gateway;
        }
    }

    /**
     * Save the current refresh token to the database.
     *
     * @return void
     */
    public function save(): void {
        self::$gateway->save($this);
    }

    /**
     * Find a refresh token by its token string.
     *
     * @param string $token
     *    The token to search for.
     *
     * @return RefreshToken|null
     */
    public function findByToken(string $token): ?RefreshToken {
        return self::$gateway->findByToken($token);
    }
}
