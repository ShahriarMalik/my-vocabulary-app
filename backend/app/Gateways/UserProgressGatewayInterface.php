<?php
namespace Shahr\Backend\Gateways;

use Shahr\Backend\Models\UserProgress;

interface UserProgressGatewayInterface {
    /**
     * Save user progress to the database.
     *
     * @param UserProgress $progress
     * @return void
     */
    public function save(UserProgress $progress): void;

    /**
     * Update user progress in the database.
     *
     * @param UserProgress $progress
     * @return void
     */
    public function update(UserProgress $progress): void;

    /**
     * Check if progress exists for a specific user, word, lesson, and exercise.
     *
     * @param int $user_id
     * @param int $word_id
     * @param int $lesson_id
     * @param int $exercise_id
     * @return bool
     */
    public function progressExists(int $user_id, int $word_id, int $lesson_id, int $exercise_id): bool;

    /**
     * Get the progress of a user by their ID.
     *
     * @param int $user_id
     * @return array|null
     */
    public function getProgressByUserId(int $user_id): ?array;
}
