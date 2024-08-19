<?php
namespace Shahr\Backend\Gateways;

use Shahr\Backend\Models\Exercise;

interface ExerciseGatewayInterface {
    /**
     * Save a new exercise to the database
     *
     * @param Exercise $exercise
     * @return void
     */
    public function save(Exercise $exercise): void;

    /**
     * Update an existing exercise in the database
     *
     * @param Exercise $exercise
     * @return void
     */
    public function update(Exercise $exercise): void;

    /**
     * Delete an exercise from the database by ID
     *
     * @param int $id
     * @return void
     */
    public function delete(int $id): void;

    /**
     * Find an exercise by ID
     *
     * @param int $id
     * @return Exercise|null
     */
    public function find(int $id): ?Exercise;

    /**
     * Find all exercises in the database
     *
     * @return Exercise[]
     */
    public function findAll(): array;

    /**
     * Find exercises by lesson ID
     *
     * @param int $lesson_id
     * @return Exercise[]
     */
    public function findByLessonId(int $lesson_id): array;

    /**
     * Get words by CEFR level and lesson ID with pagination.
     *
     * @param string $cefr_level
     * @param int $lesson_id
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function findByCefrLevel(string $cefr_level,int $lesson_id, int $limit, int $offset):array;
}
