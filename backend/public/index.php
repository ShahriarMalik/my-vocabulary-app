<?php

require __DIR__ . '/../vendor/autoload.php';

use Shahr\Backend\Config\Database;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Initialize routes array
$routes = [];

// Include route definitions
require '../app/Routes/web.php';

// Helper function to send a JSON response
function sendJsonResponse($data, $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Route the request using the defined routes
function routeRequest($routes) {
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $uri = rtrim($uri, '/');
    $method = $_SERVER['REQUEST_METHOD'];

    // Check if the route is defined
    $routeFound = false;

    foreach ($routes as $route) {
        $routePattern = preg_replace('/{[^}]+}/', '([^/]+)', $route['path']);
        $routePattern = '#^' . $routePattern . '$#';

        if ($route['method'] === $method && preg_match($routePattern, $uri, $matches)) {
            array_shift($matches); // Remove the full match from the beginning
            [$controller, $action] = $route['handler'];
            $controllerInstance = new $controller();
            $response = new class {
                public function withJson($data, $status = 200) {
                    http_response_code($status);
                    header('Content-Type: application/json');
                    echo json_encode($data);
                    exit;
                }
            };

            // Extract dynamic segments from the route
            $paramKeys = [];
            if (preg_match_all('/{([^}]+)}/', $route['path'], $paramMatches)) {
                $paramKeys = $paramMatches[1];
            }

            $request = [];
            foreach ($matches as $index => $value) {
                if (isset($paramKeys[$index])) {
                    $request[$paramKeys[$index]] = $value;
                }
            }

            if ($method === 'GET' || $method === 'DELETE') {
                $request = array_merge($_GET, $request);
            } elseif ($method === 'POST' || $method === 'PUT') {
                $request = array_merge(json_decode(file_get_contents('php://input'), true), $request);
            } else {
                sendJsonResponse(['message' => 'Method not allowed'], 405);
            }

            $controllerInstance->$action($request, $response);
            $routeFound = true;
            break;
        }
    }

    if (!$routeFound) {
        sendJsonResponse(['message' => 'API Endpoint Not Specified'], 400);
    }
}

routeRequest($routes);
