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
        $optionsArray = '{' . implode(',', array_map(fn($opt) => '"' . $opt . '"', $exercise->options)) . '}'; // Convert array to PostgreSQL array format
        $stmt = $this->db->prepare("INSERT INTO exercises (exercise_type, word_id, lesson_id, cefr_level, question, options, correct_option) VALUES (:exercise_type, :word_id, :lesson_id, :cefr_level, :question, :options, :correct_option) RETURNING id");
        $stmt->bindParam(':exercise_type', $exercise->exercise_type);
        $stmt->bindParam(':word_id', $exercise->word_id);
        $stmt->bindParam(':lesson_id', $exercise->lesson_id);
        $stmt->bindParam(':cefr_level', $exercise->cefr_level);
        $stmt->bindParam(':question', $exercise->question);
        $stmt->bindParam(':options', $optionsArray); // Bind PostgreSQL array format string
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
        $optionsArray = '{' . implode(',', array_map(fn($opt) => '"' . $opt . '"', $exercise->options)) . '}'; // Convert array to PostgreSQL array format
        $stmt = $this->db->prepare("UPDATE exercises SET exercise_type = :exercise_type, word_id = :word_id, lesson_id = :lesson_id, cefr_level = :cefr_level, question = :question, options = :options, correct_option = :correct_option WHERE id = :id");
        $stmt->bindParam(':id', $exercise->id);
        $stmt->bindParam(':exercise_type', $exercise->exercise_type);
        $stmt->bindParam(':word_id', $exercise->word_id);
        $stmt->bindParam(':lesson_id', $exercise->lesson_id);
        $stmt->bindParam(':cefr_level', $exercise->cefr_level);
        $stmt->bindParam(':question', $exercise->question);
        $stmt->bindParam(':options', $optionsArray); // Bind PostgreSQL array format string
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
     * @param string $cefr_level
     * @param int $lesson_id
     * @param int $limit
     * @param int $offset
     * @return Exercise[]
     */
    public function findByCefrLevel(string $cefr_level, int $lesson_id, int $limit, int $offset): array {
        $stmt = $this->db->prepare("
    SELECT 
        e.*, 
        w.id AS word_id, 
        w.german_word, 
        (SELECT t.translation FROM translations t WHERE t.word_id = w.id AND t.language = 'en' LIMIT 1) AS translation
    FROM 
        exercises e
    JOIN 
        words w ON e.word_id = w.id
    WHERE 
        e.cefr_level = :cefr_level 
        AND e.lesson_id = :lesson_id
    ORDER BY 
        e.id ASC 
    LIMIT 
        :limit 
    OFFSET 
        :offset
    ");

        $stmt->bindParam(':cefr_level', $cefr_level);
        $stmt->bindParam(':lesson_id', $lesson_id, PDO::PARAM_INT);
        $stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindParam(":offset", $offset, PDO::PARAM_INT);

        $stmt->execute();

        // Debug: Check if the statement executed successfully
        if (!$stmt) {
            var_dump("Execution failed:", $this->db->errorInfo());
        }

        // Fetch the data as an associative array
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $result = $stmt->fetchAll();

        $exercises = [];
        foreach ($result as $row) {
            // Create a new Exercise object and manually map the data
            $exercise = new Exercise();
            $exercise->id = $row['id'];
            $exercise->exercise_type = $row['exercise_type'];
            $exercise->word_id = $row['word_id'];
            $exercise->lesson_id = $row['lesson_id'];
            $exercise->cefr_level = $row['cefr_level'];
            $exercise->german_word = $row['german_word'];
            $exercise->translation = $row['translation'];
            $exercise->question = $row['question'];
            $exercise->correct_option  = $row['correct_option'];
            $exercise->options = isset($row['options']) ? str_getcsv(trim($row['options'], '{}')) : [];

            // Add the exercise to the array
            $exercises[] = $exercise;
        }

        return $exercises;
    }

}
