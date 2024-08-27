<?php
namespace Shahr\Backend\Gateways;

use PDO;
use Shahr\Backend\Models\UserProgress;

class UserProgressGateway implements UserProgressGatewayInterface {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    public function save(UserProgress $progress): void {
        // Insert initial user progress without the lesson_completed and cefr_level_completed columns
        $stmt = $this->db->prepare("
        INSERT INTO user_progress (
            user_id, 
            cefr_level, 
            lesson_id, 
            word_id, 
            word_score, 
            word_completed, 
            exercise_id, 
            exercise_score, 
            exercise_completed
        ) VALUES (
            :user_id, 
            :cefr_level, 
            :lesson_id, 
            :word_id, 
            :word_score, 
            :word_completed, 
            :exercise_id, 
            :exercise_score, 
            :exercise_completed
        )
    ");

        $stmt->bindParam(":user_id", $progress->user_id);
        $stmt->bindParam(":cefr_level", $progress->cefr_level);
        $stmt->bindParam(":lesson_id", $progress->lesson_id);
        $stmt->bindParam(":word_id", $progress->word_id);
        $stmt->bindParam(":word_score", $progress->word_score);
        $stmt->bindParam(":word_completed", $progress->word_completed, PDO::PARAM_BOOL);
        $stmt->bindParam(":exercise_id", $progress->exercise_id);
        $stmt->bindParam(":exercise_score", $progress->exercise_score);
        $stmt->bindParam(":exercise_completed", $progress->exercise_completed, PDO::PARAM_BOOL);

        // Execute the insert statement
        $stmt->execute();

        // After saving, update lesson and CEFR level completion status
        $this->updateLessonAndCefrStatus($progress->user_id, $progress->lesson_id, $progress->cefr_level);
    }


