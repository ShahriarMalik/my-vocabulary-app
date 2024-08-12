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
        $this->progressGateway = new UserProgressGateway($this->db);
        $this->authMiddleware = new AuthMiddleware(new UserGateway($this->db));
    }

    /**
     * Save user progress
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function save(array $request, object $response): object {
        // Authentication
        $authResult = $this->authMiddleware->authenticate();

        if (isset($authResult['error'])) {
            return $response->withJson(['message' => $authResult['error']], 401);
        }

        $data = $request;

        $progress = new UserProgress($this->progressGateway);
        $progress->user_id = $data['user_id'];
        $progress->word_id = $data['word_id'];
        $progress->lesson_id = $data['lesson_id'];
        $progress->score = $data['score'];
        $progress->completed = $data['completed'];

        if ($progress->progressExists($progress->user_id, $progress->word_id)) {
            return $response->withJson(['message' => 'User progress already exists'], 400);
        }

        $progress->save();
        return $response->withJson(['message' => 'User progress saved successfully']);
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

        $progress = new UserProgress($this->progressGateway);
        $progress->user_id = $data['user_id'];
        $progress->word_id = $data['word_id'];
        $progress->score = $data['score'];
        $progress->completed = $data['completed'];

        if (!$progress->progressExists($progress->user_id, $progress->word_id)) {
            return $response->withJson(['message' => 'User progress does not exist'], 404);
        }

        $progress->update();
        return $response->withJson(['message' => 'User progress updated successfully']);
    }

    /**
     * Get the latest progress of a user
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function getProgress(array $request, object $response): object {
        // Authentication
        $authResult = $this->authMiddleware->authenticate($request);
        if (isset($authResult['error'])) {
            return $response->withJson(['message' => $authResult['error']], 401);
        }

        $user_id = $request['user_id'];
        $progress = $this->progressGateway->getLatestProgress($user_id);

        if (!$progress) {
            return $response->withJson(['message' => 'User progress not found'], 404);
        }

        return $response->withJson(['progress' => $progress]);
    }
}
