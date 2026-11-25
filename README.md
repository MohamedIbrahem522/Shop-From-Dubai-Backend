# Shop From Dubai - Backend API

REST API behind **Shop From Dubai**, a live Arabic e-commerce site I built for a freelance client.

**Frontend repo:** https://github.com/MohamedIbrahem522/Shop-From-Dubai-Frontend

## Features

- Admin login with JWT, plus change email and change password
- Super admin role for creating, editing and deleting products, categories and reviews
- Public read endpoints for products, categories and reviews
- Category soft delete, restore and hard delete
- Image uploads with Multer and Cloudinary
- Security headers (Helmet), CORS and a central error handler
- A super admin account is created on first start from environment variables

## Tech

Node.js (18+), Express 5, MongoDB with Mongoose, JWT, bcryptjs, Cloudinary, Multer, Helmet.

## Main routes

| Method | Path | Access |
|---|---|---|
| GET | `/products`, `/products/:id` | Public |
| GET | `/categories` | Public |
| POST, PUT, DELETE | `/categories`, `/categories/:id` | Super admin |
| PUT | `/categories/restore/:id` | Super admin |
| DELETE | `/categories/hard/:id` | Super admin |
| GET | `/reviews` | Public |
| POST, DELETE | `/reviews`, `/reviews/:id` | Super admin |
| POST | `/admin/auth/login` | Public |
| POST | `/admin/auth/logout` | Logged-in admin |
| PUT | `/admin/account/email`, `/admin/account/password` | Logged-in admin |

Product create and update routes are also super admin only.

## Run locally

```bash
git clone https://github.com/MohamedIbrahem522/Shop-From-Dubai-Backend.git
cd Shop-From-Dubai-Backend
npm install
npm run dev
```

Create a `.env` file with `PORT`, `MONGO_URI`, `ADMIN_EMAIL` and `ADMIN_PASSWORD`, plus the JWT secret and Cloudinary keys used in the code.

## Author

Mohamed Ibrahem - [LinkedIn](https://linkedin.com/in/mohamed-ibrahem-eg) · [Portfolio](https://my-portfolio-gamma-five-35.vercel.app/)
