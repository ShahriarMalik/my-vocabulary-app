<?php
namespace Shahr\Backend\Gateways;

use PDO;
use Shahr\Backend\Models\Word;

class WordGateway implements WordGatewayInterface {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Get all words from the database.
     *
     * @return Word[]
     */
    public function getAllWords(): array {
        $stmt = $this->db->prepare("SELECT * FROM words");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_CLASS, Word::class);
    }

    /**
     * Save a word to the database.
     *
     * @param Word $word
     * @return void
     */
    public function save(Word $word): void {
        if ($word->id) {
            // Update existing word
            $stmt = $this->db->prepare("UPDATE words SET german_word = :german_word, cefr_level = :cefr_level, pronunciation_url = :pronunciation_url, emoji = :emoji, example = :example, lesson_id = :lesson_id WHERE id = :id");
            $stmt->bindParam(":id", $word->id);
        } else {
            // Insert new word
            $word->lesson_id = $this->getLessonID($word->cefr_level);
            $stmt = $this->db->prepare("INSERT INTO words (german_word, cefr_level, pronunciation_url, emoji, example, lesson_id) VALUES (:german_word, :cefr_level, :pronunciation_url, :emoji, :example, :lesson_id) RETURNING id");
        }

        $stmt->bindParam(":german_word", $word->german_word);
        $stmt->bindParam(":cefr_level", $word->cefr_level);
        $stmt->bindParam(":pronunciation_url", $word->pronunciation_url);
        $stmt->bindParam(":emoji", $word->emoji);
        $stmt->bindParam(":example", $word->example);
        $stmt->bindParam(":lesson_id", $word->lesson_id);

        $stmt->execute();

        if (!$word->id) {
            $word->id = (int)$stmt->fetchColumn();
            $this->insertTranslation($word->id, $word->translation);
        }
    }

    /**
     * Check if a word exists in the database.
     *
     * @param string $word
     * @return bool
     */
    public function wordExists(string $word): bool {
        $stmt = $this->db->prepare("SELECT 1 FROM words WHERE german_word = :word");
        $stmt->bindParam(":word", $word);
        $stmt->execute();
        return $stmt->fetchColumn() !== false;
    }

    /**
     * Find a word by its ID.
     *
     * @param int $id
     * @return array|null
     */
    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM words WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    /**
     * Delete a word from the database by ID.
     *
     * @param int $id
     * @return void
     */
    public function deleteWord(int $id): void {
        $stmt = $this->db->prepare("DELETE FROM words WHERE id = :id");
        $stmt->bindParam(":id", $id, PDO::PARAM_INT);
        $stmt->execute();
    }

    /**
     * Get the lesson ID based on the CEFR level.
     *
     * @param string $cefr_level
     * @return int
     */
    private function getLessonID(string $cefr_level): int {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM words WHERE cefr_level = :cefr_level");
        $stmt->bindParam(":cefr_level", $cefr_level);
        $stmt->execute();
        $word_count = (int)$stmt->fetchColumn();

        $lesson_number = intdiv($word_count, 20) + 1;

        $stmt = $this->db->prepare("SELECT id FROM lessons WHERE cefr_level = :cefr_level AND lesson_number = :lesson_number");
        $stmt->bindParam(":cefr_level", $cefr_level);
        $stmt->bindParam(":lesson_number", $lesson_number);
        $stmt->execute();
        $lesson_id = $stmt->fetchColumn();

        if (!$lesson_id) {
            $stmt = $this->db->prepare("INSERT INTO lessons (cefr_level, lesson_number) VALUES (:cefr_level, :lesson_number) RETURNING id");
            $stmt->bindParam(":cefr_level", $cefr_level);
            $stmt->bindParam(":lesson_number", $lesson_number);
            $stmt->execute();
            $lesson_id = (int)$stmt->fetchColumn();
        }

        return $lesson_id;
    }

    /**
     * Insert a translation for a word.
     *
     * @param int $word_id
     * @param string $translation
     * @param string $language
     * @return void
     */
    private function insertTranslation(int $word_id, string $translation, string $language = 'en'): void {
        $stmt = $this->db->prepare("INSERT INTO translations (word_id, translation, language) VALUES (:word_id, :translation, :language)");
        $stmt->bindParam(":word_id", $word_id, PDO::PARAM_INT);
        $stmt->bindParam(":translation", $translation);
        $stmt->bindParam(":language", $language);
        $stmt->execute();
    }

    /**
     * Update a word in the database by ID.
     *
     * @param int $id
     * @param array $data
     * @return void
     */
    public function updateWord(int $id, array $data): void {
        $stmt = $this->db->prepare("
            UPDATE words 
            SET german_word = :german_word, 
                cefr_level = :cefr_level, 
                pronunciation_url = :pronunciation_url, 
                emoji = :emoji, 
                example = :example
            WHERE id = :id
        ");
        $stmt->bindParam(':german_word', $data['german_word']);
        $stmt->bindParam(':cefr_level', $data['cefr_level']);
        $stmt->bindParam(':pronunciation_url', $data['pronunciation_url']);
        $stmt->bindParam(':emoji', $data['emoji']);
        $stmt->bindParam(':example', $data['example']);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
    }

    /**
     * Update or insert a translation for a word.
     *
     * @param int $word_id
     * @param string $translation
     * @param string $language
     * @return void
     */
    public function updateTranslation(int $word_id, string $translation, string $language = 'en'): void {
        // Check if the translation already exists
        $stmt = $this->db->prepare("SELECT id FROM translations WHERE word_id = :word_id AND language = :language");
        $stmt->bindParam(':word_id', $word_id, PDO::PARAM_INT);
        $stmt->bindParam(':language', $language);
        $stmt->execute();

        if ($stmt->fetchColumn()) {
            // Update existing translation
            $stmt = $this->db->prepare("UPDATE translations SET translation = :translation WHERE word_id = :word_id AND language = :language");
        } else {
            // Insert new translation if it doesn't exist
            $stmt = $this->db->prepare("INSERT INTO translations (word_id, translation, language) VALUES (:word_id, :translation, :language)");
        }

        $stmt->bindParam(':translation', $translation);
        $stmt->bindParam(':word_id', $word_id, PDO::PARAM_INT);
        $stmt->bindParam(':language', $language);
        $stmt->execute();
    }

    /**
     * Get words by CEFR level with pagination.
     *
     * @param string $cefrLevel
     * @param int $lessonNumber
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function getWordbyCefrLevel(string $cefrLevel, int $lessonNumber, int $limit, int $offset): array {
        $stmt = $this->db->prepare("SELECT * FROM words WHERE cefr_level = :cefr_level AND lesson_id = :lesson_number LIMIT :limit OFFSET :offset");
        $stmt->bindParam(":cefr_level", $cefrLevel);
        $stmt->bindParam(":lesson_number", $lessonNumber, PDO::PARAM_INT);
        $stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindParam(":offset", $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
