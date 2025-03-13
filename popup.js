document.addEventListener('DOMContentLoaded', function() {
  const pageList = document.getElementById('pageList');
  const exportAllHTMLBtn = document.getElementById('exportAllHTML');
  const exportAllMDBtn = document.getElementById('exportAllMD');
  
  // 保存したページ一覧を表示
  function displaySavedPages() {
    pageList.innerHTML = '';
    
    browser.storage.local.get({ savedPages: [] }).then(data => {
      if (data.savedPages.length === 0) {
        pageList.innerHTML = '<p class="empty-message">保存されたページはありません</p>';
        exportAllHTMLBtn.disabled = true;
        exportAllMDBtn.disabled = true;
        return;
      }
      
      exportAllHTMLBtn.disabled = false;
      exportAllMDBtn.disabled = false;
      
      // 日付の新しい順に並べ替え
      const sortedPages = [...data.savedPages].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      
      sortedPages.forEach((page, index) => {
        const div = document.createElement('div');
        div.className = 'page-item';
        
        const date = new Date(page.timestamp).toLocaleString('ja-JP');
        div.innerHTML = `
          <div class="page-title">${page.title}</div>
          <div class="page-url">${page.url}</div>
          <div class="page-date">${date}</div>
          <div class="button-group">
            <button class="download-btn" data-index="${index}">HTMLダウンロード</button>
            <button class="download-md-btn" data-index="${index}">MDダウンロード</button>
            <button class="delete-btn" data-index="${index}">削除</button>
          </div>
        `;
        pageList.appendChild(div);
      });
      
      // HTMLダウンロードボタンのイベント
      document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          downloadHTML(sortedPages[index]);
        });
      });
      
      // MDダウンロードボタンのイベント
      document.querySelectorAll('.download-md-btn').forEach(button => {
        button.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          downloadMarkdown(sortedPages[index]);
        });
      });
      
      // 削除ボタンのイベント
      document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          const pageToRemove = sortedPages[index];
          
          // 元のindexを探す
          const originalIndex = data.savedPages.findIndex(p => 
            p.timestamp === pageToRemove.timestamp && p.url === pageToRemove.url
          );
          
          if (originalIndex !== -1) {
            data.savedPages.splice(originalIndex, 1);
            browser.storage.local.set({ savedPages: data.savedPages }).then(() => {
              displaySavedPages();
            });
          }
        });
      });
    });
  }
  
  // HTMLをダウンロード
  function downloadHTML(page) {
    if (!page.html) {
      alert('このページにはHTMLデータがありません');
      return;
    }
    
    const blob = new Blob([page.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // ファイル名生成（不正な文字を除去）
    let filename = page.title.replace(/[/\\?%*:|"<>]/g, '-');
    if (filename.length > 50) filename = filename.substring(0, 50);
    filename += '.html';
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // マークダウンをダウンロード
  function downloadMarkdown(page) {
    if (!page.markdown) {
      alert('このページにはMarkdownデータがありません');
      return;
    }
    
    const blob = new Blob([page.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // ファイル名生成（不正な文字を除去）
    let filename = page.title.replace(/[/\\?%*:|"<>]/g, '-');
    if (filename.length > 50) filename = filename.substring(0, 50);
    filename += '.md';
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // すべてのHTMLをダウンロード
  exportAllHTMLBtn.addEventListener('click', function() {
    browser.storage.local.get({ savedPages: [] }).then(data => {
      if (data.savedPages.length === 0) return;
      
      data.savedPages.forEach((page, index) => {
        // 少し遅延させて連続ダウンロードによるブラウザの負荷を減らす
        setTimeout(() => {
          if (page.html) {
            downloadHTML(page);
          }
        }, index * 300);
      });
    });
  });
  
  // すべてのマークダウンをダウンロード
  exportAllMDBtn.addEventListener('click', function() {
    browser.storage.local.get({ savedPages: [] }).then(data => {
      if (data.savedPages.length === 0) return;
      
      data.savedPages.forEach((page, index) => {
        // 少し遅延させて連続ダウンロードによるブラウザの負荷を減らす
        setTimeout(() => {
          if (page.markdown) {
            downloadMarkdown(page);
          }
        }, index * 300);
      });
    });
  });
  
  // 初期表示
  displaySavedPages();
});