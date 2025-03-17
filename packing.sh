#!/bin/bash

# エラーハンドリングを追加
set -e

# スクリプトの実行ディレクトリを基準にする
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ADDON_DIR="$SCRIPT_DIR"

# タイムスタンプを取得 (例: 20250317120733)
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# 出力ファイル名にタイムスタンプを追加
OUTPUT_FILE="addon_$TIMESTAMP.zip"

# ZIPファイルに含めるファイルを指定
INCLUDE_FILES=(
"manifest.json"
"background.js"
"content.js"
"icon.png"
)

# 一時的なZIP作成用の作業ディレクトリを安全に作成
TEMP_DIR=$(mktemp -d)

# エラーチェック: 必要なファイルが存在するか確認
for file in "${INCLUDE_FILES[@]}"; do
    if [ ! -f "$ADDON_DIR/$file" ]; then
        echo "エラー: $file が見つかりません。"
        exit 1
    fi
done

# 作業ディレクトリに必要なファイルをコピー
for file in "${INCLUDE_FILES[@]}"; do
    cp "$ADDON_DIR/$file" "$TEMP_DIR/"
done

# ZIPファイルを作成
(
    cd "$TEMP_DIR"
    zip -r "$ADDON_DIR/$OUTPUT_FILE" .
)

# 作業ディレクトリを削除
rm -rf "$TEMP_DIR"

echo "アドオンのZIPファイルが作成されました: $ADDON_DIR/$OUTPUT_FILE"