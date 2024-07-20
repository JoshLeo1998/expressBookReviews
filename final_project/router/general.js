const express = require('express');
const axios = require('axios'); // Import Axios
const bodyParser = require('body-parser'); // Import body-parser
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Use body-parser middleware to parse request bodies
public_users.use(bodyParser.json());

public_users.post("/register", (req, res) => {
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

  // Add the new user to the users list
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop using Axios with async-await
public_users.get('/', async function (req, res) {
    try {
      // Simulate an API call to fetch books
      const response = await axios.get('http://localhost:2000/api/books'); // Replace with your actual endpoint
      const books = response.data;
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
  });

// Simulated endpoint for fetching books
public_users.get('/api/books', function (req, res) {
    const jsonString = JSON.stringify(books, null, 2); // Pretty print with 2 spaces
    return res.status(200).json(JSON.parse(jsonString));
  });

// Get book details based on ISBN using Axios with async-await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
    try {
      // Simulate an API call to fetch book details by ISBN
      const response = await axios.get(`http://localhost:2000/api/books/${isbn}`); // Replace with your actual endpoint
      const book = response.data;
      if (book) {
        return res.status(200).json(book);
      } else {
        return res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
  });
  
  // Simulated endpoint for fetching book details by ISBN
  public_users.get('/api/books/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
    const book = books[isbn]; // Assuming books is an object with ISBN as keys
  
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  
// Get book details based on author using Axios with async-await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author; // Retrieve the author from the request parameters
    try {
      // Simulate an API call to fetch book details by author
      const response = await axios.get(`http://localhost:2000/api/books/author/${author}`); // Replace with your actual endpoint
      const booksByAuthor = response.data;
      if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
      } else {
        return res.status(404).json({ message: "No books found by this author" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
  });
  
  // Simulated endpoint for fetching book details by author
  public_users.get('/api/books/author/:author', function (req, res) {
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

// Get book details based on title using Axios with async-await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title; // Retrieve the title from the request parameters
    try {
      // Simulate an API call to fetch book details by title
      const response = await axios.get(`http://localhost:2000/api/books/title/${title}`); // Replace with your actual endpoint
      const booksByTitle = response.data;
      if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
      } else {
        return res.status(404).json({ message: "No books found with this title" });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books by title", error: error.message });
    }
  });
  
  // Simulated endpoint for fetching book details by title
  public_users.get('/api/books/title/:title', function (req, res) {
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

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
  const book = books[isbn]; // Assuming books is an object with ISBN as keys

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