    /**
     * Updates the completion status of a lesson and CEFR level for a user.
     *
     * This method checks if all exercises in a given lesson are completed.
     * If all exercises are completed, it marks the lesson as completed.
     * It then checks if all lessons within a CEFR level are completed.
     * If all lessons are completed, it marks the CEFR level as completed.
     *
     * @param int $user_id The ID of the user whose progress is being updated.
     * @param int $lesson_id The ID of the lesson being checked.
     * @param string $cefr_level The CEFR level being checked.
     * @return void
     */
    private function updateLessonAndCefrStatus(int $user_id, int $lesson_id, string $cefr_level): void {
        // Check if all exercises in the lesson are completed
        $stmt = $this->db->prepare("
        SELECT COUNT(*) 
        FROM exercises e 
        LEFT JOIN user_progress up ON e.id = up.exercise_id
        WHERE e.lesson_id = :lesson_id 
        AND up.user_id = :user_id 
        AND up.cefr_level = :cefr_level 
        AND up.exercise_completed = false
    ");

        // Bind parameters to the query
        $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->bindParam(":lesson_id", $lesson_id, PDO::PARAM_INT);
        $stmt->bindParam(":cefr_level", $cefr_level, PDO::PARAM_STR);
        $stmt->execute();

        // Fetch the count of remaining incomplete exercises in the lesson
        $remainingExercises = $stmt->fetchColumn();

        // If no remaining exercises, mark the lesson as completed
        if ($remainingExercises == 0) {
            $stmt = $this->db->prepare("
            UPDATE user_progress
            SET lesson_completed = true
            WHERE user_id = :user_id 
            AND lesson_id = :lesson_id 
            AND cefr_level = :cefr_level
        ");

            // Bind parameters to the query
            $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
            $stmt->bindParam(":lesson_id", $lesson_id, PDO::PARAM_INT);
            $stmt->bindParam(":cefr_level", $cefr_level, PDO::PARAM_STR);
            $stmt->execute();
        }

        // Check if all lessons in the CEFR level are completed
        $stmt = $this->db->prepare("
        SELECT COUNT(*) 
        FROM lessons l 
        LEFT JOIN user_progress up ON l.id = up.lesson_id
        WHERE l.cefr_level = :cefr_level 
        AND up.user_id = :user_id 
        AND up.lesson_completed = false
    ");

        // Bind parameters to the query
        $stmt->bindParam(":cefr_level", $cefr_level, PDO::PARAM_STR);
        $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->execute();

        // Fetch the count of remaining incomplete lessons in the CEFR level
        $remainingLessons = $stmt->fetchColumn();

        // If no remaining lessons, mark the CEFR level as completed
        if ($remainingLessons == 0) {
            $stmt = $this->db->prepare("
            UPDATE user_progress
            SET cefr_level_completed = true
            WHERE user_id = :user_id 
            AND cefr_level = :cefr_level
        ");
            $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
            $stmt->bindParam(":cefr_level", $cefr_level, PDO::PARAM_STR);
            $stmt->execute();
        }
    }


    public function update(UserProgress $progress): void {
        $stmt = $this->db->prepare("
            UPDATE user_progress 
            SET 
                cefr_level = :cefr_level, 
                word_score = :word_score, 
                word_completed = :word_completed, 
                exercise_score = :exercise_score, 
                exercise_completed = :exercise_completed 
            WHERE 
                user_id = :user_id 
                AND word_id = :word_id 
                AND lesson_id = :lesson_id 
                AND exercise_id = :exercise_id
        ");
        $stmt->bindParam(":user_id", $progress->user_id);
        $stmt->bindParam(":cefr_level", $progress->cefr_level);
        $stmt->bindParam(":lesson_id", $progress->lesson_id);
        $stmt->bindParam(":word_id", $progress->word_id);
        $stmt->bindParam(":word_score", $progress->word_score);
        $stmt->bindParam(":word_completed", $progress->word_completed, PDO::PARAM_BOOL);
        $stmt->bindParam(":exercise_id", $progress->exercise_id);
        $stmt->bindParam(":exercise_score", $progress->exercise_score);
        $stmt->bindParam(":exercise_completed", $progress->exercise_completed, PDO::PARAM_BOOL);

        $stmt->execute();
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
    public function progressExists(int $user_id, int $word_id, int $lesson_id, int $exercise_id): bool {
        $stmt = $this->db->prepare("
        SELECT COUNT(*) 
        FROM user_progress 
        WHERE user_id = :user_id 
        AND word_id = :word_id 
        AND lesson_id = :lesson_id 
        AND exercise_id = :exercise_id
    ");
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":word_id", $word_id);
        $stmt->bindParam(":lesson_id", $lesson_id);
        $stmt->bindParam(":exercise_id", $exercise_id);
        $stmt->execute();

        return $stmt->fetchColumn() > 0;
    }


    public function getLatestProgress(int $user_id): ?array {
        $stmt = $this->db->prepare("
            SELECT * 
            FROM user_progress 
            WHERE user_id = :user_id 
            ORDER BY lesson_id DESC, word_id DESC 
            LIMIT 1
        ");
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function getProgressByUserId(int $user_id): ?array {
        $stmt = $this->db->prepare("
            SELECT * 
            FROM user_progress 
            WHERE user_id = :user_id
        ");
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: null;
    }

    /**
     * Get progress information for each CEFR level based on completed lessons.
     *
     * @param int $user_id The ID of the user whose progress is being retrieved.
     * @return array The progress data for each CEFR level.
     */
    public function getCefrProgress(int $user_id): array {
        $stmt = $this->db->prepare("
        SELECT 
            l.cefr_level,
            COUNT(DISTINCT l.id) AS total_lessons,
            COUNT(DISTINCT up.lesson_id) AS completed_lessons
        FROM lessons l
        LEFT JOIN user_progress up 
            ON l.id = up.lesson_id 
            AND up.user_id = :user_id 
            AND up.lesson_completed = true
        GROUP BY l.cefr_level
    ");

        $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate progress percentage for each CEFR level
        foreach ($result as &$row) {
            $row['progress_percentage'] = ($row['completed_lessons'] / $row['total_lessons']) * 100;
        }

        return $result;
    }


    /**
     * Get progress information for words within a specific lesson.
     *
     * @param int $user_id The ID of the user whose progress is being retrieved.
     * @param int $lesson_id The ID of the lesson for which word progress is being retrieved.
     * @return array The progress data for each word within the lesson.
     */
    private function getWordsProgress(int $user_id, int $lesson_id): array {
        $stmt = $this->db->prepare("
        SELECT 
            w.id AS word_id,
            w.german_word,
            COALESCE(up.word_completed, false) AS completed
        FROM words w
        LEFT JOIN user_progress up 
            ON w.id = up.word_id 
            AND up.user_id = :user_id
        WHERE w.lesson_id = :lesson_id
    ");

        $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->bindParam(":lesson_id", $lesson_id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }



    /**
     * Get detailed progress information for each lesson within a specific CEFR level, based on exercises.
     *
     * @param int $user_id The ID of the user whose progress is being retrieved.
     * @param string $cefr_level The CEFR level for which progress is being retrieved.
     * @return array The detailed progress data for each lesson within the CEFR level.
     */
    public function getLessonsProgress(int $user_id, string $cefr_level): array {
        // Retrieve lessons and progress data based on exercises
        $stmt = $this->db->prepare("
        SELECT 
            l.id AS lesson_id,
            l.lesson_number,
            COUNT(e.id) AS total_exercises,
            COUNT(up.exercise_id) AS completed_exercises
        FROM lessons l
        LEFT JOIN exercises e ON l.id = e.lesson_id
        LEFT JOIN user_progress up 
            ON e.id = up.exercise_id 
            AND up.user_id = :user_id
            AND up.exercise_completed = true
        WHERE l.cefr_level = :cefr_level
        GROUP BY l.id, l.lesson_number
    ");

        $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->bindParam(":cefr_level", $cefr_level, PDO::PARAM_STR);
        $stmt->execute();

        $lessons = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Retrieve exercise-level progress for each lesson
        foreach ($lessons as &$lesson) {
            $lesson['exercises'] = $this->getExercisesProgress($user_id, $lesson['lesson_id']);

            // Prevent division by zero
            if ($lesson['total_exercises'] > 0) {
                $lesson['progress_percentage'] = ($lesson['completed_exercises'] / $lesson['total_exercises']) * 100;
            } else {
                $lesson['progress_percentage'] = 0;
            }
        }

        return $lessons;
    }

    /**
     * Get progress information for exercises within a specific lesson.
     *
     * @param int $user_id The ID of the user whose progress is being retrieved.
     * @param int $lesson_id The ID of the lesson for which exercise progress is being retrieved.
     * @return array The progress data for each exercise within the lesson.
     */
    private function getExercisesProgress(int $user_id, int $lesson_id): array {
        $stmt = $this->db->prepare("
        SELECT 
            e.id AS exercise_id,
            e.question,
            COALESCE(up.exercise_completed, false) AS completed
        FROM exercises e
        LEFT JOIN user_progress up 
            ON e.id = up.exercise_id 
            AND up.user_id = :user_id
        WHERE e.lesson_id = :lesson_id
    ");

        $stmt->bindParam(":user_id", $user_id, PDO::PARAM_INT);
        $stmt->bindParam(":lesson_id", $lesson_id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


}
