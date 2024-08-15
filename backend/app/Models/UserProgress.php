<?php
namespace Shahr\Backend\Models;

use Shahr\Backend\Gateways\UserProgressGatewayInterface;

class UserProgress {
    public ?int $id = null;
    public int $user_id;
    public int $word_id;
    public int $lesson_id;
    public int $score;
    public bool $completed;
    public string $created_at;

    private static UserProgressGatewayInterface $gateway;

    /**
     * UserProgress constructor.
     *
     * @param UserProgressGatewayInterface|null $gateway
     *    The gateway interface for accessing user progress data. If provided, it will be set as the static gateway.
     */
    public function __construct(UserProgressGatewayInterface $gateway = null) {
        if ($gateway !== null) {
            self::$gateway = $gateway;
        }
    }

    /**
     * Save the current user progress to the database.
     *
     * @return void
     */
    public function save(): void {
        self::$gateway->save($this);
    }

    /**
     * Update the current user progress in the database.
     *
     * @return void
     */
    public function update(): void {
        self::$gateway->update($this);
    }

    /**
     * Check if progress exists for a specific user and word.
     *
     * @param int $user_id
     * @param int $word_id
     * @return bool
     */
    public static function progressExists(int $user_id, int $word_id): bool {
        return self::$gateway->progressExists($user_id, $word_id);
    }
}
