document.addEventListener("DOMContentLoaded", function () {
  fetchDataAndInitialize();
  loadBooks();
  loadVisitors();
  loadCards();
  loadStatistics();
});

// Fetch data from data.json and initialize local storage
function fetchDataAndInitialize() {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      if (!localStorage.getItem("books")) {
        localStorage.setItem("books", JSON.stringify(data.books));
      }
      if (!localStorage.getItem("visitors")) {
        localStorage.setItem("visitors", JSON.stringify(data.visitors));
      }
      if (!localStorage.getItem("cards")) {
        localStorage.setItem("cards", JSON.stringify(data.cards));
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Function to toggle sections
function showSection(section) {
  document
    .querySelectorAll("section")
    .forEach((sec) => sec.classList.add("hidden"));
  document.getElementById(section).classList.remove("hidden");
}

// =========================
// BOOKS MANAGEMENT
// =========================
function loadBooks() {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  let tbody = document.querySelector("#booksTable tbody");
  tbody.innerHTML = "";
  books.forEach((book) => {
    let row = `<tr>
                    <td>${book.name}</td>
                    <td>${book.author}</td>
                    <td>${book.copies}</td>
                    <td>
                        <button onclick="openBookForm(${book.id})">Edit</button>
                        <button onclick="deleteBook(${book.id})">Delete</button>
                    </td>
                  </tr>`;
    tbody.innerHTML += row;
  });
}

// Open Book Form
function openBookForm(id = null) {
  document.getElementById("bookForm").style.display = "block";
  if (id) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    let book = books.find((b) => b.id === id);
    if (book) {
      document.getElementById("bookId").value = book.id;
      document.getElementById("bookName").value = book.name;
      document.getElementById("bookAuthor").value = book.author;
      document.getElementById("bookYear").value = book.year;
      document.getElementById("bookPublisher").value = book.publisher;
      document.getElementById("bookPages").value = book.pages;
      document.getElementById("bookCopies").value = book.copies;
    }
  } else {
    document.querySelector("#bookForm form").reset();
  }
}

// Close Book Form
function closeBookForm() {
  document.getElementById("bookForm").style.display = "none";
}

// Save or Update Book
function saveBook(event) {
  event.preventDefault();
  let id = document.getElementById("bookId").value;
  let name = document.getElementById("bookName").value;
  let author = document.getElementById("bookAuthor").value;
  let year = document.getElementById("bookYear").value;
  let publisher = document.getElementById("bookPublisher").value;
  let pages = document.getElementById("bookPages").value;
  let copies = document.getElementById("bookCopies").value;

  if (!name || !author || !year || !publisher || !pages || !copies) {
    alert("All fields are required!");
    return;
  }

  if (parseInt(pages) < 1 || parseInt(copies) < 0) {
    alert("Invalid numeric values.");
    return;
  }

  let books = JSON.parse(localStorage.getItem("books")) || [];

  if (id) {
    let index = books.findIndex((b) => b.id == id);
    books[index] = {
      id: parseInt(id),
      name,
      author,
      year,
      publisher,
      pages,
      copies: parseInt(copies),
    };
  } else {
    let newBook = {
      id: Date.now(),
      name,
      author,
      year,
      publisher,
      pages,
      copies: parseInt(copies),
    };
    books.push(newBook);
  }

  localStorage.setItem("books", JSON.stringify(books));
  loadBooks();
  closeBookForm();
}

// Delete Book
function deleteBook(id) {
  if (confirm("Are you sure you want to delete this book?")) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books = books.filter((book) => book.id !== id);
    localStorage.setItem("books", JSON.stringify(books));
    loadBooks();
  }
}

