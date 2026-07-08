//Elements -->

// Tabs
const loginTab = document.querySelector("#loginTab");
const registerTab = document.querySelector("#registerTab");

// Forms
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");

// Login
const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");

// Register
const registerEmail = document.querySelector("#registerEmail");
const registerPassword = document.querySelector("#registerPassword");
const roleSelect = document.querySelector("#role");

// Dashboard
const dashboard = document.querySelector("#dashboard");
const authSection = document.querySelector("#authSection");

const welcome = document.querySelector("#welcome");

const borrowBtn = document.querySelector("#borrowBtn");
const returnBtn = document.querySelector("#returnBtn");
const myBooksBtn = document.querySelector("#myBooksBtn");
const libraryBooksBtn = document.querySelector("#libraryBooksBtn");
const addBookBtn = document.querySelector("#addBookBtn");
const userBooksBtn = document.querySelector("#userBooksBtn");
const logoutBtn = document.querySelector("#logoutBtn");

const resultBox = document.querySelector("#resultBox");

const message = document.querySelector(".message");
const addBookModal = document.querySelector("#addBookModal");
const submitAddBook = document.querySelector("#submitAddBook");
const closeModal = document.querySelector("#closeModal");

const modalTitle = document.querySelector("#modalTitle");
const modalAuthor = document.querySelector("#modalAuthor");
const deleteBookModal = document.querySelector("#deleteBookModal");
const submitDeleteBook = document.querySelector("#submitDeleteBook");
const closeDeleteModal = document.querySelector("#closeDeleteModal");
const deleteBookId = document.querySelector("#deleteBookId");
const formError = document.querySelector("#formError");

const borrowedListBtn = document.querySelector("#borrowedListBtn");

const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
//Enums -->

//Role Enum

const Role = {
  Member: 0,

  Librarian: 1,
};

//genre Enum

const Genre = {
  Scientific: "Scientific",
  Cultural: "Cultural",
  Sports: "Sports",
  Specialized: "Specialized",
};

//Book Enum
class Book {
  constructor(
    id,
    title,
    author,
    genre,
    isBorrowed = false,
    borrowedBy = null,
    borrowedDate = null,
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.isBorrowed = isBorrowed;
    this.borrowedBy = borrowedBy;
    this.borrowedDate = borrowedDate;
  }
}
//Users Enum

class User {
  constructor(id, email, password, role) {
    this.id = id;

    this.email = email;

    this.password = password;

    this.role = role;

    this.borrowedBooks = [];
  }
}

//Storage Enum

class Storage {
  static users = [];

  static books = [];

  static currentUser = null;
}

function saveData() {
  localStorage.setItem("users", JSON.stringify(Storage.users));

  localStorage.setItem("books", JSON.stringify(Storage.books));
}

function loadData() {
  const users = localStorage.getItem("users");
  const books = localStorage.getItem("books");

  if (users) {
    const parsedUsers = JSON.parse(users);

    Storage.users = parsedUsers.map((user) => {
      const newUser = new User(user.id, user.email, user.password, user.role);

      newUser.borrowedBooks = user.borrowedBooks;

      return newUser;
    });
  }

  if (books) {
    const parsedBooks = JSON.parse(books);

    Storage.books = parsedBooks.map(
      (book) =>
        new Book(
          book.id,
          book.title,
          book.author,
          book.isBorrowed,
          book.borrowedBy,
        ),
    );
  }
}

loadData();

// Books seed
if (Storage.books.length === 0) {
  Storage.books = [
    new Book(1, "Harry Potter", "J.K Rowling", "Scientific"),
    new Book(2, "Percy Jackson", "Rick Riordan", "Cultural"),
    new Book(3, "The Sun and the Star", "Rick Riordan", "Cultural"),
    new Book(4, "House of Hades", "Rick Riordan", "Specialized"),
    new Book(5, "The Curse of Athena", "Rick Riordan", "Specialized"),
  ];
}

// Users seed
if (Storage.users.length === 0) {
  Storage.users = [
    new User(1, "admin@gmail.com", "Admin123!", Role.Librarian),
    new User(2, "user@gmail.com", "User123!", Role.Member),
  ];
}

saveData();

// Authentication

class AuthenticationService {
  static Login(email, password) {
    const user = Storage.users.find((user) => user.email === email);

    if (!user) {
      return "User not found.";
    }

    if (user.password !== password) {
      return "Wrong email or password.";
    }

    Storage.currentUser = user;

    return "Login successful.";
  }

  static Register(email, password, role) {
    const existingUser = Storage.users.find((user) => user.email === email);

    if (existingUser) {
      return "Email already exists.";
    }

    const newUser = new User(Date.now(), email, password, role);

    Storage.users.push(newUser);

    saveData();

    return "Registration successful.";
  }
}

