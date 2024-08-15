<?php

namespace Shahr\Backend\Gateways;

use Shahr\Backend\Models\Word;

interface WordGatewayInterface {
    /**
     * Save a word to the database.
     *
     * @param Word $word
     * @return void
     */
    public function save(Word $word): void;

    /**
     * Check if a word exists in the database.
     *
     * @param string $word
     * @return bool
     */
    public function wordExists(string $word): bool;

    /**
     * Find a word by its ID.
     *
     * @param int $id
     * @return array|null
     */
    public function findById(int $id): ?array;

    /**
     * Update a word in the database by ID.
     *
     * @param int $id
     * @param array $data
     * @return void
     */
    public function updateWord(int $id, array $data): void;

    /**
     * Update or insert a translation for a word.
     *
     * @param int $word_id
     * @param string $translation
     * @param string $language
     * @return void
     */
    public function updateTranslation(int $word_id, string $translation, string $language = 'en'): void;

    /**
     * Delete a word from the database by ID.
     *
     * @param int $id
     * @return void
     */
    public function deleteWord(int $id): void;

    /**
     * Get words by CEFR level with pagination.
     *
     * @param string $cefrLevel
     * @param int $lessonId
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function getWordbyCefrLevel(string $cefrLevel, int $lessonId, int $limit, int $offset): array;
}
