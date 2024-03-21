
## Authentication API

### Login

- **URL:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns a JWT token if the credentials are valid.
- **Request Body:**
  - `username` (string): User's username
  - `password` (string): User's password
- **Response:** Status code 200 (OK) with a JWT token.
- **Error Responses:**
  - 400 Bad Request: If username or password is missing.
  - 400 Bad Request: If credentials are invalid.
  - 500 Internal Server Error: If there's an issue with the server.

### Signup

- **URL:** `/auth/signup`
- **Method:** `POST`
- **Description:** Registers a new user and returns a JWT token upon successful registration.
- **Request Body:**
  - `username` (string): User's username
  - `password` (string): User's password
  - `role` (string): User's role (e.g., "admin", "businessOwner", "user")
- **Response:** Status code 200 (OK) with a JWT token.
- **Error Responses:**
  - 400 Bad Request: If username, password, or role is missing.
  - 400 Bad Request: If the provided role is invalid.
  - 400 Bad Request: If the username already exists.
  - 500 Internal Server Error: If there's an issue with the server.


## Business Listing API

### Create Business Listing

- **URL:** `/business-listing`
- **Method:** `POST`
- **Description:** Create a new business listing.
- **Required Role:** Business Owner or Admin
- **Request Body:**
  - `name` (string): Name of the business listing
  - `businessPhone` (string): Phone number of the business
  - `city` (string): City where the business is located
  - `address` (string): Address of the business
  - `images` (array of strings, optional): URLs of images related to the business
- **Response:** Status code 201 (Created) with a success message.

### Get All Business Listings

- **URL:** `/business-listing`
- **Method:** `GET`
- **Description:** Retrieve all business listings.
- **Required Role:** Business Owner, User, or Admin
- **Response:** Status code 200 (OK) with an array of business listings.

### Update Business Listing

- **URL:** `/business-listing`
- **Method:** `PUT`
- **Description:** Update an existing business listing.
- **Required Role:** Business Owner
- **Request Body:**
  - `id` (number): ID of the business listing to update
  - Any other fields to update (name, businessPhone, city, address, images)
- **Response:** Status code 200 (OK) with the updated business listing.

### Delete Business Listing

- **URL:** `/business-listing/:id`
- **Method:** `DELETE`
- **Description:** Delete a business listing by ID.
- **Required Role:** Admin
- **Response:** Status code 201 (Created) with a success message.

### Get Business Listings by User ID

- **URL:** `/business-listing/user`
- **Method:** `GET`
- **Description:** Retrieve business listings associated with the logged-in user.
- **Required Role:** Business Owner
- **Response:** Status code 200 (OK) with an array of business listings.

### Get Business Listing by Business ID and User ID

- **URL:** `/business-listing/user/business/:businessId`
- **Method:** `GET`
- **Description:** Retrieve a specific business listing by business ID associated with the logged-in user.
- **Required Role:** Business Owner
- **Response:** Status code 200 (OK) with the requested business listing.

## Review API

### Create Review

- **URL:** `/reviews`
- **Method:** `POST`
- **Description:** Create a new review for a business listing.
- **Required Role:** User
- **Request Body:**
  - `businessListingId` (number): ID of the business listing being reviewed
  - `rating` (number): Rating given to the business listing (1 to 5)
  - `comment` (string): Review comment
- **Response:** Status code 201 (Created) with a success message.

### Respond to Review

- **URL:** `/reviews/reply`
- **Method:** `POST`
- **Description:** Add a response to a review as a business owner or admin.
- **Required Role:** Business Owner or Admin
- **Request Body:**
  - `reviewId` (number): ID of the review being responded to
  - `reply` (string): Response to the review
- **Response:** Status code 200 (OK) with a success message.

### Update Review

- **URL:** `/reviews`
- **Method:** `PUT`
- **Description:** Update a review's comment and rating.
- **Required Role:** User or Admin
- **Query Parameters:**
  - `reviewId` (string): ID of the review to update
- **Request Body:**
  - `comment` (string): Updated comment for the review
  - `rating` (number): Updated rating for the review
- **Response:** Status code 200 (OK) with a success message.

### Delete Review

- **URL:** `/reviews`
- **Method:** `DELETE`
- **Description:** Delete a review by ID.
- **Required Role:** User or Admin
- **Query Parameters:**
  - `reviewId` (string): ID of the review to delete
- **Response:** Status code 200 (OK) with a success message.

### Steps to Start:
- Add a `.env` file, and add the contents given
- `docker compose up`
- Creates the docker image of both nestjs and postgres app
- access the endpoints with `http://localhost:3000` as BASE URL