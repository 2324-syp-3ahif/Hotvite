# Event API

This document provides information about the Event API endpoints.

**Base URL:** `http://localhost:3000/api/event`

## Create Event

Creates a new event.

**Endpoint:** `/create`

**Method:** `POST`

**Authentication:** Bearer token required

**Request:**

```json
{
  "title": "title",
  "description": "desc",
  "address": {
    "Street": "geistig Straße 123",
    "city": "cool city",
    "country": "austria",
    "state": "wien"
  },
  "location": {
    "latitude": "48.2082",
    "longitude": "16.3738"
  },
  "type": "event",
  "status": "active",
  "chat": {
    "about": "chat about stuff",
    "name": "chat name"
  },
  "created_at": 1711833523765,
  "event_start_date": 1811833533765,
  "event_end_date": 1911834533765,
  "conditions": [
    {
      "text": "min age 18"
    },
    {
      "text": "max participants 50"
    },
    {
      "text": "no pets allowed"
    }
  ]
}
```

**Response:**

```json
{
  // Response goes here
}
```

## Get All Events

Retrieves all events.

**Endpoint:** `/getAll`

**Method:** `GET`

**Response:**

```json
{
  // Response goes here
}
```

## Change Event Details

Updates the details of an event.

**Endpoint:** `/changeEventDetails`

**Method:** `POST`

**Authentication:** Bearer token required

**Request:**

```json
{
  "id": "731b6d58-e980-4597-8c9f-be3e0f2c3ac7",
  "title": "Tech Conference 123123123",
  "description": "desc1231",
  "status": "active"
}
```

**Response:**

```json
{
  // Response goes here
}
```

## Register User to Event

Registers a user to an event.

**Endpoint:** `/register`

**Method:** `POST`

**Authentication:** Bearer token required

**Request:**

```json
{
  "event_id": "1a153caf-b0a9-417f-b043-1b885633a25f"
}
```

**Response:**

```json
{
  // Response goes here
}
```

## Unregister User from Event

Unregisters a user from an event.

**Endpoint:** `/unregister`

**Method:** `POST`

**Authentication:** Bearer token required

**Request:**

```json
{
  "event_id": "1a153caf-b0a9-417f-b043-1b885633a25f"
}
```

**Response:**

```json
{
  // Response goes here
}
```

## Delete Event

Deletes an event.

**Endpoint:** `/deleteEvent`

**Method:** `DELETE`

**Authentication:** Bearer token required

**Request:**

```json
{
  "event_id": "1a153caf-b0a9-417f-b043-1b885633a25f"
}
```

**Response:**

```json
{
  // Response goes here
}
```

## Get Locations from User

Retrieves all locations from a user.

**Endpoint:** `/getLocationsFromUser`

**Method:** `GET`

**Authentication:** Bearer token required

**Response:**

```json
{
  // Response goes here
}
```