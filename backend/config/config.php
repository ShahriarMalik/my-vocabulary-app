<?php
return [
    'app' => [
        'name' => 'Vocabulary Learning App',
        'env' => $_ENV['APP_ENV'] ?? 'production',
        'debug' => $_ENV['APP_DEBUG'] ?? false,
        'jwt_secret_key' => $_ENV['JWT_SECRET_KEY'] ?? '',
    ],
];
