<?php
namespace Shahr\Backend\Models;

use Shahr\Backend\Gateways\UserProgressGatewayInterface;

class UserProgress {
    public ?int $id = null;
    public int $user_id;
    public string $cefr_level;
    public int $lesson_id;
    public int $word_id;
    public bool $word_completed = false;
    public int $word_score = 0;
    public ?int $exercise_id = null;
    public int $exercise_score = 0;
    public bool $exercise_completed = false;
    public bool $lesson_completed = false;
    public bool $cefr_level_completed = false;
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
     * Check if progress exists for a specific user, word, lesson, and exercise.
     *
     * @param int $user_id
     * @param int $word_id
     * @param int $lesson_id
     * @param int $exercise_id
     * @return bool
     */
    public static function progressExists(int $user_id, string $cefr_level, int $lesson_id, int $word_id): bool {
        return self::$gateway->progressExists($user_id, $cefr_level, $lesson_id, $word_id);
    }
}
