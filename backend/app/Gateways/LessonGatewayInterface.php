<?php

namespace Shahr\Backend\Gateways;

interface LessonGatewayInterface {
    /**
     * Get lessons by CEFR level with pagination
     *
     * @param string $cefrLevel
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function getLessonsByCefrLevel(string $cefrLevel, int $limit, int $offset): array;

    /**
     * Get a lesson by its ID
     *
     * @param int $lessonId
     * @return array|null
     */
    public function getLessonById(int $lessonId): ?array;

    /**
     * Create a new lesson
     *
     * @param array $lessonData
     * @return void
     */
    public function createLesson(array $lessonData): void;

    /**
     * Update an existing lesson
     *
     * @param int $lessonId
     * @param array $lessonData
     * @return void
     */
    public function updateLesson(int $lessonId, array $lessonData): void;

    /**
     * Delete a lesson by its ID
     *
     * @param int $lessonId
     * @return void
     */
    public function deleteLesson(int $lessonId): void;

    /**
     * Count the number of lessons by CEFR level
     *
     * @param string $cefrLevel
     * @return int
     */
    public function countLessonsByCefrLevel(string $cefrLevel): int;
}
