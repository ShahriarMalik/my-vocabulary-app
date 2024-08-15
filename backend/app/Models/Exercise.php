<?php
namespace Shahr\Backend\Models;

use Shahr\Backend\Gateways\ExerciseGatewayInterface;

class Exercise {
    public ?int $id = null;
    public string $exercise_type;
    public int $word_id;
    public int $lesson_id;
    public string $question;
    public array $options;
    public string $correct_option;

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
}
