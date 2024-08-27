<?php
namespace Shahr\Backend\Controllers;

use Shahr\Backend\Config\Database;
use Shahr\Backend\Gateways\UserGateway;
use Shahr\Backend\Gateways\UserProgressGateway;
use Shahr\Backend\Middleware\AuthMiddleware;
use Shahr\Backend\Models\UserProgress;

class UserProgressController {
    private $db;
    private UserProgressGateway $progressGateway;
    private AuthMiddleware $authMiddleware;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->progressGateway = new UserProgressGateway($this->db); // Ensure this implements the interface
        $this->authMiddleware = new AuthMiddleware(new UserGateway($this->db));
    }

    public function save(array $request, object $response): object {
        // Authentication
        $authResult = $this->authMiddleware->authenticate();
        if (isset($authResult['error'])) {
            return $response->withJson(['message' => $authResult['error']], 401);
        }

        $data = $request;

        // Pass the gateway instance (which implements the interface) to the UserProgress constructor
        $progress = new UserProgress($this->progressGateway);
        $progress->user_id = $data['user_id'];
        $progress->cefr_level = $data['cefr_level'];
        $progress->lesson_id = $data['lesson_id'];
        $progress->word_id = $data['word_id'];
        $progress->word_score = $data['word_score'];
        $progress->word_completed = $data['word_completed'];
        $progress->exercise_id = $data['exercise_id'];
        $progress->exercise_score = $data['exercise_score'];
        $progress->exercise_completed = $data['exercise_completed'];

        if ($progress->progressExists($progress->user_id, $progress->word_id, $progress->lesson_id, $progress->exercise_id)) {
            $this->update( $request, $response);
            //return $response->withJson(['message' => 'User progress already exists'], 400);
        }else{
            $progress->save();
            return $response->withJson(['message' => 'User progress saved successfully']);
        }
    }


    /**
     * Update user progress
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function update(array $request, object $response): object {
        // Authentication
        $authResult = $this->authMiddleware->authenticate($request);
        if (isset($authResult['error'])) {
            return $response->withJson(['message' => $authResult['error']], 401);
        }

        $data = $request;

        // Create a new UserProgress instance and set its properties
        $progress = new UserProgress($this->progressGateway);
        $progress->user_id = $data['user_id'];
        $progress->cefr_level = $data['cefr_level'];
        $progress->lesson_id = $data['lesson_id'];
        $progress->word_id = $data['word_id'];
        $progress->word_score = $data['word_score'];
        $progress->word_completed = $data['word_completed'];
        $progress->exercise_id = $data['exercise_id'];
        $progress->exercise_score = $data['exercise_score'];
        $progress->exercise_completed = $data['exercise_completed'];

        // Check if progress exists based on user_id, cefr_level, and lesson_id
        if (!$progress->progressExists($progress->user_id, $progress->word_id, $progress->lesson_id, $progress->exercise_id)) {
            return $response->withJson(['message' => 'User progress does not exist'], 404);
        }

        // Update the existing progress entry
        $progress->update();
        return $response->withJson(['message' => 'User progress updated successfully'], 200);
    }

    /**
     * Get the user's progress for each CEFR level based on completed lessons.
     *
     * @param array $request The request data containing the user_id.
     * @param object $response The response object to return the data.
     * @return object The response object with the progress data.
     */
    public function getCefrProgress(array $request, object $response): object {
        // Authentication
        $authResult = $this->authMiddleware->authenticate($request);
        if (isset($authResult['error'])) {
            return $response->withJson(['message' => $authResult['error']], 401);
        }

        $user_id = $request['user_id'];

        // Retrieve CEFR level progress from the gateway
        $progress = $this->progressGateway->getCefrProgress($user_id);

        if (empty($progress)) {
            return $response->withJson(['message' => 'No progress found for the user'], 404);
        }

        return $response->withJson(['cefr_levels' => $progress], 200);
    }


    /**
     * Get the user's detailed progress for each lesson within a specific CEFR level, based on exercises.
     *
     * @param array $request The request data containing the user_id and cefr_level.
     * @param object $response The response object to return the data.
     * @return object The response object with the detailed progress data.
     */
    public function getLessonsProgress(array $request, object $response): object {
        // Authentication
        $authResult = $this->authMiddleware->authenticate($request);
        if (isset($authResult['error'])) {
            return $response->withJson(['message' => $authResult['error']], 401);
        }

        $user_id = $request['user_id'];
        $cefr_level = $request['cefr_level'];

        // Retrieve detailed lesson progress from the gateway
        $lessonsProgress = $this->progressGateway->getLessonsProgress($user_id, $cefr_level);

        if (empty($lessonsProgress)) {
            return $response->withJson(['message' => 'No lessons found for the specified CEFR level'], 404);
        }

        return $response->withJson(['lessons' => $lessonsProgress], 200);
    }


}
