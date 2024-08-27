<?php
namespace Shahr\Backend\Controllers;

use Shahr\Backend\Config\Database;
use Shahr\Backend\Gateways\WordGateway;
use Shahr\Backend\Helpers\WordDataHelper;
use Shahr\Backend\Models\Word;

class WordController {
    private $db;
    private WordGateway $wordGateway;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->wordGateway = new WordGateway($this->db);
    }

    /**
     * List all words
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function index(array $request, object $response): object {
        $words = $this->wordGateway->getAllWords();
        return $response->withJson(['words' => $words]);
    }

    /**
     * Fetch data for a specific word (translations, emoji, pronunciation URL)
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function fetchWordData(array $request, object $response): object {
        $wordText = $request['word'];

        try {
            $translations = WordDataHelper::fetchTranslations($wordText);
            $emoji = WordDataHelper::fetchEmoji($wordText);
            $pronunciationUrl = WordDataHelper::fetchPronunciationUrl($wordText);

            $audioUrl = $pronunciationUrl; // S3 URL
        } catch (\Exception $e) {
            file_put_contents(__DIR__ . '/../../public/fetchWordData_debug.txt', 'Error: ' . $e->getMessage());
            return $response->withJson(['message' => 'Error fetching data', 'error' => $e->getMessage()], 500);
        }

        return $response->withJson([
            'word' => $wordText,
            'translations' => $translations,
            'emoji' => $emoji,
            'pronunciation_url' => $audioUrl,
            'translated_language' => 'en' // TODO: Make the language dynamic
        ]);
    }

    /**
     * Show details of a specific word by ID
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function show(array $request, object $response): object {
        $id = $request['id'];

        $word = new Word($this->wordGateway);
        $wordData = $word->findById($id);
        return $response->withJson(['message' => 'Showing word', 'data' => $wordData]);
    }

    /**
     * Save a new word to the database
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function saveWord(array $request, object $response): object {
        $wordData = $request;

        $word = new Word($this->wordGateway);

        // Check if the word already exists
        if ($word->wordExists($wordData['german_word'])) {
            return $response->withJson(['message' => 'Word already exists'], 400);
        }

        // Set word properties
        $word->german_word = $wordData['german_word'];
        $word->cefr_level = $wordData['cefr_level'];
        $word->pronunciation_url = $wordData['pronunciation_url'];
        $word->emoji = $wordData['emoji'];
        $word->example = $wordData['example'];
        $word->translation = $wordData['translation'];

        // Save word
        $word->save();

        return $response->withJson(['message' => 'Word created successfully']);
    }

    /**
     * Update an existing word by ID
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function update(array $request, object $response): object {
        $wordData = $request;
        $id = $request['id'];

        // Find the word by ID
        $existingWord = $this->wordGateway->findById($id);

        if (!$existingWord) {
            return $response->withJson(['message' => 'Word not found'], 404);
        }

        // Update the word properties
        $existingWord['german_word'] = $wordData['german_word'] ?? $existingWord['german_word'];
        $existingWord['cefr_level'] = $wordData['cefr_level'] ?? $existingWord['cefr_level'];
        $existingWord['pronunciation_url'] = $wordData['pronunciation_url'] ?? $existingWord['pronunciation_url'];
        $existingWord['emoji'] = $wordData['emoji'] ?? $existingWord['emoji'];
        $existingWord['example'] = $wordData['example'] ?? $existingWord['example'];

        // Save the updated word back to the database
        $this->wordGateway->updateWord($id, $existingWord);

        // Update translation if provided
        if (isset($wordData['translation'])) {
            $this->wordGateway->updateTranslation($id, $wordData['translation']);
        }

        return $response->withJson(['message' => 'Word updated successfully']);
    }

    /**
     * Delete a word by ID
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function delete(array $request, object $response): object {
        $id = $request['id'];
        $word = new Word($this->wordGateway);
        $existingWord = $word->findById($id);

        if (!$existingWord) {
            return $response->withJson(['message' => 'Word not found'], 404);
        }

        $this->wordGateway->deleteWord($id);
        return $response->withJson(['message' => 'Word deleted successfully']);
    }

    /**
     * Get words by CEFR level with pagination
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function getWordsByCefrLevel(array $request, object $response): object {
        $cefrLevel = $request['cefr_level'];
        $lessonNumber = $request['lesson_number'];
        $limit = $request['limit'] ?? 20;
        $offset = $request['offset'] ?? 0;
        $word = new Word($this->wordGateway);
        $words = $word->getWordByCefrLevel($cefrLevel, $lessonNumber, $limit, $offset);
        return $response->withJson(['words' => $words]);
    }
}
