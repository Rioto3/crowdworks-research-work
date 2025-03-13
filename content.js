// 即時実行
(function() {
  // ボタン追加
  setTimeout(addDownloadButton, 1000);

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
      left: '50%',
      transform: 'translateX(-50%)',
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
        
        // ダウンロード処理
        downloadFile(markdown, filename, 'text/markdown');
        
        // 通知表示
        notification.textContent = 'MDをダウンロードしました';
        notification.style.display = 'block';
        setTimeout(function() {
          notification.style.display = 'none';
        }, 3000);
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
    
    // ボタンと通知をページに追加
    document.body.appendChild(button);
    document.body.appendChild(notification);
    console.log('MD保存ボタンを追加しました');
  }
  
  // ファイルダウンロード関数
  function downloadFile(content, filename, contentType) {
    // Blobの作成
    const blob = new Blob([content], { type: contentType });
    
    // ダウンロードリンク作成
    const a = document.createElement('a');
    a.download = filename;
    
    // IE11対応
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, filename);
      return;
    }
    
    // モダンブラウザ対応
    const url = URL.createObjectURL(blob);
    a.href = url;
    
    // 不可視要素としてDOMに追加
    a.style.display = 'none';
    document.body.appendChild(a);
    
    // クリックをトリガー
    a.click();
    
    // クリーンアップ
    setTimeout(function() {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
  
  // マークダウン生成関数
  function generateMarkdown() {
    const jobTitle = document.querySelector('h1')?.textContent.trim() || document.title;
    const category = document.querySelector('.subtitle a')?.textContent.trim() || '';
    const jobDetails = document.querySelector('.job_offer_detail_table td')?.textContent.trim() || '';
    const budget = document.querySelector('.fixed_price_budget')?.textContent.trim() || '';
    
    return `# ${jobTitle}\n\n` +
           `## カテゴリー\n${category}\n\n` +
           `## 予算\n${budget}\n\n` +
           `## 詳細\n${jobDetails}\n\n` +
           `## URL\n${window.location.href}`;
  }
})();