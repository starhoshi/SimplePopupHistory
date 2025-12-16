let allHistory = [];

function init() {
  // Apply i18n
  applyI18n();

  // Load initial 20 items from the past 30 days
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  chrome.history.search({
    text: '',
    startTime: thirtyDaysAgo,
    maxResults: 20
  }, (items) => {
    allHistory = items;
    displayHistory(items);
    document.getElementById('app').style.visibility = 'visible';

    // Lazy load remaining items after popup is displayed
    setTimeout(() => {
      loadMoreHistory();
    }, 100);
  });
}

function applyI18n() {
  // Elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = chrome.i18n.getMessage(key);
  });

  // Elements with data-i18n-placeholder attribute
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    element.placeholder = chrome.i18n.getMessage(key);
  });
}

function loadMoreHistory() {
  // Load up to 1000 items from the past 30 days
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  chrome.history.search({
    text: '',
    startTime: thirtyDaysAgo,
    maxResults: 1000
  }, (items) => {
    allHistory = items;
    // Update display if not searching
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

  const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>`;

  list.innerHTML = items.map(item => {
    const title = item.title || item.url;
    const time = formatDate(new Date(item.lastVisitTime));
    const domain = new URL(item.url).hostname;

    return `
      <div class="history-item" data-url="${escapeHtml(item.url)}" data-title="${escapeHtml(title)}">
        <img class="favicon" src="https://www.google.com/s2/favicons?domain=${domain}&sz=64" width="24" height="24" alt="">
        <div class="history-item-content">
          <div class="title-row">
            <div class="history-item-title">${escapeHtml(title)}</div>
            <button class="copy-btn copy-title" title="${chrome.i18n.getMessage('copyTitle')}">${copyIcon}</button>
          </div>
          <div class="history-item-meta">
            <div class="url-row">
              <span class="history-item-url">${escapeHtml(item.url)}</span>
              <button class="copy-btn copy-url" title="${chrome.i18n.getMessage('copyUrl')}">${copyIcon}</button>
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

    // Copy title button
    const copyTitleBtn = item.querySelector('.copy-title');
    const titleRow = item.querySelector('.title-row');

    copyTitleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(title);
      showCopyFeedback(copyTitleBtn, checkIcon);
    });

    // Reset to copy icon on mouse leave
    titleRow.addEventListener('mouseleave', () => {
      resetCopyButton(copyTitleBtn, copyIcon);
    });

    // Copy URL button
    const copyUrlBtn = item.querySelector('.copy-url');
    const urlRow = item.querySelector('.url-row');

    copyUrlBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(url);
      showCopyFeedback(copyUrlBtn, checkIcon);
    });

    // Reset to copy icon on mouse leave
    urlRow.addEventListener('mouseleave', () => {
      resetCopyButton(copyUrlBtn, copyIcon);
    });

    // Item click
    item.addEventListener('click', (e) => {
      if (e.target.closest('.copy-btn')) {
        return;
      }

      if (e.metaKey || e.ctrlKey) {
        chrome.tabs.create({ url });
      } else {
        chrome.tabs.update({ url });
      }

      // Close popup after navigation
      window.close();
    });
  });
}

function showCopyFeedback(button, checkIcon) {
  // Change to check icon
  button.innerHTML = checkIcon;
  button.style.color = '#1a73e8';
}

function resetCopyButton(button, copyIcon) {
  // Reset to copy icon
  button.innerHTML = copyIcon;
  button.style.color = '';
}

function formatDate(date) {
  const diff = Date.now() - date;
  const abs = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

  if (diff < 60000) {
    return `${chrome.i18n.getMessage('justNow')} (${abs})`;
  } else if (diff < 3600000) {
    return `${chrome.i18n.getMessage('minutesAgo', [Math.floor(diff / 60000)])} (${abs})`;
  } else if (diff < 86400000) {
    return `${chrome.i18n.getMessage('hoursAgo', [Math.floor(diff / 3600000)])} (${abs})`;
  } else if (diff < 604800000) {
    return `${chrome.i18n.getMessage('daysAgo', [Math.floor(diff / 86400000)])} (${abs})`;
  }
  return abs;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

window.addEventListener('DOMContentLoaded', () => {
  // Search functionality
  document.getElementById('searchBar').addEventListener('input', (e) => {
    const search = e.target.value.toLowerCase();
    const filtered = search ? allHistory.filter(item => {
      return (item.title || '').toLowerCase().includes(search) ||
        item.url.toLowerCase().includes(search);
    }) : allHistory;
    displayHistory(filtered);
  });

  // View all history button
  document.getElementById('viewAllHistory').addEventListener('click', (e) => {
    const historyUrl = 'chrome://history/';
    if (e.metaKey || e.ctrlKey) {
      chrome.tabs.create({ url: historyUrl });
    } else {
      chrome.tabs.update({ url: historyUrl });
    }

    // Close popup after navigation
    window.close();
  });

  init();
});
