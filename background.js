// ダウンロード処理
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "download") {
    const blob = new Blob([message.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    
    return browser.downloads.download({
      url: url,
      filename: message.filename,
      saveAs: false
    }).then(() => {
      // クリーンアップ
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return { success: true };
    }).catch(error => {
      console.error("ダウンロードエラー:", error);
      return { success: false, error: error.message };
    });
  }
});