// LibraryService
class LibraryService {
  static SearchBook(keyword) {
    return Storage.books.filter((book) =>
      book.title.toLowerCase().includes(keyword.toLowerCase()),
    );
  }

  static BorrowBook(bookId) {
    if (!Storage.currentUser) {
      return "Please login first.";
    }

    const book = Storage.books.find((b) => b.id === bookId);

    if (!book) {
      return "Book not found.";
    }

    if (book.isBorrowed) {
      return "This book is already borrowed.";
    }

    book.isBorrowed = true;
    book.borrowedBy = Storage.currentUser.id;
    book.borrowedDate = new Date();

    Storage.currentUser.borrowedBooks.push(book.id);

    saveData();

    return `"${book.title}" borrowed successfully.`;
  }

  static ReturnBook(bookId) {
    if (!Storage.currentUser) {
      return "Please login first.";
    }

    const book = Storage.books.find((b) => b.id === bookId);

    if (!book) {
      return "Book not found.";
    }

    if (!book.isBorrowed) {
      return "This book is not borrowed.";
    }

    if (book.borrowedBy !== Storage.currentUser.id) {
      return "You cannot return this book.";
    }

    book.isBorrowed = false;
    book.borrowedBy = null;
    book.borrowedDate = null;

    Storage.currentUser.borrowedBooks =
      Storage.currentUser.borrowedBooks.filter((id) => id !== bookId);

    saveData();

    return `"${book.title}" returned successfully.`;
  }

  static GetListOfUserBooks() {
    if (!Storage.currentUser) {
      return "Please login first.";
    }

    const books = Storage.books.filter((book) =>
      Storage.currentUser.borrowedBooks.includes(book.id),
    );

    if (books.length === 0) {
      return "No borrowed books.";
    }

    return books;
  }

  static GetListOfLibraryBooks() {
    return Storage.books;
  }

  static AddBook(id, title, author, genre) {
    const exists = Storage.books.find((b) => b.id === id);

    if (exists) {
      return "This ID already exists.";
    }

    const book = new Book(id, title, author, genre);

    saveData();

    return "Book added successfully.";
  }

  static DeleteBook(bookId) {
    const index = Storage.books.findIndex((book) => book.id === bookId);

    if (index === -1) {
      return "Book not found.";
    }

    if (Storage.books[index].isBorrowed) {
      return "Cannot delete a borrowed book.";
    }

    Storage.books.splice(index,1);

    saveData();

    return "Book deleted successfully.";
  }

  static GetBorrowedBooks() {
    return Storage.books.filter((book) => book.isBorrowed);
  }

  static GetListOfSpecificUserBooks(email) {
    const user = Storage.users.find((u) => u.email === email);

    if (!user) {
      return "User not found.";
    }

    const books = Storage.books.filter((book) =>
      user.borrowedBooks.includes(book.id),
    );

    if (books.length === 0) {
      return "This user has no borrowed books.";
    }

    return books;
  }
}
function renderLibraryBooks() {
  const books = Storage.books;

  resultBox.innerHTML = books
    .map(
      (book) => `
      <div class="book-card">
        <h3>${book.title}</h3>
        <p>${book.author}</p>

        <p>📚 Genre: ${book.genre}</p>

        ${
          book.isBorrowed
            ? `<button disabled>Borrowed</button>`
            : `<button onclick="borrowBook(${book.id})">Borrow</button>`
        }
      </div>
    `,
    )
    .join("");
}

function renderMyBooks() {
  const box = document.querySelector("#resultBox");

  const books = LibraryService.GetListOfUserBooks();

  if (typeof books === "string") {
    box.innerHTML = `<p class="message error">${books}</p>`;

    return;
  }

  box.innerHTML = books
    .map(
      (book) => `
        <div class="book-card">
            <h3>${book.title}</h3>
            <p>${book.author}</p>

            <button onclick="returnBook(${book.id})">
                Return
            </button>
        </div>
    `,
    )
    .join("");
}

function borrowBook(id) {
  const result = LibraryService.BorrowBook(id);

  showMessage(result, result.includes("successfully") ? "success" : "error");

  renderLibraryBooks();
}

function returnBook(id) {
  const result = LibraryService.ReturnBook(id);

  showMessage(result, result.includes("successfully") ? "success" : "error");

  renderMyBooks();
}

function showMessage(text, type = "info") {
  const msg = document.querySelector(".message");

  msg.textContent = text;

  msg.className = `message ${type}`;
}

borrowBtn.addEventListener("click", renderLibraryBooks);

myBooksBtn.addEventListener("click", renderMyBooks);

libraryBooksBtn.addEventListener("click", renderLibraryBooks);

