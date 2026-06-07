// app.js
const KAKAO_API_KEY = '6f9c8074b667a8a829d1ae343d459959'; 

// 1. 다크모드 관리
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

// 2. 검색 기능 (search.html로 이동)
function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (!query) {
        alert("검색어를 입력해 주세요!");
        return;
    }
    window.location.href = `search.html?query=${encodeURIComponent(query)}`;
}

// 3. 북마크(로컬 스토리지) 관리
function getBookmarks() {
    return JSON.parse(localStorage.getItem('bookmarks')) || [];
}

function toggleBookmark(book) {
    let bookmarks = getBookmarks();
    // isbn을 고유 식별자로 사용
    const existingIndex = bookmarks.findIndex(b => b.isbn === book.isbn);

    if (existingIndex > -1) {
        // 이미 있으면 삭제
        bookmarks.splice(existingIndex, 1);
    } else {
        // 없으면 추가
        bookmarks.push(book);
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    
    // 현재 페이지가 즐겨찾기 페이지면 화면 다시 그리기
    if (window.location.pathname.includes('bookmark.html')) {
        renderBookmarks();
    }
}

function isBookmarked(isbn) {
    const bookmarks = getBookmarks();
    return bookmarks.some(b => b.isbn === isbn);
}

// 4. 도서 카드 HTML 생성기
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    
    const activeClass = isBookmarked(book.isbn) ? 'active' : '';
    const imgUrl = book.thumbnail ? book.thumbnail : 'https://via.placeholder.com/120x170?text=No+Image';

    card.innerHTML = `
        <button class="bookmark-btn ${activeClass}" onclick='handleBookmarkClick(this, ${JSON.stringify(book).replace(/'/g, "&apos;")})'>★</button>
        <img src="${imgUrl}" alt="${book.title}">
        <div class="title" title="${book.title}">${book.title}</div>
        <div class="author">${book.authors.join(', ')} | ${book.publisher}</div>
    `;
    return card;
}

function handleBookmarkClick(btnElement, bookData) {
    toggleBookmark(bookData);
    btnElement.classList.toggle('active');
}

// 초기화 이벤트 연결
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const searchForm = document.getElementById('search-form');
    if (searchForm) searchForm.addEventListener('submit', handleSearch);
});