// Search Books
function searchBooks() {
  let keyword = document.getElementById("bookSearch").value.toLowerCase();
  let books = JSON.parse(localStorage.getItem("books")) || [];
  let tbody = document.querySelector("#booksTable tbody");
  tbody.innerHTML = "";
  books
    .filter(
      (book) =>
        book.name.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword)
    )
    .forEach((book) => {
      let row = `<tr>
                    <td>${book.name}</td>
                    <td>${book.author}</td>
                    <td>${book.copies}</td>
                    <td>
                        <button onclick="openBookForm(${book.id})">Edit</button>
                        <button onclick="deleteBook(${book.id})">Delete</button>
                    </td>
                  </tr>`;
      tbody.innerHTML += row;
    });
}

// =========================
// VISITORS MANAGEMENT
// =========================
// Load Visitors
function loadVisitors() {
  let visitors = JSON.parse(localStorage.getItem("visitors")) || [];
  let tbody = document.querySelector("#visitorsTable tbody");
  tbody.innerHTML = "";
  visitors.forEach((visitor) => {
    let row = `<tr>
                    <td>${visitor.id}</td>
                    <td>${visitor.name}</td>
                    <td>${visitor.phone}</td>
                    <td>
                        <button onclick="editVisitor(${visitor.id})">Edit</button>
                    </td>
                  </tr>`;
    tbody.innerHTML += row;
  });
}

// Open Visitor Form
function openVisitorForm(id = null) {
  document.getElementById("visitorForm").style.display = "block";
  if (id) {
    let visitors = JSON.parse(localStorage.getItem("visitors")) || [];
    let visitor = visitors.find((v) => v.id === id);
    if (visitor) {
      document.getElementById("visitorId").value = visitor.id;
      document.getElementById("visitorName").value = visitor.name;
      document.getElementById("visitorPhone").value = visitor.phone;
    }
  } else {
    document.querySelector("#visitorForm form").reset();
  }
}

// Close Visitor Form
function closeVisitorForm() {
  document.getElementById("visitorForm").style.display = "none";
}

// Save Visitor
function saveVisitor(event) {
  event.preventDefault();
  let id = document.getElementById("visitorId").value;
  let name = document.getElementById("visitorName").value;
  let phone = document.getElementById("visitorPhone").value;

  if (!name || !phone.match(/^[\d\s-]+$/)) {
    alert("Invalid input!");
    return;
  }

  let visitors = JSON.parse(localStorage.getItem("visitors")) || [];

  if (id) {
    let index = visitors.findIndex((v) => v.id == id);
    visitors[index] = { id: parseInt(id), name, phone };
  } else {
    let newVisitor = { id: Date.now(), name, phone };
    visitors.push(newVisitor);
  }

  localStorage.setItem("visitors", JSON.stringify(visitors));
  loadVisitors();
  closeVisitorForm();
}

// Edit Visitor
function editVisitor(id) {
  openVisitorForm(id);
}

// Search Visitors
function searchVisitors() {
  let keyword = document.getElementById("visitorSearch").value.toLowerCase();
  let visitors = JSON.parse(localStorage.getItem("visitors")) || [];
  let tbody = document.querySelector("#visitorsTable tbody");
  tbody.innerHTML = "";
  visitors
    .filter((visitor) => visitor.name.toLowerCase().includes(keyword))
    .forEach((visitor) => {
      let row = `<tr>
                    <td>${visitor.id}</td>
                    <td>${visitor.name}</td>
                    <td>${visitor.phone}</td>
                    <td>
                        <button onclick="editVisitor(${visitor.id})">Edit</button>
                    </td>
                  </tr>`;
      tbody.innerHTML += row;
    });
}

// =========================
// CARDS (BORROW & RETURN)
// =========================
function loadCards() {
  let cards = JSON.parse(localStorage.getItem("cards")) || [];
  let tbody = document.querySelector("#cardsTable tbody");
  tbody.innerHTML = "";
  cards.forEach((card) => {
    let returnBtn = card.returnDate
      ? card.returnDate
      : `<button onclick="returnBook(${card.id})">Return</button>`;
    let row = `<tr>
                    <td>${card.visitor}</td>
                    <td>${card.book}</td>
                    <td>${card.borrowDate}</td>
                    <td>${returnBtn}</td>
                  </tr>`;
    tbody.innerHTML += row;
  });
}

