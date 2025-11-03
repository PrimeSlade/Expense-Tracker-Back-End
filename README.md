# Expense Tracker - Backend API

**Node.js/Express backend API** for an expense tracking application. Features PostgreSQL database with Knex.js, JWT authentication with token rotation, bcrypt password hashing, and Cloudinary image storage.

## Features

- **User Authentication**: JWT-based authentication with access and refresh tokens
- **Token Rotation**: Automatic token refresh with 15-minute access tokens and 7-day refresh tokens
- **Secure Password Storage**: Bcrypt password hashing
- **Expense Management**: Full CRUD operations for expense lists
- **User Profile Management**: Update user info, password, and profile images
- **Currency Support**: Multi-currency support with custom currency settings
- **Image Upload**: Profile image upload via Cloudinary
- **Protected Routes**: Middleware-based route protection

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Knex.js
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **File Upload**: Multer
- **Image Storage**: Cloudinary
- **CORS**: cors
- **Cookie Parser**: cookie-parser

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Expense-Tracker-Back-End
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=3000
SECRETKEY=your_access_token_secret
SECRETREFRESHKEY=your_refresh_token_secret
DATABASE_URL=postgresql://username:password@localhost:5432/expense_tracker
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Set up the database:

```bash
# Run Knex migrations (if available)
npx knex migrate:latest
```

5. Start the development server:

```bash
npm run start:dev
```

The server will start on the port specified in your `.env` file (default: 3000).

## API Endpoints

### Authentication Routes

| Method | Endpoint            | Description          | Auth Required |
| ------ | ------------------- | -------------------- | ------------- |
| POST   | `/api/auth/signup`  | Register a new user  | No            |
| POST   | `/api/auth/login`   | Login user           | No            |
| POST   | `/api/auth/logout`  | Logout user          | No            |
| POST   | `/api/auth/refresh` | Refresh access token | No            |

### User Routes

All user routes require authentication (JWT token in cookies).

| Method | Endpoint                | Description                     |
| ------ | ----------------------- | ------------------------------- |
| PUT    | `/user/update`          | Update user information         |
| PUT    | `/user/password`        | Update user password            |
| PATCH  | `/user/currency/update` | Update user currency preference |
| PATCH  | `/user/amount/add`      | Add amount to user balance      |
| GET    | `/user/amount`          | Get user balance                |
| POST   | `/user/profile/upload`  | Upload profile image            |

### Expense List Routes

All list routes require authentication (JWT token in cookies).

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| POST   | `/lists/create`     | Create a new expense list |
| GET    | `/lists/view`       | Get all expense lists     |
| PUT    | `/lists/update/:id` | Update an expense list    |
| DELETE | `/lists/remove/:id` | Delete an expense list    |

## Authentication Flow

1. **Registration**: User signs up with credentials
2. **Login**: User receives access token (15s expiry) and refresh token (7d expiry) via HTTP-only cookies
3. **Token Rotation**: Access token automatically refreshes using the refresh token endpoint
4. **Protected Routes**: All user and list operations require valid JWT authentication

## Project Structure

```
Expense-Tracker-Back-End/
├── app.js                      # Main application entry point
├── controllers/
│   ├── authController/         # Authentication logic
│   │   ├── register.js
│   │   ├── login.js
│   │   ├── logout.js
│   │   ├── refresh.js
│   │   └── amount.js
│   ├── userController/         # User management logic
│   │   ├── editUser.js
│   │   ├── editCurrency.js
│   │   ├── addAmount.js
│   │   └── uploadHandler.js
│   └── listController/         # Expense list logic
│       ├── create.js
│       ├── displayLists.js
│       ├── edit.js
│       └── deleteList.js
├── middleware/
│   ├── requireAuth.js          # JWT authentication middleware
│   └── validateFile.js         # File validation middleware
├── routes/
│   ├── route.js                # Authentication routes
│   └── operationRoutes.js      # Protected operation routes
├── utils/
│   ├── tokenGenerator.js       # JWT token generation
│   ├── amountSelector.js       # Amount calculation utilities
│   ├── typeSelector.js         # Type selection utilities
│   └── updateAmount.js         # Amount update utilities
├── knex/
│   └── knex.js                 # Database configuration
├── package.json
└── .env                        # Environment variables
```

## Security Features

- **HTTP-only Cookies**: Tokens stored in HTTP-only cookies to prevent XSS attacks
- **CORS Protection**: Configured CORS with credentials support
- **Password Hashing**: Bcrypt with salt rounds for secure password storage
- **Token Expiration**: Short-lived access tokens (15s) with refresh token rotation
- **Protected Routes**: Middleware authentication on all sensitive endpoints
- **File Validation**: Image upload validation middleware

## Development

Start the development server with auto-reload:

```bash
npm run start:dev
```

## Environment Variables

| Variable              | Description                  | Required |
| --------------------- | ---------------------------- | -------- |
| PORT                  | Server port number           | Yes      |
| SECRETKEY             | JWT access token secret key  | Yes      |
| SECRETREFRESHKEY      | JWT refresh token secret key | Yes      |
| DATABASE_URL          | PostgreSQL connection string | Yes      |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name        | Yes      |
| CLOUDINARY_API_KEY    | Cloudinary API key           | Yes      |
| CLOUDINARY_API_SECRET | Cloudinary API secret        | Yes      |
