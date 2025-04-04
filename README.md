# Calculator

## Overview

The Average Calculator HTTP Microservice is designed to expose a REST API that retrieves numbers from a third-party test server and calculates the moving average of the latest numbers within a specified window size.

-Supports fetching numbers based on predefined categories: prime (p), Fibonacci (f), even (e), and random (r).
-Maintains a unique set of numbers within a fixed window size.
-Discards duplicates and ignores API responses that exceed 500ms.
-Provides real-time updates on the stored numbers and their average.

### Installation

1. clone repo
```
git clone https://github.com/AdityasWorks/E22CSEU0979.git
cd E22CSEU0979/Calculator
```
2. Install dependencies:

```
 npm install 
```
3. Create a .env file in each folder using the env.example file:

for eg:
```
PORT=
AUTH_TOKEN=
```
4. run server.js
   ```
   node server.js
   ```

# Social Media Analytics Microservice

## Overview

This is a Node.js-based microservice that fetches and analyzes user activity from a social media platform. It provides APIs to retrieve:

- The top five users with the highest number of posts.

- The latest posts.

- The most popular posts based on comment count.

### Installation

1. clone repo
```
git clone https://github.com/AdityasWorks/E22CSEU0979.git
cd E22CSEU0979/socialMedia
```
2. Install dependencies:

```
 npm install 
```
3. Create a .env file in each folder using the env.example file:

for eg:
```
PORT=
BASE_URL=
AUTH_TOKEN=
```
4. run server.js
   ```
   node server.js
   ```

