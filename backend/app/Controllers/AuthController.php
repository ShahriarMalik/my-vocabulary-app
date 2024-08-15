<?php
namespace Shahr\Backend\Controllers;

use AllowDynamicProperties;
use Shahr\Backend\Models\User;
use Shahr\Backend\Helpers\JWTCodec;
use Shahr\Backend\Models\RefreshToken;
use Shahr\Backend\Gateways\UserGateway;
use Shahr\Backend\Gateways\RefreshTokenGateway;
use Shahr\Backend\Models\PasswordReset;
use Shahr\Backend\Gateways\PasswordResetGateway;
use Shahr\Backend\Helpers\Mailer;
use Shahr\Backend\Config\Database;

#[AllowDynamicProperties]
class AuthController {
    private $db;
    public UserGateway $userGateway;
    public RefreshTokenGateway $refreshTokenGateway;
    public PasswordResetGateway $passwordResetGateway;

    public function __construct($db = null, UserGateway $userGateway = null, RefreshTokenGateway $refreshTokenGateway = null, PasswordResetGateway $passwordResetGateway = null) {
        $this->db = $db ?? (new Database())->getConnection();
        $this->userGateway = $userGateway ?? new UserGateway($this->db);
        $this->refreshTokenGateway = $refreshTokenGateway ?? new RefreshTokenGateway($this->db);
        $this->passwordResetGateway = $passwordResetGateway ?? new PasswordResetGateway($this->db);
    }

    /**
     * Register a new user
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function register(array $request, object $response): object {
        $data = $request;

        // Validate input
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return $response->withJson(['message' => 'Invalid email format'], 400);
        }

        // Check if email already exists
        $user = new User($this->userGateway);
        if ($user->emailExists($data['email'])) {
            return $response->withJson(['message' => 'Email already in use'], 400);
        }

        // Hash the password
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

        // Create user
        $user->username = $data['username'];
        $user->email = $data['email'];
        $user->password = $hashedPassword;
        $user->role = 'user'; // Default role
        $user->save();

        // Return success message
        return $response->withJson(['message' => 'User registered successfully']);
    }

    /**
     * Log in a user and generate JWT and refresh tokens
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function login(array $request, object $response): object {
        $data = $request;

        // Validate input
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL) || empty($data['password'])) {
            return $response->withJson(['message' => 'Invalid credentials'], 400);
        }

        // Find user by email
        $user = new User($this->userGateway);
        $foundUser = $user->findByEmail($data['email']);

        if (!$foundUser || !password_verify($data['password'], $foundUser->password)) {
            return $response->withJson(['message' => 'Invalid credentials'], 400);
        }

        // Generate JWT token
        $jwt = JWTCodec::encode(['user_id' => $foundUser->id]);

        // Generate Refresh Token
        $refreshToken = bin2hex(random_bytes(64));

        // Save Refresh Token to database
        $token = new RefreshToken($this->refreshTokenGateway);
        $token->user_id = $foundUser->id;
        $token->token = $refreshToken;
        $token->expires_at = date('Y-m-d H:i:s', strtotime('+30 days'));
        $token->save();

        // Return response with tokens and role
        return $response->withJson([
            'jwt' => $jwt,
            'refresh_token' => $refreshToken,
            'role' => $foundUser->role // Include the role in the response
        ]);
    }

    /**
     * Refresh JWT token using a refresh token
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function refresh(array $request, object $response): object {
        $data = $request;

        // Validate input
        if (empty($data['refresh_token'])) {
            return $response->withJson(['message' => 'Refresh token is required'], 400);
        }

        // Find refresh token in the database
        $refreshToken = new RefreshToken($this->refreshTokenGateway);
        $foundToken = $refreshToken->findByToken($data['refresh_token']);
        if (!$foundToken || $foundToken->expires_at < date('Y-m-d H:i:s')) {
            return $response->withJson(['message' => 'Invalid or expired refresh token'], 400);
        }

        // Generate new JWT token
        $jwt = JWTCodec::encode(['user_id' => $foundToken->user_id]);

        // Return response with new JWT token
        return $response->withJson(['jwt' => $jwt]);
    }

    /**
     * Logout a user by invalidating the refresh token
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function logout(array $request, object $response): object {
        $data = $request;

        // Validate input
        if (empty($data['refresh_token'])) {
            return $response->withJson(['message' => 'Refresh token is required'], 400);
        }

        // Invalidate the refresh token
        $this->refreshTokenGateway->invalidateToken($data['refresh_token']);

        return $response->withJson(['message' => 'User logged out successfully']);
    }

    /**
     * Request a password reset link to be sent via email
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function requestPasswordReset(array $request, object $response): object {
        $data = $request;

        // Validate input
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return $response->withJson(['message' => 'If your email is registered, you will receive a password reset link shortly.'], 200);
        }

        // Find user by email
        $user = new User($this->userGateway);
        $foundUser = $user->findByEmail($data['email']);
        if ($foundUser) {
            // Generate password reset token
            $resetToken = bin2hex(random_bytes(4));
            $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

            // Save reset token to database
            $passwordReset = new PasswordReset($this->passwordResetGateway);
            $passwordReset->user_id = $foundUser->id;
            $passwordReset->token = $resetToken;
            $passwordReset->expires_at = $expiresAt;
            $passwordReset->save();

            // Send reset link via email
            $mailer = new Mailer();
            $subject = "Password Reset";
            $body = "
                <h1>Password Reset Request</h1>
                <p>Hi {$foundUser->username},</p>
                <p>We received a request to reset your password. If you did not make this request, you can ignore this email.</p>
                <p>To reset your password, use the following token:</p>
                <p><strong>{$resetToken}</strong></p>
                <p>This token will expire in 1 hour.</p>
                <p>Thank you,<br>Shahriar Malik</p>
            ";

            $mailer->send($foundUser->email, $subject, $body);
        }

        // Always return the same response regardless of whether the email was found
        return $response->withJson(['message' => 'If your email is registered, you will receive a password reset link shortly.'], 200);
    }

    /**
     * Reset the user's password using a reset token
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function resetPassword(array $request, object $response): object {
        $data = $request;

        // Validate input
        if (empty($data['reset_token']) || empty($data['new_password'])) {
            return $response->withJson(['message' => 'Invalid input'], 400);
        }

        // Find the password reset token
        $passwordReset = new PasswordReset($this->passwordResetGateway);
        $foundToken = $passwordReset->findByToken($data['reset_token']);

        if (!$foundToken || $foundToken->expires_at < date('Y-m-d H:i:s')) {
            return $response->withJson(['message' => 'Invalid or expired reset token'], 400);
        }

        // Hash the new password
        $hashedPassword = password_hash($data['new_password'], PASSWORD_DEFAULT);
        $this->userGateway->updatePassword($foundToken->user_id, $hashedPassword);

        // Invalidate reset token
        $passwordReset->invalidateToken($data['reset_token']);

        return $response->withJson(['message' => 'Password reset successfully']);
    }

    /**
     * Check if an email address already exists
     *
     * @param array $request
     * @param object $response
     * @return object
     */
    public function checkEmailExists(array $request, object $response): object {
        $data = $request;

        // Validate input
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return $response->withJson(['exists' => false, 'message' => 'Invalid email format'], 400);
        }

        // Check if email exists
        $user = new User($this->userGateway);
        $emailExists = $user->emailExists($data['email']);

        return $response->withJson(['exists' => $emailExists], 200);
    }

}
