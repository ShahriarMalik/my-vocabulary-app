<?php
namespace Shahr\Backend\Gateways;

use Shahr\Backend\Models\User;

interface UserGatewayInterface {
    /**
     * Find a user by email.
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User;

    /**
     * Find a user by ID.
     *
     * @param int $id
     * @return User|null
     */
    public function findById(int $id): ?User;

    /**
     * Save a user to the database.
     *
     * @param User $user
     * @return void
     */
    public function save(User $user): void;

    /**
     * Update a user's password in the database.
     *
     * @param int $user_id
     * @param string $hashedPassword
     * @return void
     */
    public function updatePassword(int $user_id, string $hashedPassword): void;

    /**
     * Check if an email already exists in the database.
     *
     * @param string $email
     * @return bool
     */
    public function emailExists(string $email): bool;
}
