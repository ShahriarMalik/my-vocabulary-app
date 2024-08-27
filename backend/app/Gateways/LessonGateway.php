<?php

namespace Shahr\Backend\Gateways;

use PDO;

class LessonGateway implements LessonGatewayInterface {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Get lessons by CEFR level with pagination
     *
     * @param string $cefrLevel
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function getLessonsByCefrLevel(string $cefrLevel, int $limit, int $offset): array {
        $stmt = $this->db->prepare("SELECT * FROM lessons WHERE cefr_level = :cefrLevel LIMIT :limit OFFSET :offset");
        $stmt->bindValue(':cefrLevel', $cefrLevel);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get a lesson by its ID
     *
     * @param int $lessonId
     * @return array|null
     */
    public function getLessonById(int $lessonId): ?array {
        // TODO: Implement getLessonById() method.
        return null;
    }

    /**
     * Create a new lesson
     *
     * @param array $lessonData
     * @return void
     */
    public function createLesson(array $lessonData): void {
        // TODO: Implement createLesson() method.
    }

    /**
     * Update an existing lesson
     *
     * @param int $lessonId
     * @param array $lessonData
     * @return void
     */
    public function updateLesson(int $lessonId, array $lessonData): void {
        // TODO: Implement updateLesson() method.
    }

    /**
     * Delete a lesson by its ID
     *
     * @param int $lessonId
     * @return void
     */
    public function deleteLesson(int $lessonId): void {
        // TODO: Implement deleteLesson() method.
    }

    /**
     * Count the number of lessons by CEFR level
     *
     * @param string $cefrLevel
     * @return int
     */
    public function countLessonsByCefrLevel(string $cefrLevel): int {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM lessons WHERE cefr_level = :cefrLevel");
        $stmt->bindValue(':cefrLevel', $cefrLevel);
        $stmt->execute();
        return (int) $stmt->fetchColumn();
    }
}
