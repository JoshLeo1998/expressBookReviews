const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
let books = require('./router/booksdb.js');  // Ensure this path is correct
let { isValid, users, authenticated } = require('./router/auth_users.js');  // Import authenticated route
const public_users = express.Router();

// Use body-parser middleware to parse request bodies
const app = express();
app.use(bodyParser.json());  // Apply body-parser middleware globally

public_users.use(bodyParser.json());  // Ensure body-parser is applied here

// Secret key for JWT
const secretKey = "your_secret_key";

// Endpoint to get all books
public_users.get('/', function (req, res) {
  const jsonString = JSON.stringify(books, null, 2); // Pretty print with 2 spaces
  return res.status(200).json(JSON.parse(jsonString));
});

// Endpoint to get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Assuming books is an object with ISBN as keys

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Endpoint to get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // Retrieve the author from the request parameters
  const booksByAuthor = [];

  // Iterate through the books object
  for (let isbn in books) {
    if (books[isbn].author === author) {
      booksByAuthor.push(books[isbn]);
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Endpoint to get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title; // Retrieve the title from the request parameters
  const booksByTitle = [];

  // Iterate through the books object
  for (let isbn in books) {
    if (books[isbn].title === title) {
      booksByTitle.push(books[isbn]);
    }
  }

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Endpoint to get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Assuming books is an object with ISBN as keys

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

// Endpoint to register a new user
public_users.post('/register', function (req, res) {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

app.use('/public_users', public_users);
app.use('/auth_users', authenticated);  // Add the authenticated route

const port = 2000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});






