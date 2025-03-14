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
        
        // Firefoxのダウンロード方法 - browser.downloadsを使用
        browser.runtime.sendMessage({
          action: "download",
          content: markdown,
          filename: filename
        }).then(response => {
          // 通知表示
          notification.textContent = 'MDをダウンロードしました';
          notification.style.display = 'block';
          setTimeout(function() {
            notification.style.display = 'none';
          }, 3000);
        }).catch(error => {
          console.error('ダウンロードエラー:', error);
          notification.textContent = 'エラー: ' + error.message;
          notification.style.backgroundColor = '#f44336';
          notification.style.display = 'block';
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
// マークダウン生成関数

// マークダウン生成関数
function generateMarkdown() {
  // 基本情報
  const jobTitle = document.querySelector('h1')?.textContent.trim() || document.title;
  const category = document.querySelector('.subtitle a')?.textContent.trim() || '';
  const jobDetails = document.querySelector('.job_offer_detail_table td')?.textContent.trim() || '';
  const budget = document.querySelector('.fixed_price_budget')?.textContent.trim() || '';
  
  // 追加情報 - より単純なセレクタを使用
  const skills = Array.from(document.querySelectorAll('.skills li a')).map(el => el.textContent.trim()).join(', ') || 'なし';
  
  // テーブルから情報を取得する関数
  function getTableInfo(label) {
    const rows = document.querySelectorAll('.cw-table.summary tr');
    for (const row of rows) {
      const th = row.querySelector('th div');
      if (th && th.textContent.includes(label)) {
        return row.querySelector('td').textContent.trim();
      }
    }
    return 'なし';
  }
  
  const deadline = getTableInfo('納品希望日');
  const publishDate = getTableInfo('掲載日');
  const applyLimit = getTableInfo('応募期限');
  
  // 応募状況
  function getApplicationInfo(label) {
    const rows = document.querySelectorAll('.application_status_table tr');
    for (const row of rows) {
      const th = row.querySelector('th');
      if (th && th.textContent.includes(label)) {
        return row.querySelector('td').textContent.trim();
      }
    }
    return '';
  }
  
  const appliedCount = getApplicationInfo('応募した人');
  const contractCount = getApplicationInfo('契約した人');
  const requiredCount = getApplicationInfo('募集人数');
  const favoriteCount = getApplicationInfo('気になる！リスト');
  
  // クライアント情報
  const clientName = document.querySelector('.client_name a')?.textContent.trim() || '';
  const clientRating = document.querySelector('.average-score')?.textContent.trim() || '';
  const reviewCount = document.querySelector('.feedback_summary')?.textContent.replace(/[()]/g, '').trim() || '';
  const projectCompletionRate = document.querySelector('.eN5vt')?.textContent.trim() || '';
  const jobOfferCount = document.querySelector('.OE1Bm')?.textContent.trim() || '';
  
  // 追記情報
  const appendedInfo = document.querySelector('.appended_description')?.textContent.trim() || '';
  const appendedDate = document.querySelector('.appended_at')?.textContent.trim() || '';

  // マークダウン生成
  let md = `# ${jobTitle}\n\n`;
  md += `## カテゴリー\n${category}\n\n`;
  md += `## 予算\n${budget}\n\n`;
  
  // 案件情報
  md += `## 案件情報\n`;
  md += `- 必要スキル: ${skills}\n`;
  md += `- 納品希望日: ${deadline}\n`;
  md += `- 掲載日: ${publishDate}\n`;
  md += `- 応募期限: ${applyLimit}\n`;
  md += `- 応募状況: ${appliedCount}/${requiredCount} (応募/募集)\n`;
  md += `- 契約状況: ${contractCount}\n`;
  md += `- お気に入り: ${favoriteCount}\n\n`;
  
  // クライアント情報
  md += `## クライアント\n`;
  md += `- 名前: ${clientName}\n`;
  md += `- 評価: ${clientRating} ${reviewCount}\n`;
  md += `- 募集実績: ${jobOfferCount}件\n`;
  md += `- プロジェクト完了率: ${projectCompletionRate}%\n\n`;
  
  // 詳細
  md += `## 詳細\n${jobDetails}\n\n`;
  
  // 追記があれば追加
  if (appendedInfo) {
    md += `### 追記事項\n`;
    md += `${appendedDate}\n\n`;
    md += `${appendedInfo}\n\n`;
  }
  
  // URL
  md += `## URL\n${window.location.href}`;
  
  return md;
}






})();