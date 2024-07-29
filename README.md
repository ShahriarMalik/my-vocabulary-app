# My Vocabulary App

My Vocabulary App is a full-stack application designed to help users learn and manage their vocabulary. The application is divided into two main parts: the backend, which is implemented in PHP, and the frontend, which is implemented in Angular.

## Table of Contents

- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

```
my-vocabulary-app/
├── backend/
│   ├── app/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── LessonController.php
│   │   │   ├── UserController.php
│   │   │   └── WordController.php
│   │   ├── Gateways/
│   │   ├── Helpers/
│   │   │   └── JWTCodec.php
│   │   ├── Middlewares/
│   │   │   └── AuthMiddleware.php
│   │   ├── Models/
│   │   ├── Routes/
│   │   ├── Services/
│   ├── config/
│   │   ├── config.php
│   │   └── database.php
│   ├── public/
│   │   ├── index.php
│   │   └── .htaccess
│   ├── storage/
│   │   ├── logs/
│   │   └── uploads/
│   ├── vendor/
│   ├── .env
│   ├── composer.json
│   ├── composer.lock
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── environments/
│   │   └── index.html
│   ├── .browserslistrc
│   ├── .editorconfig
│   ├── .gitignore
│   ├── angular.json
│   ├── karma.conf.js
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.spec.json
│   └── tslint.json
├── .gitignore
├── README.md
```

## Setup and Installation

### Backend Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/my-vocabulary-app.git
   cd my-vocabulary-app/backend
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
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=my_vocabulary
   DB_USERNAME=root
   DB_PASSWORD=password
   ```

4. **Start the PHP development server**:

   ```bash
   php -S localhost:8000 -t public
   ```

### Frontend Setup

1. **Switch to the `frontend` branch**:

   ```bash
   git checkout frontend
   ```

2. **Navigate to the `frontend` directory**:

   ```bash
   cd frontend
   ```

3. **Create a new Angular project** named `vocabulary-frontend`:

   ```bash
   ng new vocabulary-frontend
   ```

   When prompted:

   - **Would you like to add Angular routing?**: Yes
   - **Which stylesheet format would you like to use?**: Choose your preferred option (e.g., CSS, SCSS)

4. **Move Angular project files to the `frontend` directory**:

   ```bash
   mv vocabulary-frontend/* vocabulary-frontend/.* ./
   rmdir vocabulary-frontend
   ```

5. **Install Node.js dependencies**:

   ```bash
   npm install
   ```

6. **Serve the Angular application**:

   ```bash
   ng serve
   ```

   The application will be available at `http://localhost:4200`.

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

```

```
