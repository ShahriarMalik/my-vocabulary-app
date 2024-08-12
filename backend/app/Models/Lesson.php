<?php

namespace Shahr\Backend\Models;

use Shahr\Backend\Gateways\LessonGatewayInterface;

class Lesson {
    public string $cefr_level;
    public int $limit;
    public int $offset;

    private static LessonGatewayInterface $gateway;

    /**
     * Lesson constructor.
     *
     * @param LessonGatewayInterface|null $gateway
     *    The gateway interface for accessing lesson data. If provided, it will be set as the static gateway.
     */
    public function __construct(LessonGatewayInterface $gateway = null) {
        if ($gateway !== null) {
            self::$gateway = $gateway;
        }
    }

    /**
     * Get lessons by CEFR level with pagination.
     *
     * @param string $cefr_level
     *    The CEFR level (e.g., A1, A2) to filter lessons.
     * @param int $limit
     *    The maximum number of lessons to retrieve.
     * @param int $offset
     *    The offset for pagination, indicating where to start retrieving lessons.
     *
     * @return array
     *    Returns the lessons that match the specified CEFR level within the given limit and offset.
     */
    public function getLessonsCefrLevel(string $cefr_level, int $limit, int $offset): array {
        return self::$gateway->getLessonsByCefrLevel($cefr_level, $limit, $offset);
    }

    /**
     * Count the number of lessons available for a specific CEFR level.
     *
     * @param string $cefr_level
     *    The CEFR level to filter the lesson count.
     *
     * @return int
     *    Returns the total number of lessons for the specified CEFR level.
     */
    public function countLessonsByCefrLevel(string $cefr_level): int {
        return self::$gateway->countLessonsByCefrLevel($cefr_level);
    }
}
