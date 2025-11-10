let allHistory = [];

// 履歴を取得して表示
async function loadHistory() {
  try {
    const historyItems = await chrome.history.search({
      text: '',
      maxResults: 500, // 500件に制限してパフォーマンス向上
      startTime: Date.now() - 7 * 24 * 60 * 60 * 1000 // 過去7日間
    });
    
    allHistory = historyItems;
    displayHistory(allHistory);
  } catch (error) {
    console.error('履歴の取得に失敗しました:', error);
    document.getElementById('historyList').innerHTML = 
      '<div class="no-results">履歴の読み込みに失敗しました</div>';
  }
}

// 履歴を表示
function displayHistory(historyItems) {
  const historyList = document.getElementById('historyList');
  
  if (historyItems.length === 0) {
    historyList.innerHTML = '<div class="no-results">履歴が見つかりませんでした</div>';
    return;
  }
  
  // まず一気にHTMLを生成（faviconなし）
  historyList.innerHTML = historyItems.map(item => {
    const date = new Date(item.lastVisitTime);
    const timeStr = formatDate(date);
    const title = item.title || item.url;
    
    return `
      <div class="history-item" data-url="${escapeHtml(item.url)}">
        <img class="favicon" data-domain="${new URL(item.url).hostname}" alt="" width="16" height="16">
        <div class="history-item-content">
          <div class="history-item-title">${escapeHtml(title)}</div>
          <div class="history-item-meta">
            <span class="history-item-url">${escapeHtml(item.url)}</span>
            <span class="history-item-time">${timeStr}</span>
          </div>
        </div>
        <button class="new-tab-btn" title="新しいタブで開く">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="16" height="16">
            <polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px" points="27 12 36 12 36 21"/>
            <polyline fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px" points="32 26 32 34 14 34 14 16 22 16"/>
            <line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2px" x1="24" y1="24" x2="35" y2="13"/>
          </svg>
        </button>
      </div>
    `;
  }).join('');
  
  // faviconを遅延読み込み
  requestIdleCallback(() => {
    historyList.querySelectorAll('.favicon').forEach(img => {
      const domain = img.dataset.domain;
      img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    });
  }, { timeout: 100 });
  
  // クリックイベントを追加
  historyList.querySelectorAll('.history-item').forEach(item => {
    const url = item.dataset.url;
    const newTabBtn = item.querySelector('.new-tab-btn');
    
    // Command/Ctrlキー + クリックで新しいタブ、通常クリックで現在のタブ
    item.addEventListener('click', (e) => {
      if (e.target.classList.contains('new-tab-btn')) {
        return; // ボタンのクリックは別で処理
      }
      
      if (e.metaKey || e.ctrlKey) {
        chrome.tabs.create({ url });
      } else {
        chrome.tabs.update({ url });
      }
    });
    
    // 新しいタブで開くボタン
    newTabBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chrome.tabs.create({ url });
    });
  });
}

// 日時をフォーマット
function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  const absoluteTime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  
  let relativeTime;
  if (diff < 60000) {
    relativeTime = 'たった今';
  } else if (diff < 3600000) {
    relativeTime = `${Math.floor(diff / 60000)}分前`;
  } else if (diff < 86400000) {
    relativeTime = `${Math.floor(diff / 3600000)}時間前`;
  } else if (diff < 604800000) {
    relativeTime = `${Math.floor(diff / 86400000)}日前`;
  } else {
    return absoluteTime;
  }
  
  return `${relativeTime} (${absoluteTime})`;
}

// HTMLエスケープ
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 検索機能
document.getElementById('searchBar').addEventListener('input', (e) => {
  const searchText = e.target.value.toLowerCase();
  
  if (searchText === '') {
    displayHistory(allHistory);
    return;
  }
  
  const filteredHistory = allHistory.filter(item => {
    const title = (item.title || '').toLowerCase();
    const url = item.url.toLowerCase();
    return title.includes(searchText) || url.includes(searchText);
  });
  
  displayHistory(filteredHistory);
});

// 初期化
loadHistory();
