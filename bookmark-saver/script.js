const bookmarkNameInput = document.getElementById("bookmark-name");
const bookmarkUrlInput = document.getElementById("bookmark-url");
const addBookmarkBtn = document.getElementById("add-bookmark");
const bookmarkList = document.getElementById("bookmark-list");

document.addEventListener("DOMContentLoaded", loadBookmarks)

addBookmarkBtn.addEventListener("click", function() {
    const name = bookmarkNameInput.value.trim();
    const url = bookmarkUrlInput.value.trim();

    // check if there is anything entered in the iput fields
    if(!name || !url) {
        alert("Please enter valid url and name");
        return
    } else {
        // check if url begins with http:// or https://
        if(!url.startsWith("http://") && !url.startsWith("https://")) {
            alert("please enter a valid url starting with http:// or https://")
            return
        }

        // Add the bookmark to the list and also to the local storage.
        addBookmark(name, url)
        saveBookmark(name, url)
        
        // resets the form
        bookmarkNameInput.value = "";
        bookmarkUrlInput.value = "";
    }
})

function addBookmark(name, url) {
    /* This function creates the list element for every bookmark created.
    - it creates the background data and all the functionalities and then adds it to the list later.
    */

    // create the li element to add into the bookmark list
    // create the link 'a' that contains both the name and the url
    const li =  document.createElement("li")
    const link =  document.createElement("a")

    // attributes for the link 'a' tag
    link.href = url
    link.textContent = name
    link.target = "_blank"

    // create the remove button clicking upon which, deletes the current bookmark
    const removeButton = document.createElement("button");
    removeButton.textContent = "x"
    removeButton.addEventListener("click", function() {
        bookmarkList.removeChild(li);
        removeBookmarkFromStorage(name, url);
    })

    li.appendChild(link);
    li.appendChild(removeButton);

    bookmarkList.appendChild(li);

}

function getBookmarksFromStorage(){
    const bookmarks = localStorage.getItem("bookmarks");
    return bookmarks ? JSON.parse(bookmarks) : [];
}

function saveBookmark(name, url) {
    const bookmarks = getBookmarksFromStorage()
    bookmarks.push({name,url})
    localStorage.setItem("bookmarks",JSON.stringify(bookmarks))
}

function loadBookmarks() {
    const bookmarks = getBookmarksFromStorage()
    bookmarks.forEach((bookmark) => addBookmark(bookmark.name,bookmark.url));
}

function removeBookmarkFromStorage(name, url) {
    let bookmarks = getBookmarksFromStorage()
    bookmarks = bookmarks.filter((bookmark) => bookmark.name !== name || bookmark.url !== url)
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}   
