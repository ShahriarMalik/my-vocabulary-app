<?php
namespace Shahr\Backend\Middleware;

use Shahr\Backend\Helpers\JWTCodec;
use Shahr\Backend\Gateways\UserGateway;

class AuthMiddleware {
    private UserGateway $userGateway;

    /**
     * AuthMiddleware constructor.
     *
     * @param UserGateway $userGateway
     */
    public function __construct(UserGateway $userGateway) {
        $this->userGateway = $userGateway;
    }

    /**
     * Authenticate the request using JWT.
     *
     * @return array
     */
    public function authenticate(): array {
        $headers = apache_request_headers();

        // Check for the Authorization header
        if (!isset($headers['Authorization'])) {
            return ['error' => 'Authorization header required'];
        }

        $authHeader = $headers['Authorization'];

        // Extract the JWT from the Authorization header
        list($jwt) = sscanf($authHeader, 'Bearer %s');

        if (!$jwt) {
            return ['error' => 'Invalid token'];
        }

        try {
            // Decode the JWT and get the payload
            $payload = JWTCodec::decode($jwt);
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }

        // Find the user by the ID in the payload
        $user = $this->userGateway->findById($payload['user_id']);

        if (!$user) {
            return ['error' => 'User not found'];
        }

        // Return the authenticated user
        return ['user' => $user];
    }
}
