# Country List API

A simple Node.js/Express API that provides a paginated list of countries with offset and limit parameters.

## Features

- Returns a list of all countries in the world
- Supports pagination through `offset` and `limit` parameters
- Lightweight and fast
- CORS enabled for cross-origin requests

## API Endpoint

### GET `/countries`

Returns a paginated list of countries.

**Parameters:**
- `offset` (optional): Starting index (default: 0)
- `limit` (optional): Number of items to return (default: 10)

**Example Request:**
GET http://localhost:3000/countries?offset=5&limit=3

**Example Response:**
{
  "results": [
    {"name": "Argentina"},
    {"name": "Armenia"},
    {"name": "Australia"}
  ],
  "count": 195
}

## Installation

1. Clone the repository:
   git clone https://github.com/saeidtofig/country-list-server.git
   cd country-list-api

2. Install dependencies:
   npm install

3. Start the server:
   npm start

   For development with auto-restart:
   npm run dev

## Usage

The API will be available at http://localhost:3000/countries.

### Basic usage:
http://localhost:3000/countries

### With pagination:
http://localhost:3000/countries?offset=10&limit=5

## Dependencies

- Express (https://expressjs.com/) - Web framework
- CORS (https://github.com/expressjs/cors) - Middleware for enabling CORS

## License

MIT

