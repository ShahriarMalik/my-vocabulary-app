<?php
namespace Shahr\Backend\Models;

use AllowDynamicProperties;
use Shahr\Backend\Gateways\ExerciseGatewayInterface;

#[AllowDynamicProperties] class Exercise {
    public ?int $id = null;
    public string $exercise_type;
    public int $word_id;
    public int $lesson_id;
    public string $cefr_level;
    public string $question;
    public array $options;
    public string $correct_option;
    public string $created_at;
    public ?string $german_word = null;
    public ?string $translation = null;

    private static ExerciseGatewayInterface $gateway;

    /**
     * Exercise constructor.
     *
     * @param ExerciseGatewayInterface|null $gateway
     */
    public function __construct(ExerciseGatewayInterface $gateway = null) {
        if ($gateway !== null) {
            self::$gateway = $gateway;
        }
    }

    /**
     * Save the current exercise to the database.
     *
     * @return void
     */
    public function save(): void {
        self::$gateway->save($this);
    }

    /**
     * Update the current exercise in the database.
     *
     * @return void
     */
    public function update(): void {
        self::$gateway->update($this);
    }

    /**
     * Delete the current exercise from the database.
     *
     * @return void
     */
    public function delete(): void {
        self::$gateway->delete($this->id);
    }

    /**
     * Find an exercise by its ID.
     *
     * @param int $id
     * @return Exercise|null
     */
    public static function find(int $id): ?Exercise {
        return self::$gateway->find($id);
    }

    /**
     * Find all exercises.
     *
     * @return Exercise[]
     */
    public static function findAll(): array {
        return self::$gateway->findAll();
    }

    /**
     * Find exercises by lesson ID.
     *
     * @param int $lesson_id
     * @return Exercise[]
     */
    public static function findByLessonId(int $lesson_id): array {
        return self::$gateway->findByLessonId($lesson_id);
    }

    /**
     * Find exercises by CEFR level.
     *
     * * @param string $cefr_level
     * * @param int $lesson_id
     * * @param int $limit
     * * @param int $offset
     * * @return array
 * @return Exercise[]
     */
    public static function findByCefrLevel(string $cefr_level,int $lesson_id, int $limit, int $offset): array {
        return self::$gateway->findByCefrLevel($cefr_level, $lesson_id, $limit, $offset);
    }
}
