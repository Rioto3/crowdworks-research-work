// HTMLデータを保存
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveHTML') {
    // 保存処理
    browser.storage.local.get({ savedPages: [] })
      .then(data => {
        let pages = data.savedPages;
        
        // HTMLが大きすぎる場合は適切なサイズに切り詰める
        const maxHtmlLength = 5 * 1024 * 1024; // 5MBを上限に
        let htmlContent = message.pageData.html;
        if (htmlContent && htmlContent.length > maxHtmlLength) {
          htmlContent = htmlContent.substring(0, maxHtmlLength);
        }
        
        // データ保存
        const pageData = {
          ...message.pageData,
          html: htmlContent
        };
        
        pages.push(pageData);
        return browser.storage.local.set({ savedPages: pages });
      })
      .then(() => {
        // 成功時のレスポンス
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('保存エラー:', error);
        sendResponse({ success: false, error: error.toString() });
      });
    
    return true; // 非同期レスポンス用
  }
});