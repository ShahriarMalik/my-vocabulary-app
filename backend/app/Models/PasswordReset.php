<?php

namespace Shahr\Backend\Models;

use Shahr\Backend\Gateways\PasswordResetGateway;

class PasswordReset {

    public ?int $id = null;
    public int $user_id;
    public string $token;
    public string $expires_at;

    private PasswordResetGateway $gateway;

    /**
     * PasswordReset constructor.
     *
     * @param PasswordResetGateway $gateway
     *    The gateway interface for accessing password reset data.
     */
    public function __construct(PasswordResetGateway $gateway) {
        $this->gateway = $gateway;
    }

    /**
     * Save the current password reset entry to the database.
     *
     * @return void
     */
    public function save(): void {
        $this->gateway->save($this);
    }

    /**
     * Find a password reset entry by its token.
     *
     * @param string $token
     *    The token to search for.
     *
     * @return PasswordReset|null
     */
    public function findByToken(string $token): ?PasswordReset {
        return $this->gateway->findByToken($token);
    }

    /**
     * Invalidate a password reset token.
     *
     * @param string $token
     *    The token to invalidate.
     *
     * @return void
     */
    public function invalidateToken(string $token): void {
        $this->gateway->invalidateToken($token);
    }
}
