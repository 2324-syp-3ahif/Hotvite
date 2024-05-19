# User API

This document provides information about the User API endpoints.

**Base URL:** `http://localhost:3000/api/user`

For Example: `http://localhost:3000/api/user/signup`

## Signup

Creates a new user.

**Endpoint:** `/signup`

**Method:** `POST`

**Request:**

```json
{
  "username": "testname",
  "email": "test12@gmail.com",
  "password": "123pw",
  "aboutme": "about me blabla"
}
```

**Response:**

```json
{
    // Response goes here
}
```

## Login

Authenticates a user.

**Endpoint:** `/login`
**Method:** `POST`

**Request:**

```json
{
  "email": "test12@gmail.com",
  "password": "123pw"
}
```

**Response:**

```json
{
  // Response goes here
}
```

## Change Username

Updates the username of an authenticated user.

**Endpoint:** `/changeUsername`

**Method:** `PUT`

**Authentication:** Bearer token required

**Request:**

```json
{
  "username": "asdoijsaldjasl"
}
```

**Response:**

```json
{
  // Response goes here
}
```

## Delete User

Deletes an authenticated user.

**Endpoint:** `/delete`

**Method:** `DELETE`

**Authentication:** Bearer token required

**Request:**

```json
{
  // No body required
}
```

**Response:**

```json
{
  // Response goes here
}
```