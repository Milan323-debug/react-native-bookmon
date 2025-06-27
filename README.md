# Book Recommender App

A full-stack Book Recommendation application with a Node.js/Express backend and a React Native (Expo) mobile frontend. Users can sign up, log in, add books, rate them, and view recommendations.
![WhatsApp Image 2025-06-27 at 21 18 33_68084799](https://github.com/user-attachments/assets/5de898dc-cba2-4b61-bcd6-958b0c9ea302)

## Features

- User authentication (signup, login, logout)
- Add, view, and rate books
- Book images and captions
- User profile management
- Book ratings (1-5 stars)
- Cloudinary integration for image uploads
- Modern mobile UI with Expo

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React Native (Expo)
- **Authentication:** JWT
- **Image Uploads:** Cloudinary

## Project Structure

```
BOOKRECOMENDOR/
├── backend/
│   ├── package.json
│   └── src/
│       ├── index.js
│       ├── lib/
│       ├── middleware/
│       ├── models/
│       └── routes/
└── mobile/
    ├── app.json
    ├── package.json
    ├── app/
    ├── assets/
    ├── components/
    ├── constants/
    ├── lib/
    └── store/
```

## Getting Started

### Backend

1. Install dependencies:
   ```sh
   cd backend
   npm install
   ```
2. Set up a `.env` file with your MongoDB URI, JWT secret, and Cloudinary credentials.
3. Start the server:
   ```sh
   npm start
   ```

### Mobile App

1. Install dependencies:
   ```sh
   cd mobile
   npm install
   ```
2. Start the Expo development server:
   ```sh
   npx expo start
   ```
3. Use the Expo Go app or an emulator to run the app on your device.

## API Endpoints (Backend)

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — User login
- `POST /api/books` — Add a new book (auth required)
- `GET /api/books` — List all books
- `GET /api/books/:id` — Get book details
- `PUT /api/books/:id` — Update a book (auth required)
- `DELETE /api/books/:id` — Delete a book (auth required)

## Book Model Example

```js
{
  title: String, // required, unique
  caption: String, // required, unique
  image: String, // required, unique (Cloudinary URL)
  rating: Number, // required, min: 1, max: 5
  user: ObjectId, // reference to User
}
```

## License

This project is for educational purposes.
