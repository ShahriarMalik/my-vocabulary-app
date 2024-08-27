<?php

use Shahr\Backend\Controllers\AuthController;
use Shahr\Backend\Controllers\WordController;
use Shahr\Backend\Controllers\UserProgressController;
use Shahr\Backend\Controllers\ExerciseController;
use Shahr\Backend\Controllers\LessonController;

// Helper function to define routes
function route($method, $path, $handler, $middleware = null)
{
    global $routes;
    $routes[] = ['method' => $method, 'path' => $path, 'handler' => $handler, 'middleware' => $middleware];
}

// Define AuthController routes
route('POST', '/register', [AuthController::class, 'register']);
route('POST', '/login', [AuthController::class, 'login']);
route('POST', '/refresh', [AuthController::class, 'refresh']);
route('POST', '/logout', [AuthController::class, 'logout']);
route('POST', '/request-password-reset', [AuthController::class, 'requestPasswordReset']);
route('POST', '/reset-password', [AuthController::class, 'resetPassword']);
route('POST', '/check-email', [AuthController::class, 'checkEmailExists']);

// Define WordController routes
route('GET', '/word/fetch', [WordController::class, 'fetchWordData']);
route('POST', '/word', [WordController::class, 'saveWord']);
route('GET', '/words', [WordController::class, 'index']);
route('GET', '/words/{id}', [WordController::class, 'show']);
route('PUT', '/words/{id}', [WordController::class, 'update']);
route('DELETE', '/word/delete/{id}', [WordController::class, 'delete']);
route('GET', '/words/level/{cefr_level}', [WordController::class, 'getWordsbyCefrLevel']);

// Define UserProgressController routes
route('POST', '/user-progress/save', [UserProgressController::class, 'save']);
route('PUT', '/user-progress/update', [UserProgressController::class, 'update']);
route('GET', '/user-progress/get', [UserProgressController::class, 'getProgress']);
route('GET', '/user-progress/cefr-levels', [UserProgressController::class, 'getCefrProgress']);
route('GET', '/user-progress/lessons', [UserProgressController::class, 'getLessonsProgress']);


// Define ExerciseController routes
route('POST', '/exercises', [ExerciseController::class, 'create']);
route('PUT', '/exercises', [ExerciseController::class, 'update']);
route('DELETE', '/exercises', [ExerciseController::class, 'delete']);
// route('GET', '/exercises/{id}', [ExerciseController::class, 'show']);
route('GET', '/exercises', [ExerciseController::class, 'index']);
route('GET', '/exercises/lesson/{lesson_id}', [ExerciseController::class, 'getByLesson']);
route('GET', '/exercises/{cefr_level}', [ExerciseController::class, 'getLessonByCefrLevel']);


// Define LessonController routes
route('GET', '/lessons', [LessonController::class, 'getLessonsByCefrLevel']);
route('GET', '/lessons/count', [LessonController::class, 'countLessonsByCefrLevel']);
