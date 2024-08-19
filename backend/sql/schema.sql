CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT 'user' NOT NULL
);

CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    cefr_level VARCHAR(10) NOT NULL,
    lesson_number INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    german_word VARCHAR(255) NOT NULL,
    part_of_speech VARCHAR(50),
    cefr_level VARCHAR(10) NOT NULL,
    pronunciation_url VARCHAR(255),
    emoji VARCHAR(10),
    example VARCHAR(255) NOT NULL,
    lesson_id INTEGER REFERENCES lessons(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    word_id INTEGER REFERENCES words(id) ON DELETE CASCADE NOT NULL,
    language VARCHAR(50) NOT NULL,
    translation VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    exercise_type VARCHAR(50) NOT NULL,
    word_id INTEGER REFERENCES words(id) ON DELETE CASCADE NOT NULL,
    lesson_id INTEGER REFERENCES lessons(id),
    cefr_level VARCHAR(10) NOT NULL,
    question TEXT,
    options TEXT[], -- Array of options for multiple-choice questions
    correct_option TEXT, -- Correct answer for the exercise
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    word_id INTEGER REFERENCES words(id) ON DELETE CASCADE NOT NULL,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
    score INTEGER,
    completed BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE password_resets (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     token VARCHAR(255) NOT NULL,
     expires_at TIMESTAMP NOT NULL
);