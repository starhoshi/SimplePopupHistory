let allHistory = [];

function init() {
  // 初期表示は20件だけ
  chrome.history.search({
    text: '',
    maxResults: 20,
    startTime: Date.now() - 7 * 24 * 60 * 60 * 1000
  }, (items) => {
    allHistory = items;
    displayHistory(items);
    document.getElementById('app').style.visibility = 'visible';
    
    // ポップアップ表示後に残りを遅延ロード
    setTimeout(() => {
      loadMoreHistory();
    }, 100);
  });
}

function loadMoreHistory() {
  chrome.history.search({
    text: '',
    maxResults: 1000,
    startTime: Date.now() - 7 * 24 * 60 * 60 * 1000
  }, (items) => {
    allHistory = items;
    // 検索中でなければ表示を更新
    const searchBar = document.getElementById('searchBar');
    if (!searchBar.value) {
      displayHistory(items);
    }
  });
}

function displayHistory(items) {
  const list = document.getElementById('historyList');
  
  const copyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>`;
  
  list.innerHTML = items.map(item => {
    const title = item.title || item.url;
    const time = formatDate(new Date(item.lastVisitTime));
    const domain = new URL(item.url).hostname;
    
    return `
      <div class="history-item" data-url="${escapeHtml(item.url)}" data-title="${escapeHtml(title)}">
        <img class="favicon" src="https://www.google.com/s2/favicons?domain=${domain}&sz=32" width="16" height="16" alt="">
        <div class="history-item-content">
          <div class="title-row">
            <div class="history-item-title">${escapeHtml(title)}</div>
            <button class="copy-btn copy-title" title="タイトルをコピー">${copyIcon}</button>
          </div>
          <div class="history-item-meta">
            <div class="url-row">
              <span class="history-item-url">${escapeHtml(item.url)}</span>
              <button class="copy-btn copy-url" title="URLをコピー">${copyIcon}</button>
            </div>
            <span class="history-item-time">${time}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  list.querySelectorAll('.history-item').forEach(item => {
    const url = item.dataset.url;
    const title = item.dataset.title;
    
    // タイトルコピーボタン
    const copyTitleBtn = item.querySelector('.copy-title');
    copyTitleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(title);
    });
    
    // URLコピーボタン
    const copyUrlBtn = item.querySelector('.copy-url');
    copyUrlBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(url);
    });
    
    // アイテムクリック
    item.addEventListener('click', (e) => {
      if (e.target.closest('.copy-btn')) {
        return;
      }
      
      if (e.metaKey || e.ctrlKey) {
        chrome.tabs.create({ url });
      } else {
        chrome.tabs.update({ url });
      }
    });
  });
}

function formatDate(date) {
  const diff = Date.now() - date;
  const abs = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  
  if (diff < 60000) return `たった今 (${abs})`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分前 (${abs})`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}時間前 (${abs})`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}日前 (${abs})`;
  return abs;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchBar').addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    const filtered = search ? allHistory.filter(item => {
      return (item.title || '').toLowerCase().includes(search) || 
             item.url.toLowerCase().includes(search);
    }) : allHistory;
    displayHistory(filtered);
  });
  
  init();
});
