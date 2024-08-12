<?php
namespace Shahr\Backend\Gateways;

use PDO;
use Shahr\Backend\Models\UserProgress;

class UserProgressGateway {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Save user progress to the database.
     *
     * @param UserProgress $progress
     * @return void
     */
    public function save(UserProgress $progress): void {
        $stmt = $this->db->prepare("INSERT INTO user_progress (user_id, word_id, lesson_id, score, completed) VALUES (:user_id, :word_id, :lesson_id, :score, :completed)");
        $stmt->bindParam(":user_id", $progress->user_id);
        $stmt->bindParam(":word_id", $progress->word_id);
        $stmt->bindParam(":lesson_id", $progress->lesson_id);
        $stmt->bindParam(":score", $progress->score);
        $stmt->bindParam(":completed", $progress->completed);
        $stmt->execute();
    }

    /**
     * Update user progress in the database.
     *
     * @param UserProgress $progress
     * @return void
     */
    public function update(UserProgress $progress): void {
        $stmt = $this->db->prepare("UPDATE user_progress SET score = :score, completed = :completed WHERE user_id = :user_id AND word_id = :word_id");
        $stmt->bindParam(":user_id", $progress->user_id);
        $stmt->bindParam(":word_id", $progress->word_id);
        $stmt->bindParam(":score", $progress->score);
        $stmt->bindParam(":completed", $progress->completed);
        $stmt->execute();
    }

    /**
     * Check if progress exists for a specific user and word.
     *
     * @param int $user_id
     * @param int $word_id
     * @return bool
     */
    public function progressExists(int $user_id, int $word_id): bool {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM user_progress WHERE user_id = :user_id AND word_id = :word_id");
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":word_id", $word_id);
        $stmt->execute();
        return $stmt->fetchColumn() > 0;
    }

    /**
     * Get the latest progress for a specific user.
     *
     * @param int $user_id
     * @return array|null
     */
    public function getLatestProgress(int $user_id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM user_progress WHERE user_id = :user_id ORDER BY lesson_id DESC, word_id DESC LIMIT 1");
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}
