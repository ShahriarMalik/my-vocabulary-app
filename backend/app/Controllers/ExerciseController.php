<?php
namespace Shahr\Backend\Controllers;

use AllowDynamicProperties;
use Shahr\Backend\Config\Database;
use Shahr\Backend\Gateways\ExerciseGateway;
use Shahr\Backend\Models\Exercise;

#[AllowDynamicProperties] class ExerciseController {
    private $db;
    private ExerciseGateway $exerciseGateway;

    public function __construct($db = null, ExerciseGateway $exerciseGateway = null, Exercise $exercise = null) {
        $this->db = $db ?? (new Database())->getConnection();
        $this->exerciseGateway = $exerciseGateway ?? new ExerciseGateway($this->db);
        $this->exercise = $exercise ?? new Exercise($this->exerciseGateway);
    }

    /**
     * Create a new exercise
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function create(array $request, object $response): object {
        $data = $request;

        $exercise = new Exercise($this->exerciseGateway);
        $exercise->exercise_type = $data['exercise_type'];
        $exercise->word_id = $data['word_id'];
        $exercise->lesson_id = $data['lesson_id'];
        $exercise->cefr_level = $data['cefr_level'];
        $exercise->question = $data['question'];
        $exercise->options = $data['options'];
        $exercise->correct_option = $data['correct_option'];
        $exercise->save();

        return $response->withJson(['message' => 'Exercise created', 'exercise' => $exercise]);
    }

    /**
     * Update an existing exercise
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function update(array $request, object $response): object {
        $data = $request;

        $exercise = Exercise::find($data['id']);
        if (!$exercise) {
            return $response->withJson(['message' => 'Exercise not found'], 404);
        }

        $exercise->exercise_type = $data['exercise_type'];
        $exercise->word_id = $data['word_id'];
        $exercise->lesson_id = $data['lesson_id'];
        $exercise->cefr_level = $data['cefr_level'];
        $exercise->question = $data['question'];
        $exercise->options = $data['options'];
        $exercise->correct_option = $data['correct_option'];
        $exercise->update();

        return $response->withJson(['message' => 'Exercise updated', 'exercise' => $exercise]);
    }

    /**
     * Delete an exercise by ID
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function delete(array $request, object $response): object {
        $id = $request['id'];

        $exercise = Exercise::find($id);
        if (!$exercise) {
            return $response->withJson(['message' => 'Exercise not found'], 404);
        }

        $exercise->delete();
        return $response->withJson(['message' => 'Exercise deleted']);
    }

    /**
     * Show a specific exercise by ID
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function show(array $request, object $response): object {
        $id = (int) $request['id'];

        $exercise = Exercise::find($id);
        if (!$exercise) {
            return $response->withJson(['message' => 'Exercise not found'], 404);
        }

        return $response->withJson(['exercise' => $exercise]);
    }

    /**
     * List all exercises
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function index(array $request, object $response): object {
        $exercises = Exercise::findAll();
        return $response->withJson(['exercises' => $exercises]);
    }

    /**
     * Get exercises by lesson ID
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function getByLesson(array $request, object $response): object {
        $lesson_id = $request['lesson_id'];

        $exercises = Exercise::findByLessonId($lesson_id);
        if (!$exercises) {
            return $response->withJson(['message' => 'No exercises found for this lesson'], 404);
        }

        return $response->withJson(['exercises' => $exercises]);
    }

    /**
     * Get exercises by Cefr Level
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function getLessonByCefrLevel(array $request, object $response): object {
        $cefrLevel = $request['cefr_level'];
        $lessonNumber = $request['lesson_number'];
        $limit = $request['limit'] ?? 20;
        $offset = $request['offset'] ?? 0;

        $exercises = Exercise::findByCefrLevel($cefrLevel, $lessonNumber, $limit, $offset);
        // Check if there are no exercises found
        if (empty($exercises)) {
            // Return a 204 No Content response
            return $response->withJson(null, 204);
        }

        return $response->withJson(['exercises' => $exercises]);
    }
}
