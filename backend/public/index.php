<?php

use JetBrains\PhpStorm\NoReturn;

require '../vendor/autoload.php';

// Load environment variables
if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
}

// Get the requested URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove trailing slashes and explode into segments
$uri = rtrim($uri, '/');
$segments = explode('/', $uri);

// Helper function to send a JSON response
function sendJsonResponse($data, $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Route the request to the appropriate controller
if (isset($segments[1])) {
    $controllerName = 'Shahr\\Backend\\Controllers\\' . ucfirst($segments[1]) . 'Controller';
    if (class_exists($controllerName)) {
        $controller = new $controllerName();
        $method = $segments[2] ?? 'index'; // Default to 'index' method if none provided

        if (method_exists($controller, $method)) {
            // Check if the HTTP method is allowed for the requested endpoint
            $allowedMethods = get_class_methods($controller);
            $httpMethod = $_SERVER['REQUEST_METHOD'];

            // Define a mapping of HTTP methods to controller actions
            $httpMethodMapping = [
                'GET' => ['index', 'show'],
                'POST' => ['create'],
                'PUT' => ['update'],
                'DELETE' => ['delete']
            ];

            if (in_array($method, $allowedMethods) && array_key_exists($httpMethod, $httpMethodMapping) && in_array($method, $httpMethodMapping[$httpMethod])) {
                $params = array_slice($segments, 3);
                call_user_func_array([$controller, $method], $params);
            } else {
                sendJsonResponse(['message' => 'Method Not Allowed'], 405);
            }
        } else {
            sendJsonResponse(['message' => 'Method Not Found'], 404);
        }
    } else {
        sendJsonResponse(['message' => 'Controller Not Found'], 404);
    }
} else {
    sendJsonResponse(['message' => 'API Endpoint Not Specified'], 400);
}
