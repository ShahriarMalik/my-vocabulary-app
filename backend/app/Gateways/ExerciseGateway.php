<?php
namespace Shahr\Backend\Gateways;

use Shahr\Backend\Models\Exercise;
use PDO;

class ExerciseGateway implements ExerciseGatewayInterface {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Save a new exercise to the database
     *
     * @param Exercise $exercise
     * @return void
     */
    public function save(Exercise $exercise): void {
        $stmt = $this->db->prepare("INSERT INTO exercises (exercise_type, word_id, lesson_id, question, options, correct_option) VALUES (:exercise_type, :word_id, :lesson_id, :question, :options, :correct_option) RETURNING id");
        $stmt->bindParam(':exercise_type', $exercise->exercise_type);
        $stmt->bindParam(':word_id', $exercise->word_id);
        $stmt->bindParam(':lesson_id', $exercise->lesson_id);
        $stmt->bindParam(':question', $exercise->question);
        $stmt->bindParam(':options', $exercise->options);
        $stmt->bindParam(':correct_option', $exercise->correct_option);
        $stmt->execute();
        $exercise->id = $stmt->fetchColumn();
    }

    /**
     * Update an existing exercise in the database
     *
     * @param Exercise $exercise
     * @return void
     */
    public function update(Exercise $exercise): void {
        $stmt = $this->db->prepare("UPDATE exercises SET exercise_type = :exercise_type, word_id = :word_id, lesson_id = :lesson_id, question = :question, options = :options, correct_option = :correct_option WHERE id = :id");
        $stmt->bindParam(':id', $exercise->id);
        $stmt->bindParam(':exercise_type', $exercise->exercise_type);
        $stmt->bindParam(':word_id', $exercise->word_id);
        $stmt->bindParam(':lesson_id', $exercise->lesson_id);
        $stmt->bindParam(':question', $exercise->question);
        $stmt->bindParam(':options', $exercise->options);
        $stmt->bindParam(':correct_option', $exercise->correct_option);
        $stmt->execute();
    }

    /**
     * Delete an exercise from the database by ID
     *
     * @param int $id
     * @return void
     */
    public function delete(int $id): void {
        $stmt = $this->db->prepare("DELETE FROM exercises WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }

    /**
     * Find an exercise by ID
     *
     * @param int $id
     * @return Exercise|null
     */
    public function find(int $id): ?Exercise {
        $stmt = $this->db->prepare("SELECT * FROM exercises WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, Exercise::class);
        return $stmt->fetch() ?: null;
    }

    /**
     * Find all exercises in the database
     *
     * @return Exercise[]
     */
    public function findAll(): array {
        $stmt = $this->db->query("SELECT * FROM exercises");
        $stmt->setFetchMode(PDO::FETCH_CLASS, Exercise::class);
        return $stmt->fetchAll();
    }

    /**
     * Find exercises by lesson ID
     *
     * @param int $lesson_id
     * @return Exercise[]
     */
    public function findByLessonId(int $lesson_id): array {
        $stmt = $this->db->prepare("SELECT * FROM exercises WHERE lesson_id = :lesson_id");
        $stmt->bindParam(':lesson_id', $lesson_id);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, Exercise::class);
        return $stmt->fetchAll();
    }


    /**
     * Find exercises by Cefr Level and lesson ID
     *
     * @param int $lesson_id
     * @return Exercise[]
     */
    public function findByCefrLevel(string $cefr_level,int $lesson_id, int $limit, int $offset): array {
        $stmt = $this->db->prepare("SELECT * FROM exercises WHERE cefr_level = :cefr_level AND lesson_id = :lesson_id  LIMIT :limit OFFSET :offset");
        $stmt->bindParam(':cefr_level', $cefr_level);
        $stmt->bindParam(':lesson_id', $lesson_id);
        $stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindParam(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();
        $stmt->setFetchMode(PDO::FETCH_CLASS, Exercise::class);
        return $stmt->fetchAll();
    }
}