// Open Card Form
function openCardForm() {
  document.getElementById("cardForm").style.display = "block";

  let visitors = JSON.parse(localStorage.getItem("visitors")) || [];
  let books = JSON.parse(localStorage.getItem("books")) || [];

  let visitorSelect = document.getElementById("cardVisitor");
  let bookSelect = document.getElementById("cardBook");

  visitorSelect.innerHTML = "";
  bookSelect.innerHTML = "";

  visitors.forEach((visitor) => {
    let option = document.createElement("option");
    option.value = visitor.name;
    option.textContent = visitor.name;
    visitorSelect.appendChild(option);
  });

  books.forEach((book) => {
    let option = document.createElement("option");
    option.value = book.name;
    option.textContent = book.name;
    bookSelect.appendChild(option);
  });
}

// Close Card Form
function closeCardForm() {
  document.getElementById("cardForm").style.display = "none";
}

// Borrow Book
function saveCard(event) {
  event.preventDefault();
  let visitor = document.getElementById("cardVisitor").value;
  let book = document.getElementById("cardBook").value;
  let borrowDate = document.getElementById("cardBorrowDate").value;

  let cards = JSON.parse(localStorage.getItem("cards")) || [];
  let newCard = { id: Date.now(), visitor, book, borrowDate, returnDate: null };
  cards.push(newCard);

  localStorage.setItem("cards", JSON.stringify(cards));
  loadCards();
  closeCardForm();
}

// Return Book
function returnBook(id) {
  let cards = JSON.parse(localStorage.getItem("cards")) || [];
  let card = cards.find((c) => c.id === id);
  if (card) {
    card.returnDate = new Date().toISOString().split("T")[0];
    localStorage.setItem("cards", JSON.stringify(cards));
    loadCards();
  }
}

// =========================
// STATISTICS
// =========================
function loadStatistics() {
  let cards = JSON.parse(localStorage.getItem("cards")) || [];
  let books = JSON.parse(localStorage.getItem("books")) || [];
  let visitors = JSON.parse(localStorage.getItem("visitors")) || [];

  // Calculate top 5 popular books
  let bookBorrowCount = {};
  cards.forEach((card) => {
    if (bookBorrowCount[card.book]) {
      bookBorrowCount[card.book]++;
    } else {
      bookBorrowCount[card.book] = 1;
    }
  });

  let popularBooks = Object.keys(bookBorrowCount)
    .sort((a, b) => bookBorrowCount[b] - bookBorrowCount[a])
    .slice(0, 5);

  let popularBooksList = document.getElementById("popularBooks");
  popularBooksList.innerHTML = "";
  popularBooks.forEach((bookName) => {
    let book = books.find((b) => b.name === bookName);
    let listItem = document.createElement("li");
    listItem.textContent = `${book.name} by ${book.author} - Borrowed ${bookBorrowCount[bookName]} times`;
    popularBooksList.appendChild(listItem);
  });

  // Calculate top 5 active visitors
  let visitorBorrowCount = {};
  cards.forEach((card) => {
    if (visitorBorrowCount[card.visitor]) {
      visitorBorrowCount[card.visitor]++;
    } else {
      visitorBorrowCount[card.visitor] = 1;
    }
  });

  let activeVisitors = Object.keys(visitorBorrowCount)
    .sort((a, b) => visitorBorrowCount[b] - visitorBorrowCount[a])
    .slice(0, 5);

  let activeVisitorsList = document.getElementById("activeVisitors");
  activeVisitorsList.innerHTML = "";
  activeVisitors.forEach((visitorName) => {
    let visitor = visitors.find((v) => v.name === visitorName);
    let listItem = document.createElement("li");
    listItem.textContent = `${visitor.name} - Borrowed ${visitorBorrowCount[visitorName]} times`;
    activeVisitorsList.appendChild(listItem);
  });
}
