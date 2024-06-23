const books = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOKSHELF_APP';

// var data buku
const title = document.querySelector('#inputBookTitle');
const author = document.querySelector('#inputBookAuthor');
const year = document.querySelector('#inputBookYear');
const isComplete = document.querySelector('#inputBookIsComplete');

const completeBookshelfList = document.querySelector('#completeBookshelfList');
const incompleteBookshelfList = document.querySelector('#incompleteBookshelfList');

// periksa apakah browser support web storage
function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser tidak mendukung local storage');
        return false;
    }

    return true;
}

// objek buku
function generateBookObject(id, title, author, year, isComplete) {
    return {id,title,author,year,isComplete}
}

// simpan data/Load Data -> tambahkan alert else
function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

document.addEventListener(RENDER_EVENT, function () {
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    for (const book of books) {
        const bookElement = makeBook(book);
        if (!book.isComplete)
            incompleteBookshelfList.append(bookElement);
        else
            completeBookshelfList.append(bookElement);
    }
});

// muat data dari storage
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
    const bookObject = generateBookObject(+new Date(), title.value, author.value, year.value, isComplete.checked);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();

    // clean form
    title.value = '';
    author.value = '';
    year.value = '';
    isComplete.checked = false;
    
    alert('Buku telah disimpan');
}

// cari buku
function searchBook() {
    const queryTitle = document.querySelector('#searchBookTitle');

    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    let result = 0;
    books.filter((book) => {
        if (book.title.toLowerCase() == queryTitle.value.toLowerCase().trim()) {
            result++;

            const bookElement = makeBook(book);

            if (!book.isComplete)
                incompleteBookshelfList.append(bookElement);
            else
                completeBookshelfList.append(bookElement);
        }
    });

    if (result == 0) {
        alert('Buku yang anda cari tidak ditemukan!');
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
        unreadButton.classList.add('green','btn');
        unreadButton.innerText = 'Belum selesai di baca';

        unreadButton.addEventListener('click', function () { 
            markAsUnread(bookObject.id);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('edit','btn');
        editButton.innerText = 'Edit';

        const removeButton = document.createElement('button');
        removeButton.classList.add('red','btn');
        removeButton.innerText = 'Remove';

        removeButton.addEventListener('click', function () {
            let confirmRemove = confirm('Are you sure you want to delete a book ('+bookObject.title+') ?');
            if (confirmRemove)
                removeBook(bookObject.id,bookObject.title);
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('d-flex','justify-content-between');
        buttonContainer.append(unreadButton,editButton, removeButton);

        container.append(buttonContainer);
    } else {
        const readButton = document.createElement('button');
        readButton.classList.add('green','btn');
        readButton.innerText = 'Selesai dibaca';

        readButton.addEventListener('click', function () {
            markAsRead(bookObject.id);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('edit','btn');
        editButton.innerText = 'Edit';

        const removeButton = document.createElement('button');
        removeButton.classList.add('red','btn');
        removeButton.innerText = 'Remove';

        removeButton.addEventListener('click', function () {
            let confirmRemove = confirm('Are you sure you want to delete a book ('+bookObject.title+') ?');

            if (confirmRemove)
                removeBook(bookObject.id,bookObject.title);
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

// Note : Jadikan 1
function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

// Change-Buku dibaca
function markAsRead(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveData();
}

// Change-Buku belum dibaca
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