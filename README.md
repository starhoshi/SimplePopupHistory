# Simple Popup History

Chromeの閲覧履歴を検索可能な一覧で表示する拡張機能です。

## 機能

- 過去7日間の閲覧履歴を表示（最大1000件）
- リアルタイム検索機能（タイトル・URL対応）
- タイトル・URLのコピー機能
- コピー完了のビジュアルフィードバック
- ライト/ダークモード対応
- Cmd/Ctrlクリックで新しいタブで開く
- Chrome履歴ページへの遷移機能

## インストール方法

### 開発版（ローカル）

1. Chrome で `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」をONにする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. `extension/` フォルダを選択

### Chrome Web Store版

（公開後にリンクを追加）

## ディレクトリ構成

```
browserhistory/
├── extension/              # Chrome拡張の公開用ファイル
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── design/                 # デザイン素材
│   ├── icon512.png         # アイコン元画像
│   ├── icon.svg
│   └── simplepopuphistory.key  # Keynoteファイル
└── README.md
```

## 開発

### アイコンを更新する場合

```bash
# design/icon512.png から各サイズを生成
cd /path/to/browserhistory
sips -z 16 16 design/icon512.png --out extension/icon16.png
sips -z 48 48 design/icon512.png --out extension/icon48.png
sips -z 128 128 design/icon512.png --out extension/icon128.png
```

### リリース手順

1. `extension/` ディレクトリの内容を確認
2. `extension/` フォルダをZIP化
   ```bash
   cd extension
   zip -r ../simple-popup-history.zip .
   ```
3. Chrome Web Store Developer Dashboardにアップロード

## ライセンス

MIT
