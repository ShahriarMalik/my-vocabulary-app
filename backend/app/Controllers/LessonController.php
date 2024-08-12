<?php

namespace Shahr\Backend\Controllers;

use Shahr\Backend\Config\Database;
use Shahr\Backend\Gateways\LessonGateway;
use Shahr\Backend\Models\Lesson;

class LessonController {
    private $db;
    private LessonGateway $lessonGateway;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        $this->lessonGateway = new LessonGateway($this->db);
    }

    /**
     * Get lessons by CEFR level with pagination
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function getLessonsByCefrLevel(array $request, object $response): object {
        $cefrLevel = $request['cefr_level'];
        $limit = $request['limit'];
        $offset = $request['offset'];

        $lesson = new Lesson($this->lessonGateway);
        $lessons = $lesson->getLessonsCefrLevel($cefrLevel, $limit, $offset);
        $lessonCount = $lesson->countLessonsByCefrLevel($cefrLevel);

        return $response->withJSON([
            'message' => 'Lessons list',
            'total' => $lessonCount,
            'lessons' => $lessons
        ]);
    }

    /**
     * Count the number of lessons by CEFR level
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function countLessonsByCefrLevel(array $request, object $response): object {
        $cefrLevel = $request['cefr_level'];

        $lesson = new Lesson($this->lessonGateway);
        $lessonCount = $lesson->countLessonsByCefrLevel($cefrLevel);

        return $response->withJSON([
            'message' => 'Lessons count',
            'total' => $lessonCount
        ]);
    }
}
