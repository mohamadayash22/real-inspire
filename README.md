# Real Inspire API

Free and open source inspirational quotes API.
This API offers an extensive collection of quotes sourced from various authors.

### API Server

```
https://api.realinspire.tech/v1/
```

### API Documentation

- [Get random quote](#get-random-quote)
- [List quotes](#list-quotes)
- [List authors](#list-authors)
- [Get author by slug](#get-author-by-slug)

### Get random quote

```HTTP
GET /quotes/random
```

Returns one or more random quotes from the database.

By default, this endpoint returns a single random quote. However, you can define the number of random quotes you want to receive using the limit parameter.

**Query Parameters**
| Parameter | Type | Description |
| --------- | -------- | --------------------------------------------------------------------------- |
| limit | `Int` | `default: 1` `min: 1` `max: 20` <br>The number of random quotes to fetch |
| minLength | `Int` | The minimum length in characters |
| maxLength | `Int` | The maximum length in characters |
| author | `String` | Get a random quote by author. The value can be an author `name` or `slug` |

**Response**

```ts
Array<{
  // Text of the quote
  content: string;
  // Author full name
  author: string;
  // URL-friendly identifier of the author
  authorSlug: string;
  // Character count of the quote
  length: number;
}>;
```

**Examples**

Get a single random quote [try in browser](https://api.realinspire.tech/v1/quotes/random)

```HTTP
GET /quotes/random
```

Get 5 random quotes [try in browser](https://api.realinspire.tech/v1/quotes/random?limit=5)

```HTTP
GET /quotes/random?limit=5
```

Random quote with maximum length of 100 characters [try in browser](https://api.realinspire.tech/v1/quotes/random?maxLength=100)

```HTTP
GET /quotes/random?maxLength=100
```

Random quote with a length between 100 and 150 characters [try in browser](https://api.realinspire.tech/v1/quotes/random?minLength=100&maxLength=150)

```HTTP
GET /quotes/random?minLength=100&maxLength=150
```

<br>

### List quotes

```HTTP
GET /quotes
```

List all quotes matching a given query. By default, this will return a paginated list of all quotes.

**Query Parameters**
| Parameter | Type | Description |
| --------- | -------- | -------------------------------------------------------------------------------------- |
| limit | `Int` | `default: 1` `min: 1` `max: 20` <br>The number of quotes to fetch |
| page | `Int` | `default: 1` `min: 1` <br>The page of results to return |
| minLength | `Int` | The minimum length in characters |
| maxLength | `Int` | The maximum length in characters |
| author | `String` | Get quotes by a specific author. The value can be an author `name` or `slug` |
| sortBy | `String` | Specifies the property and order to sort the quotes. The format is `property:order`. Valid properties are `author`, `content`, `length`. Valid orders are `asc` (ascending) and `desc` (descending).|

**Response**

```ts
{
  // Total count of quotes
  totalItems: number,
  // Current page number
  currentPage: number,
  // Number of quotes displayed per page
  pageSize: number,
  // Total count of pages
  totalPages: number,
  // Array containing quotes data
  results: Array<{
    // Text of the quote
    content: string,
    // Full name of quote author
    author: string,
    // URL-friendly identifier of the author
    authorSlug: string,
    // Character count of the quote
    length: number
  }>
}
```

**Examples**

Get the first page of quotes [try in browser](https://api.realinspire.tech/v1/quotes)

```HTTP
GET /quotes
```

Get quotes by a specific author [try in browser](https://api.realinspire.tech/v1/quotes?author=albert-einstein)

```HTTP
GET /quotes?author=albert-einstein
```

Get quotes sorted by length in descending order [try in browser](https://api.realinspire.tech/v1/quotes?sortBy=length:desc)

```HTTP
GET /quotes?sortBy=length:desc
```

<br>

### List authors

```HTTP
GET /authors
```

List all authors matching a given query. Be default, this will return a paginated list of all authors.

| Parameter | Type     | Description                                                                                                                                                                                  |
| --------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| limit     | `Int`    | `default: 1` `min: 1` `max: 20` <br>The number of authors to fetch                                                                                                                           |
| page      | `Int`    | `default: 1` `min: 1` <br>The page of results to return                                                                                                                                      |
| sortBy    | `String` | Specifies the property and order to sort the authors. The format is `property:order`. Valid properties are `name`, `quoteCount`. Valid orders are `asc` (ascending) and `desc` (descending). |

**Response**

```ts
{
  // Total count of authors
  totalItems: number,
  // Current page number
  currentPage: number,
  // Number of authors displayed per page
  pageSize: number,
  // Total count of pages
  totalPages: number,
  // Array containing authors data
  results: Array<{
    // Author full name
    name: string,
    // URL-friendly identifier of the author
    slug: string,
    // Single line description of the other
    description: string,
    // Short biography of the author, sourced from the Wikipedia API
    bio: string,
    // Count of quotes attributed to the author
    quoteCount: number
  }>
}
```

**Examples**

Get the first page of authors [try in browser](https://api.realinspire.tech/v1/authors)

```HTTP
GET /authors
```

Get all authors sorted alphabetically by name [try in browser](https://api.realinspire.tech/v1/authors?sortBy=name:asc)

```HTTP
GET /authors?sortBy=name:asc
```

Get all authors sorted by the number of quotes in descending order [try in browser](https://api.realinspire.tech/v1/authors?sortBy=quoteCount:desc)

```HTTP
GET /authors?sortBy=quoteCount:desc
```

<br>

### Get author by slug

Get a single author by `slug` or `name`

This endpoint will return a specific author details like name, slug, description, bio, and the number of quotes by the author.

```HTTP
GET /authors/:slug
```

**Response**

```ts
{
  // Author full name
  name: string,
  // URL-friendly identifier of the author
  slug: string,
  // Single line description of the other
  description: string,
  // Short biography of the author, sourced from the Wikipedia API
  bio: string,
  // Count of quotes attributed to the author
  quoteCount: number
}
```
