let books = [];

function addBook(event) {
    event.preventDefault();
    
    const titleInput = document.querySelector("#bookFormTitle");
    const authorInput = document.querySelector("#bookFormAuthor");
    const yearInput = document.querySelector("#bookFormYear");
    const isCompleteInput = document.querySelector("#bookFormIsComplete");
    
    const newBook = {
        id: +new Date(),
        title: titleInput.value,
        author: authorInput.value,
        year: yearInput.value,
        isComplete: isCompleteInput.checked
    };

    books.push(newBook);
    document.dispatchEvent(new Event("bookChanged"));
    event.target.reset(); // Reset form fields
}

function searchBook(event) {
    event.preventDefault();
    
    const searchInput = document.querySelector("#searchBookTitle");
    const query = searchInput.value.toLowerCase();
    const filteredBooks = query 
        ? books.filter(book => book.title.toLowerCase().includes(query)) 
        : [];

    displaySearchResults(filteredBooks);
}

function completeBook(event) {
    const bookId = Number(event.target.closest('[data-bookid]').getAttribute('data-bookid'));
    const index = books.findIndex(book => book.id === bookId);
    
    if (index !== -1) {
        books[index].isComplete = true;
        document.dispatchEvent(new Event("bookChanged"));
    }
}

function moveToIncomplete(event) {
    const bookId = Number(event.target.closest('[data-bookid]').getAttribute('data-bookid'));
    const index = books.findIndex(book => book.id === bookId);
    
    if (index !== -1) {
        books[index].isComplete = false;
        document.dispatchEvent(new Event("bookChanged"));
    }
}

function deleteBook(event) {
    const bookId = Number(event.target.closest('[data-bookid]').getAttribute('data-bookid'));
    books = books.filter(book => book.id !== bookId);
    document.dispatchEvent(new Event("bookChanged"));
}

function displayBooks(booksToDisplay) {
    const incompleteList = document.querySelector("#incompleteBookList");
    const completeList = document.querySelector("#completeBookList");

    incompleteList.innerHTML = "";
    completeList.innerHTML = "";

    for (const book of booksToDisplay) {
        const bookItem = document.createElement("div");
        bookItem.setAttribute("data-bookid", book.id);
        bookItem.setAttribute("data-testid", "bookItem");

        const title = document.createElement("h3");
        title.setAttribute("data-testid", "bookItemTitle");
        title.innerText = book.title;

        const author = document.createElement("p");
        author.setAttribute("data-testid", "bookItemAuthor");
        author.innerText = "Penulis: " + book.author;

        const year = document.createElement("p");
        year.setAttribute("data-testid", "bookItemYear");
        year.innerText = "Tahun: " + book.year;

        const status = document.createElement("p");
        status.setAttribute("data-testid", "bookItemStatus");
        status.innerText = book.isComplete ? "Status: Selesai dibaca" : "Status: Belum selesai dibaca";

        const actionDiv = document.createElement("div");

        // Tombol untuk menyelesaikan buku
        const completeButton = document.createElement("button");
        completeButton.setAttribute("data-testid", "bookItemIsCompleteButton");
        completeButton.innerText = "Selesai dibaca"; // Tombol untuk menyelesaikan buku
        completeButton.addEventListener("click", completeBook);

        // Tombol untuk memindahkan buku kembali ke "Belum selesai dibaca"
        const moveToIncompleteButton = document.createElement("button");
        moveToIncompleteButton.setAttribute("data-testid", "bookItemMoveToIncompleteButton");
        moveToIncompleteButton.innerText = "Belum Selesai dibaca"; // Tombol pemindahan
        moveToIncompleteButton.addEventListener("click", moveToIncomplete);

        // Tombol untuk menghapus buku
        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
        deleteButton.innerText = "Hapus Buku"; // Tombol penghapusan
        deleteButton.addEventListener("click", deleteBook);

        // Menambahkan tombol berdasarkan status buku
        if (book.isComplete) {
            actionDiv.appendChild(moveToIncompleteButton);
            completeList.appendChild(bookItem);
        } else {
            actionDiv.appendChild(completeButton);
            incompleteList.appendChild(bookItem);
        }
        
        actionDiv.appendChild(deleteButton);
        
        // Menambahkan elemen ke dalam item buku
        bookItem.appendChild(title);
        bookItem.appendChild(author);
        bookItem.appendChild(year);
        bookItem.appendChild(status); // Menampilkan status
        bookItem.appendChild(actionDiv);
    }
}

function displaySearchResults(filteredBooks) {
    const searchResultsList = document.querySelector("#searchResultsList");
    searchResultsList.innerHTML = ""; // Reset hasil pencarian

    for (const book of filteredBooks) {
        const bookItem = document.createElement("div");
        bookItem.setAttribute("data-bookid", book.id);
        bookItem.setAttribute("data-testid", "searchResultItem");

        const title = document.createElement("h3");
        title.setAttribute("data-testid", "searchResultItemTitle");
        title.innerText = book.title;

        const author = document.createElement("p");
        author.setAttribute("data-testid", "searchResultItemAuthor");
        author.innerText = "Penulis: " + book.author;

        const year = document.createElement("p");
        year.setAttribute("data-testid", "searchResultItemYear");
        year.innerText = "Tahun: " + book.year;

        const status = document.createElement("p");
        status.setAttribute("data-testid", "searchResultItemStatus");
        status.innerText = book.isComplete ? "Status: Selesai dibaca" : "Status: Belum selesai dibaca";

        const toggleButton = document.createElement("button");
        toggleButton.setAttribute("data-testid", "searchResultToggleButton");
        toggleButton.innerText = book.isComplete ? "Belum Selesai dibaca" : "Selesai dibaca";
        
        toggleButton.addEventListener("click", function() {
            if (book.isComplete) {
                // Pindahkan ke "Belum selesai dibaca"
                moveToIncomplete({ target: bookItem });
                book.isComplete = false; // Update status di array
                status.innerText = "Status: Belum selesai dibaca"; // Perbarui tampilan status
                toggleButton.innerText = "Selesai dibaca"; // Perbarui tombol
            } else {
                // Pindahkan ke "Selesai dibaca"
                completeBook({ target: bookItem });
                book.isComplete = true; // Update status di array
                status.innerText = "Status: Selesai dibaca"; // Perbarui tampilan status
                toggleButton.innerText = "Belum Selesai dibaca"; // Perbarui tombol
            }
            document.dispatchEvent(new Event("bookChanged")); // Dispatch event untuk menyimpan ke local storage
        });

        bookItem.appendChild(title);
        bookItem.appendChild(author);
        bookItem.appendChild(year);
        bookItem.appendChild(status);
        bookItem.appendChild(toggleButton); // Tambahkan tombol toggle status

        searchResultsList.appendChild(bookItem);
    }
}

function saveToLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
    displayBooks(books);
}

window.addEventListener("load", () => {
    books = JSON.parse(localStorage.getItem("books")) || [];
    displayBooks(books);

    const bookForm = document.querySelector("#bookForm");
    const searchForm = document.querySelector("#searchBook");
    
    bookForm.addEventListener("submit", addBook);
    searchForm.addEventListener("submit", searchBook);
    document.addEventListener("bookChanged", saveToLocalStorage);
});