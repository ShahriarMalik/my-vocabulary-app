### VokabelProfi - German Vocabulary Learning Platform

VokabelProfi is a comprehensive web application designed to help users learn and manage German vocabulary. It features interactive exercises, real-time progress tracking, multi-device support, and administrative tools. The platform provides personalized learning experiences, supports multiple languages through internationalization (i18n), and ensures a responsive user interface across different devices.

#### Live Demo:

You can try out the application at: [VokabelProfi Live Demo](https://vokabelprofi.shahriar-malik.de/)

## Table of Contents

- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Git Ignore](#git-ignore)
- [Database Schema](#database-schema-overview)

## Project Structure

### Frontend Structure

```
frontend/
├── .netlify/
├── node_modules/
├── vocabulary-frontend/
│   ├── .angular/                   # Angular CLI and project configuration files
│   ├── .vscode/                    # Visual Studio Code workspace settings
│   ├── dist/                       # Distribution folder for production build
│   ├── node_modules/               # Node.js modules and dependencies
│   ├── public/                     # Public assets and files
│   └── src/                        # Main source code directory
│       ├── app/                    # Angular application directory
│       │   ├── core/               # Core services and shared functionality
│       │   ├── features/           # Feature modules for different app functionalities
│       │   │   ├── admin/          # Admin panel components and services
│       │   │   ├── authentication/ # Authentication components and services
│       │   │   ├── exercises/      # Components for exercises and quizzes
│       │   │   ├── home/           # Home page components
│       │   │   ├── learn/          # Learning components and services
│       │   │   ├── progress/       # User progress tracking and components
│       │   │   └── tips/           # Learning tips and related components
│       │   ├── shared/             # Shared modules, components, and services
│       │   │   └── components/     # Reusable components across the application
│       │   │       ├── audio-player/          # Audio player component
│       │   │       ├── cefr-lesson-selector/  # Selector for CEFR lessons
│       │   │       ├── confirm-dialog/        # Confirmation dialog component
│       │   │       ├── footer/                # Footer component
│       │   │       ├── navbar/                # Navbar component
│       │   │       ├── notice/                # Notification component
│       │   │       └── paginator/             # Pagination component
│       │   ├── app.component.css              # Global styles for the app component
│       │   ├── app.component.html             # Main template for the app component
│       │   ├── app.component.spec.ts          # Unit tests for the app component
│       │   ├── app.component.ts               # Main app component logic
│       │   ├── app.config.server.ts           # Server configuration for the app
│       │   ├── app.config.ts                  # General app configuration
│       │   ├── app.routes.ts                  # Application routing configuration
│       │   ├── locale/                        # i18n localization files
│       │   ├── base-url.dev.ts                # Base URL for development environment
│       │   ├── base-url.prod.ts               # Base URL for production environment
│       │   ├── index.html                     # Main entry point for the application
│       │   ├── main.ts                        # Bootstrap file for the Angular app
│       │   └── styles.css                     # Global styles for the application
│   ├── .editorconfig                          # Editor configuration file
│   ├── .gitignore                             # Git ignore file
│   ├── angular.json                           # Angular project configuration
│   ├── karma.conf.js                          # Karma configuration for unit testing
│   ├── package.json                           # Node.js project dependencies
│   ├── README.md                              # Project README file
│   ├── tsconfig.app.json                      # TypeScript configuration for the app
│   ├── tsconfig.json                          # Root TypeScript configuration
│   ├── tsconfig.spec.json                     # TypeScript configuration for unit tests
│   └── tslint.json                            # TSLint configuration for linting
```

### Backend Structure

```
backend/
├── app/                               # Application logic
│   ├── Controllers/                   # Controllers handle HTTP requests
│   │   ├── AuthController.php         # Manages authentication logic
│   │   ├── ExerciseController.php     # Handles exercise-related requests
│   │   ├── LessonController.php       # Manages lesson-related requests
│   │   ├── UserController.php         # Handles user-related requests
│   │   ├── UserProgressController.php # Tracks user progress
│   │   └── WordController.php         # Handles word-related requests
│   ├── Gateways/                      # Gateways manage data flow and interact with the database
│   │   ├── ExerciseGateway.php
│   │   ├── ExerciseGatewayInterface.php
│   │   ├── LessonGateway.php
│   │   ├── LessonGatewayInterface.php
│   │   ├── PasswordResetGateway.php
│   │   ├── RefreshTokenGateway.php
│   │   ├── RefreshTokenGatewayInterface.php
│   │   ├── UserGateway.php
│   │   ├── UserGatewayInterface.php
│   │   ├── UserProgressGateway.php
│   │   ├── UserProgressGatewayInterface.php
│   │   ├── WordGateway.php
│   │   └── WordGatewayInterface.php
│   ├── Helpers/                       # Helper classes for additional functionality
│   │   ├── JWTCodec.php               # Handles JWT encoding and decoding
│   │   ├── Mailer.php                 # Manages email sending functionality
│   │   ├── S3Helper.php               # Interacts with AWS S3 for file storage
│   │   └── WordDataHelper.php         # Helper functions for word data manipulation
│   ├── Middleware/                    # Middleware for request processing
│   │   └── AuthMiddleware.php         # Handles authentication checks
│   ├── Models/                        # Data models representing database entities
│   ├── Routes/                        # Routing configuration
│   ├── Services/                      # Services providing business logic
│   ├── config/                        # Configuration files
│   │   ├── config.php                 # Application configuration
│   │   └── database.php               # Database configuration
│   ├── public/                        # Publicly accessible files (e.g., index.php, .htaccess)
│   │   ├── audio/                     # Audio files for exercises
│   │   └── index.php                  # Entry point for the application
│   ├── storage/                       # Storage for logs and uploads
│   ├── tests/                         # Unit and integration tests
│   ├── vendor/                        # Composer dependencies
│   ├── .env                           # Environment variables
│   ├── composer.json                  # Composer configuration file
│   ├── composer.lock                  # Composer lock file
│   ├── phpunit.xml                    # PHPUnit configuration file
│   └── README.md                      # Backend-specific README file
```

## Setup and Installation

### Frontend Setup

1. **Navigate to the `frontend` directory**:

   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**:

   ```bash
   npm install
   ```

3. **Serve the Angular application**:

   ```bash
   ng serve
   ```

   The application will be available at `http://localhost:4200`.

### Backend Setup

1. **Navigate to the `backend` directory**:

   ```bash
   cd backend
   ```

2. **Install Composer dependencies**:

   ```bash
   composer install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the `backend` directory and add your environment variables:

   ```plaintext
   APP_ENV=local
   APP_DEBUG=true
   APP_KEY=base64:your_app_key
   DB_CONNECTION=pgsql
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_DATABASE=my_vocabulary
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

4. **Start the PHP development server**:

   ```bash
   php -S localhost
   ```

:8000 -t public

````

## Usage

1. **Open your browser** and navigate to `http://localhost:4200` to access the frontend.
2. **Use Postman or any API client** to interact with the backend at `http://localhost:8000`.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Additional Features and Details:

- **Responsive Design**: Built with Angular Material for seamless performance across desktop and mobile devices. The application supports theming (light/dark modes) and internationalization (i18n) to enhance user experience.

- **Dynamic Exercise Component**: Users can select a CEFR level and corresponding lessons through responsive dropdowns. This component dynamically loads multiple-choice questions with pagination, error handling, and form validation.

- **User Progress Tracking**: Detailed progress tracking across CEFR levels and lessons, with dynamic charts displaying user progress.

- **User Progress Saving**: Automatically saves user progress as they complete exercises, ensuring continuity across sessions.

- **Administrator Features**: Administrators can manage vocabulary content and exercises directly within the application, ensuring the platform remains up-to-date and relevant for learners.

- **Translation & Audio Services**: Integrated with DeepL and Google Translation APIs for translation and audio pronunciation services, enriching the learning experience.

---

## Git Ignore

The following files and directories are ignored by the `.gitignore` file in this project:

- **Node Modules and Dependencies**:

- `node_modules/`
- `vendor/`

- **Environment Files**:

- `*.env`

- **IDE Configuration Files**:

- `.idea/`
- `.vscode/`

- **Log Files**:

- `storage/logs/`

- **Optional Files**:

- `composer.lock`

- **System Files**:
- `.DS_Store`

## Database Schema Overview

The database schema for **VokabelProfi - German Vocabulary Learning Platform** is designed to support the application's core functionality, including user management, vocabulary management, exercises, translations, and progress tracking. Below is an overview of the tables and their relationships. For a detailed visualization of the database schema, please refer to the PDF in the `sql` folder.

### Tables:

1. **Users Table**

- Stores user information including username, email, password hash, and role (defaulting to 'user').
- Relationships:
  - References user progress, refresh tokens, and password resets.

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(50) DEFAULT 'user' NOT NULL
);
````

2. **Lessons Table**

   - Represents lessons associated with different CEFR levels.
   - Relationships:
     - References words and exercises.

   ```sql
   CREATE TABLE lessons (
       id SERIAL PRIMARY KEY,
       cefr_level VARCHAR(10) NOT NULL,
       lesson_number INTEGER NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Words Table**

   - Stores German words, their CEFR levels, and associated lesson IDs.
   - Includes additional fields for part of speech, pronunciation URL, emoji, and example sentences.
   - Relationships:
     - References lessons and translations.

   ```sql
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
   ```

4. **Translations Table**

   - Stores translations of words into different languages.
   - Relationships:
     - References words with a cascading delete option.

   ```sql
   CREATE TABLE translations (
       id SERIAL PRIMARY KEY,
       word_id INTEGER REFERENCES words(id) ON DELETE CASCADE NOT NULL,
       language VARCHAR(50) NOT NULL,
       translation VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
   );
   ```

5. **Exercises Table**

   - Stores exercises related to specific words and lessons.
   - Includes fields for exercise type, questions, multiple-choice options, and the correct answer.
   - Relationships:
     - References words and lessons with cascading delete on word deletion.

   ```sql
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
   ```

6. **User Progress Table**

   - Tracks user progress across CEFR levels, lessons, words, and exercises.
   - Stores completion status and scores for words, exercises, lessons, and CEFR levels.
   - Relationships:
     - References users, lessons, words, and exercises with cascading deletes.

   ```sql
   CREATE TABLE user_progress (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      cefr_level VARCHAR(10),
      lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE NOT NULL,
      word_id INTEGER REFERENCES words(id) ON DELETE CASCADE NOT NULL,
      word_score INTEGER,
      word_completed BOOLEAN NOT NULL DEFAULT FALSE,
      exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
      exercise_score INTEGER,
      exercise_completed BOOLEAN DEFAULT FALSE,
      lesson_completed BOOLEAN DEFAULT FALSE,
      cefr_level_completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
   );
   ```

7. **Refresh Tokens Table**

   - Stores refresh tokens for maintaining user sessions.
   - Relationships:
     - References users with a cascading delete option.

   ```sql
   CREATE TABLE refresh_tokens (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
       token VARCHAR(255) NOT NULL,
       expires_at TIMESTAMP NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
   );
   ```

8. **Password Resets Table**

   - Stores tokens for password reset requests.
   - Relationships:
     - References users with a cascading delete option.

   ```sql
   CREATE TABLE password_resets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL
   );
   ```

### Relationships Overview:

- **One-to-Many**:

  - **Users** ↔ **User Progress**
  - **Lessons** ↔ **Words**
  - **Lessons** ↔ **Exercises**
  - **Words** ↔ **Translations**
  - **Words** ↔ **Exercises**

- **Cascading Deletes**:
  - If a **Word** is deleted, all associated **Translations** and **Exercises** are deleted.
  - If a **User** is deleted, all associated **Progress** and **Refresh Tokens** are deleted.
  - If a **Lesson** is deleted, all associated **Words**, **Exercises**, and **Progress** are deleted.

This schema efficiently handles user management, vocabulary exercises, and user progress tracking, ensuring that relationships between entities are maintained while providing robust cascading deletes to maintain data integrity.
