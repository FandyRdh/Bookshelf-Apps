const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOKSHELF_APP';

// variable initialization
const title = document.querySelector('#inputBookTitle');
const author = document.querySelector('#inputBookAuthor');
const year = document.querySelector('#inputBookYear');
const isComplete = document.querySelector('#inputBookIsComplete');
const completeBookshelfList = document.querySelector('#completeBookshelfList');
const incompleteBookshelfList = document.querySelector('#incompleteBookshelfList');
const editBook = document.getElementById('editBook');

// Check
function isStorageExist() {
    if (typeof (Storage) === undefined) {return false;}
    return true;
}

function generateBookObject(id, title, author, year, isComplete) {
    return {id,title,author,year,isComplete}
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }else{
        alert('Sory, your browser does not support local storage');
    }
}

document.addEventListener(RENDER_EVENT, function () {
    completeBookshelfList.innerHTML = '';
    incompleteBookshelfList.innerHTML = '';
    for (const book of books) {
        const bookElement = makeBook(book);
        if (!book.isComplete)
            incompleteBookshelfList.append(bookElement);
        else
            completeBookshelfList.append(bookElement);
    }
});

// Load Data
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
    if (isStorageExist()) {
        loadDataFromStorage();
    }
    const inputBookForm = document.querySelector('#inputBook');
    inputBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
    const searchBookForm = document.querySelector('#searchBook');
    searchBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    })
});

// save book
function addBook() {
    const bookObject = generateBookObject(+new Date(), title.value, author.value, parseInt(year.value), isComplete.checked);
    books.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    // clean form
    title.value = '';
    author.value = '';
    year.value = '';
    isComplete.checked = false;
    alert('Book successfully saved');
}

// Search
function searchBook() {
    const searchBookTitle = document.querySelector('#searchBookTitle');
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';
    let itemCount = 0;
    books.filter((book) => {
        if (book.title.toLowerCase() == searchBookTitle.value.toLowerCase().trim()) {
            itemCount++;
            if (!book.isComplete)
                incompleteBookshelfList.append(makeBook(book));
            else
                completeBookshelfList.append(makeBook(book));
        }
    });
    if (itemCount == 0) {
        alert('Sorry, the book you are looking for was not found!');
        location.reload();
    };
}

// Genereate List
function makeBook(bookObject) {
    const textTitle = document.createElement('h5');
    textTitle.innerText = `${bookObject.title}(${bookObject.year})`;
    textTitle.classList.add('card-title');

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Author : ${bookObject.author}`;

    const container = document.createElement('div');
    container.classList.add('card-body');
    container.append(textTitle, textAuthor);
    
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('card');
    cardWrapper.appendChild(container);
    cardWrapper.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isComplete) {
        const unreadButton = document.createElement('button');
        unreadButton.classList.add('mark','btn');
        unreadButton.innerText = 'Mark as Unread';

        unreadButton.addEventListener('click', function () { 
            markAsUnread(bookObject.id);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('edit','btn');
        editButton.innerText = 'Edit';

        const removeButton = document.createElement('button');
        removeButton.classList.add('delete','btn');
        removeButton.innerText = 'Remove';

        editButton.addEventListener('click', function() {
            var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
            myModal.show();
            document.getElementById('editid').value = bookObject.id;
            document.getElementById('editBookTitle').value = bookObject.title;
            document.getElementById('editBookAuthor').value = bookObject.author;
            document.getElementById('editBookYear').value = parseInt(bookObject.year);
        });

        removeButton.addEventListener('click', function () {
            let confirmRemove = confirm('Are you sure you want to delete a book ('+bookObject.title+') ?');
            if (confirmRemove){
                removeBook(bookObject.id,bookObject.title);
            }
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('d-flex','justify-content-between');
        buttonContainer.append(unreadButton,editButton, removeButton);

        container.append(buttonContainer);
    } else {
        const readButton = document.createElement('button');
        readButton.classList.add('mark','btn');
        readButton.innerText = 'Mark as Read';

        readButton.addEventListener('click', function () {
            markAsRead(bookObject.id);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('edit','btn');
        editButton.innerText = 'Edit';

        const removeButton = document.createElement('button');
        removeButton.classList.add('delete','btn');
        removeButton.innerText = 'Remove';

        editButton.addEventListener('click', function() {
            var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
            myModal.show();
            document.getElementById('editid').value = bookObject.id;
            document.getElementById('editBookTitle').value = bookObject.title;
            document.getElementById('editBookAuthor').value = bookObject.author;
            document.getElementById('editBookYear').value = bookObject.year;
        });

        removeButton.addEventListener('click', function () {
            let confirmRemove = confirm('Are you sure you want to delete a book ('+bookObject.title+') ?');

            if (confirmRemove){
                removeBook(bookObject.id,bookObject.title);
            }
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('d-flex','justify-content-between');
        buttonContainer.append(readButton,editButton, removeButton);

        container.append(buttonContainer);
    }
    return cardWrapper;
}

function findBook(bookId) {
    for (const book of books) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

// markAsRead
function markAsRead(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// markAsUnread
function markAsUnread(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// Delete
function removeBook(bookId,bookTitle) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert('('+bookTitle+') book successfully deleted');
}

// Edit
editBook.addEventListener('submit', function (event) {
    saveEditBook();
});

function saveEditBook() {
    const modalEdit = document.getElementById('exampleModal');

    const editid = document.getElementById('editid').value;
    const editBookTitle = document.getElementById('editBookTitle').value;
    const editBookAuthor = document.getElementById('editBookAuthor').value;
    const editBookYear = parseInt(document.getElementById('editBookYear').value);
    
    const bookIdPosition = findBookIndex(parseInt(editid));

    books[bookIdPosition].title = editBookTitle;
    books[bookIdPosition].author = editBookAuthor;
    books[bookIdPosition].year = editBookYear;
    
    alert("Book ("+editBookTitle+") edited successfully");
    saveData();
}