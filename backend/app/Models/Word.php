<?php
namespace Shahr\Backend\Models;

use Shahr\Backend\Gateways\WordGatewayInterface;

class Word {
    public ?int $id = null;
    public string $german_word;
    public string $cefr_level;
    public string $pronunciation_url;
    public string $emoji;
    public string $example;
    public int $lesson_id;
    public string $translation;

    private static WordGatewayInterface $gateway;

    /**
     * Word constructor.
     *
     * @param WordGatewayInterface|null $gateway
     *    The gateway interface for accessing word data. If provided, it will be set as the static gateway.
     */
    public function __construct(WordGatewayInterface $gateway = null) {
        if ($gateway !== null) {
            self::$gateway = $gateway;
        }
    }

    /**
     * Save the word to the database.
     *
     * @return void
     */
    public function save(): void {
        self::$gateway->save($this);
    }

    /**
     * Check if a word already exists in the database.
     *
     * @param string $word
     * @return bool
     */
    public static function wordExists(string $word): bool {
        return self::$gateway->wordExists($word);
    }

    /**
     * Find a word by its ID.
     *
     * @param int $id
     * @return array
     */
    public static function findById(int $id): array {
        return self::$gateway->findById($id);
    }

    /**
     * Get words by CEFR level with pagination.
     *
     * @param string $cefrLevel
     * @param int $lessonId
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public static function getWordbyCefrLevel(string $cefrLevel, int $lessonId, int $limit, int $offset): array {
        return self::$gateway->getWordbyCefrLevel($cefrLevel, $lessonId, $limit, $offset);
    }
}
