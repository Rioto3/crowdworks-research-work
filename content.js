// 即時実行
(function() {
  // ボタン追加開始
  addDownloadButton();
  
  // 遅延追加のバックアップとして
  setTimeout(addDownloadButton, 1000);
  setTimeout(addDownloadButton, 3000);

  // ボタン追加関数
  function addDownloadButton() {
    // 既に存在する場合は追加しない
    if (document.getElementById('md-save-button')) {
      return;
    }
    
    // ボタン作成
    const button = document.createElement('button');
    button.id = 'md-save-button';
    button.textContent = 'MD保存';
    
    // インラインスタイルで直接スタイル設定
    const buttonStyles = {
      position: 'fixed',
      top: '10px',
      left: '10px',
      zIndex: '2147483647',
      backgroundColor: '#0f9d58',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 12px',
      fontSize: '14px',
      fontFamily: 'sans-serif',
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    };
    
    // スタイルをボタンに適用
    Object.assign(button.style, buttonStyles);
    
    // 通知用エレメント
    const notification = document.createElement('div');
    notification.id = 'md-save-notification';
    
    // 通知のスタイル
    const notificationStyles = {
      position: 'fixed',
      top: '50px',
      left: '10px',
      zIndex: '2147483647',
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'sans-serif',
      display: 'none',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    };
    
    // スタイルを通知に適用
    Object.assign(notification.style, notificationStyles);
    
    // ボタンのクリックイベント - 即時ダウンロード
    button.addEventListener('click', function() {
      try {
        // マークダウン生成
        const markdown = generateMarkdown();
        
        // ファイル名生成
        let filename = document.title.replace(/[/\\?%*:|"<>]/g, '-');
        if (filename.length > 50) filename = filename.substring(0, 50);
        filename += '.md';
        
        // Blobの作成
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        
        // ダウンロードリンク作成
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        // リンクをクリックしてダウンロード
        document.body.appendChild(a);
        a.click();
        
        // クリーンアップ
        setTimeout(function() {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
        
        // 通知表示
        notification.textContent = 'MDをダウンロードしました';
        notification.style.display = 'block';
        setTimeout(function() {
          notification.style.display = 'none';
        }, 3000);
        
        // ストレージにも保存（オプション）
        browser.runtime.sendMessage({
          action: 'saveHTML',
          pageData: {
            title: document.title,
            url: window.location.href,
            html: document.documentElement.outerHTML,
            markdown: markdown,
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        // エラー処理
        notification.textContent = 'エラー: ' + error.message;
        notification.style.backgroundColor = '#f44336';
        notification.style.display = 'block';
        setTimeout(function() {
          notification.style.display = 'none';
        }, 3000);
        console.error('MDダウンロードエラー:', error);
      }
    });
    
    try {
      // ボタンと通知をページに追加
      document.body.appendChild(button);
      document.body.appendChild(notification);
      console.log('MD保存ボタンを追加しました');
    } catch (error) {
      console.error('ボタン追加エラー:', error);
    }
  }
  
  // マークダウン生成関数
  function generateMarkdown() {
    const pageTitle = document.title;
    let content = '';
    
    // CrowdWorksの仕事ページ
    if (window.location.href.includes('crowdworks.jp/public/jobs/')) {
      const jobTitle = document.querySelector('h1')?.textContent.trim() || pageTitle;
      const category = document.querySelector('.subtitle a')?.textContent.trim() || '';
      const jobDetails = document.querySelector('.job_offer_detail_table td')?.textContent.trim() || '';
      const budget = document.querySelector('.fixed_price_budget')?.textContent.trim() || '';
      
      content = `# ${jobTitle}\n\n` +
                `## カテゴリー\n${category}\n\n` +
                `## 予算\n${budget}\n\n` +
                `## 詳細\n${jobDetails}\n\n` +
                `## URL\n${window.location.href}`;
    } else {
      // 一般ページ
      content = `# ${pageTitle}\n\n` +
                `## URL\n${window.location.href}\n\n` +
                `## コンテンツ\n`;
      
      // コンテンツ取得
      const mainContent = document.querySelector('article') || 
                          document.querySelector('main') || 
                          document.querySelector('.content') || 
                          document.querySelector('#content');
      
      if (mainContent) {
        content += mainContent.textContent.trim()
          .replace(/\n{3,}/g, '\n\n')
          .replace(/\t/g, '  ');
      } else {
        content += document.body.textContent.trim()
          .replace(/\n{3,}/g, '\n\n')
          .replace(/\t/g, '  ')
          .substring(0, 5000);
      }
    }
    
    return content;
  }
})();