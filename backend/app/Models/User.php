<?php
namespace Shahr\Backend\Models;

use Shahr\Backend\Gateways\UserGatewayInterface;

class User {
    public ?int $id = null;
    public string $username;
    public string $email;
    public string $password;
    public string $role;

    private static UserGatewayInterface $gateway;

    /**
     * User constructor.
     *
     * @param UserGatewayInterface|null $gateway
     *    The gateway interface for accessing user data. If provided, it will be set as the static gateway.
     */
    public function __construct(UserGatewayInterface $gateway = null) {
        if ($gateway !== null) {
            self::$gateway = $gateway;
        }
    }

    /**
     * Save the user to the database.
     *
     * @return void
     */
    public function save(): void {
        self::$gateway->save($this);
    }

    /**
     * Check if an email already exists in the database.
     *
     * @param string $email
     * @return bool
     */
    public static function emailExists(string $email): bool {
        return self::$gateway->emailExists($email);
    }

    /**
     * Find a user by email.
     *
     * @param string $email
     * @return User|null
     */
    public static function findByEmail(string $email): ?User {
        return self::$gateway->findByEmail($email);
    }

    /**
     * Check if the user is an admin.
     *
     * @return bool
     */
    public function isAdmin(): bool {
        return $this->role === 'admin';
    }
}
