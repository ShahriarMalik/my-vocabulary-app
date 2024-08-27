<?php
namespace Shahr\Backend\Helpers;

class JWTCodec {
    private static string $secretKey;
    private static string $algorithm = 'HS256';

    /**
     * Initialize the JWTCodec with the secret key from the configuration.
     *
     * @throws \Exception
     */
    public static function init(): void {
        $config = require __DIR__ . '/../../config/config.php';
        if (!isset($config['app']['jwt_secret_key']) || empty($config['app']['jwt_secret_key'])) {
            throw new \Exception('JWT secret key not found in configuration');
        }
        self::$secretKey = $config['app']['jwt_secret_key'];
    }

    /**
     * Encode data to base64 URL format.
     *
     * @param string $data
     * @return string
     */
    private static function base64UrlEncode(string $data): string {
        $base64 = base64_encode($data);
        return str_replace(['+', '/', '='], ['-', '_', ''], $base64);
    }

    /**
     * Decode data from base64 URL format.
     *
     * @param string $base64Url
     * @return string
     */
    private static function base64UrlDecode(string $base64Url): string {
        $base64 = str_replace(['-', '_'], ['+', '/'], $base64Url);
        return base64_decode($base64);
    }

    /**
     * Encode a payload into a JWT.
     *
     * @param array $payload
     * @return string
     */
    public static function encode(array $payload): string {
        $header = json_encode(['typ' => 'JWT', 'alg' => self::$algorithm]);
        $payload['iat'] = time();
        $payload['exp'] = time() + 86400; // JWT valid for twenty-four hour

        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secretKey, true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    /**
     * Decode a JWT and verify its signature and expiration.
     *
     * @param string $jwt
     * @return array
     * @throws \Exception
     */
    public static function decode(string $jwt): array {
        [$base64UrlHeader, $base64UrlPayload, $base64UrlSignature] = explode(".", $jwt);

        $header = json_decode(self::base64UrlDecode($base64UrlHeader), true);
        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);
        $signature = self::base64UrlDecode($base64UrlSignature);

        $expectedSignature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secretKey, true);

        if (!hash_equals($expectedSignature, $signature)) {
            throw new \Exception("Invalid signature");
        }

        if ($payload['exp'] < time()) {
            throw new \Exception("Token expired");
        }

        return $payload;
    }
}

// Initialize secret key
JWTCodec::init();
