# Library Management System

## Description

Library Management System is a simple web application developed using HTML, CSS, and JavaScript. It allows users to register, log in, borrow and return books, while librarians can manage the library by adding and deleting books.

## Features

### Authentication
- User registration
- User login
- Logout

### Member
- View all library books
- Borrow available books
- Return borrowed books
- View personal borrowed books

### Librarian
- Add new books
- Delete books
- Search books by title
- View all library books
- View borrowed books with borrower information

### Book Information
Each book contains:
- ID
- Title
- Author
- Genre
- Borrow status
- Borrow date
- Borrower information

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- LocalStorage

## Project Structure

```
Library-Management-System/
│
├── index.html
├── library.css
├── library.js
├── icon/
│   └── icon.png
└── README.md
```

## Default Accounts

### Librarian

Email:
```
admin@gmail.com
```

Password:
```
Admin123!
```

### Member

Email:
```
user@gmail.com
```

Password:
```
User123!
```

## How to Run

1. Download or clone the project.
2. Open `index.html` in your browser.
3. Register a new account or log in using one of the default accounts.

## Data Storage

The application stores all users and books using the browser's LocalStorage. No database is required.

## Future Improvements

- Edit book information
- Search by author or genre
- Better role-based permissions
- Responsive design improvements
- Persian date formatting
- Pagination for book lists

## Author

Developed as a JavaScript practice project.