function showLogin() {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");

  loginTab.classList.add("active");
  registerTab.classList.remove("active");
}

function showRegister() {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");

  registerTab.classList.add("active");
  loginTab.classList.remove("active");
}

loginTab.addEventListener("click", showLogin);
registerTab.addEventListener("click", showRegister);
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = loginEmail.value;
  const password = loginPassword.value;

  const result = AuthenticationService.Login(email, password);

  showMessage(result, result.includes("successful") ? "success" : "error");

  if (result === "Login successful.") {
    addBookBtn.classList.remove("hidden");
    deleteBookBtn.classList.remove("hidden");
    authSection.classList.add("hidden");
    dashboard.classList.remove("hidden");

    welcome.textContent = `Welcome ${Storage.currentUser.email}`;
  }
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = registerEmail.value;
  const password = registerPassword.value;
  const role = Number(roleSelect.value);

  const result = AuthenticationService.Register(email, password, role);

  showMessage(result, result.includes("successful") ? "success" : "error");

  if (result === "Registration successful.") {
    registerForm.reset();
  }
});

logoutBtn.addEventListener("click", () => {
  Storage.currentUser = null;

  dashboard.classList.add("hidden");
  authSection.classList.remove("hidden");

  loginForm.reset();
  registerForm.reset();

  message.textContent = "";
  resultBox.innerHTML = "";
});

returnBtn.addEventListener("click", () => {
  const user = Storage.currentUser;

  if (!user) {
    showMessage("Please login first.", "error");
    return;
  }

  renderMyBooks();
});
addBookBtn.addEventListener("click", () => {
  addBookModal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  addBookModal.classList.add("hidden");
});

submitAddBook.addEventListener("click", () => {
  const idValue = modalId.value.trim();
  const title = modalTitle.value.trim();
  const author = modalAuthor.value.trim();
  const genre = bookGenre.value;

  formError.textContent = "";

  if (!idValue || !title || !author) {
    formError.textContent = "⚠ Please fill all fields";
    return;
  }

  const id = Number(idValue);

  if (isNaN(id)) {
    formError.textContent = "⚠ ID must be a number";
    return;
  }

  if (id <= 0) {
    formError.textContent = "⚠ ID must be positive";
    return;
  }

  const result = LibraryService.AddBook(id, title, author, genre);

  if (result.includes("successfully")) {
    addBookModal.classList.add("hidden");

    modalId.value = "";
    modalTitle.value = "";
    modalAuthor.value = "";

    renderLibraryBooks();
  }
});

deleteBookBtn.addEventListener("click", () => {
  deleteBookModal.classList.remove("hidden");
});

closeDeleteModal.addEventListener("click", () => {
  deleteBookModal.classList.add("hidden");
});

submitDeleteBook.addEventListener("click", () => {
  const id = Number(deleteBookId.value);

  if (!id) {
    showMessage("Enter valid ID", "error");
    return;
  }

  LibraryService.DeleteBook(id);

  deleteBookModal.classList.add("hidden");

  deleteBookId.value = "";

  renderLibraryBooks();
});

function renderBorrowedBooks() {
  const borrowedBooks = Storage.books.filter((book) => book.isBorrowed);

  if (borrowedBooks.length === 0) {
    resultBox.innerHTML = "<p>No borrowed books.</p>";
    return;
  }

  resultBox.innerHTML = borrowedBooks
    .map((book) => {
      const user = Storage.users.find((u) => u.id === book.borrowedBy);

      const date = book.borrowedDate
        ? new Date(book.borrowedDate).toLocaleString()
        : "Unknown";

      return `
        <div class="book-card">
          <h3>${book.title}</h3>
          <p>${book.author}</p>

          <p class="borrowed-by">
            Borrowed by: ${user ? user.email : "Unknown"}
          </p>

          <p class="borrowed-date">
            Borrowed at: ${date}
          </p>
        </div>
      `;
    })
    .join("");
}
borrowedListBtn.addEventListener("click", renderBorrowedBooks);

function searchBooks() {
  const keyword = searchInput.value.trim().toLowerCase();

  const filtered = Storage.books.filter((book) =>
    book.title.toLowerCase().includes(keyword),
  );

  if (filtered.length === 0) {
    resultBox.innerHTML = "<p>No books found.</p>";
    return;
  }

  resultBox.innerHTML = filtered
    .map(
      (book) => `
      <div class="book-card">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        <p>📚 Genre: ${book.genre}</p>

        ${
          book.isBorrowed
            ? `<button disabled>Borrowed</button>`
            : `<button onclick="borrowBook(${book.id})">Borrow</button>`
        }
      </div>
    `,
    )
    .join("");
}
searchInput.addEventListener("input", searchBooks);
