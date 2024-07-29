<?php
namespace Shahr\Backend\Controllers;

class AuthController {
    public function __construct() {
        // Constructor logic
    }

    public function login() {
        // Login logic
        echo json_encode(['message' => 'Login endpoint']);
    }

    public function register() {
        // Register logic
        echo json_encode(['message' => 'Register endpoint']);
    }
}
