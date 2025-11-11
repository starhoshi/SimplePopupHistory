# Simple Popup History

Chromeの閲覧履歴を検索可能な一覧で表示する拡張機能です。

[English README is here](./README.md)

## 機能

- 閲覧履歴を表示（最新1000件まで）
- リアルタイム検索機能（タイトル・URL対応）
- タイトル・URLのワンクリックコピー
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

[Chrome Web Storeからインストール](https://chromewebstore.google.com/detail/simple-popup-history/kceolimggmhbcildnddcfnnoogiegijd)

## ディレクトリ構成

```
browserhistory/
├── extension/              # Chrome拡張の公開用ファイル
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── _locales/           # 多言語対応
│       ├── en/
│       │   └── messages.json
│       └── ja/
│           └── messages.json
├── design/                 # デザイン素材
│   ├── icon512.png
│   ├── icon.svg
│   └── simplepopuphistory.key
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

### 言語を追加する場合

1. `extension/_locales/` に新しいフォルダを作成（例: `fr/`）
2. `en/` または `ja/` から `messages.json` をコピー
3. すべてのメッセージの値を翻訳

### リリース手順

1. `extension/` ディレクトリの内容を確認
2. ZIPファイルを作成:
   ```bash
   cd extension
   zip -r ../simple-popup-history.zip .
   ```
3. Chrome Web Store Developer Dashboardにアップロード

## 技術実装

### 使用しているChrome API

- **Chrome History API** (`chrome.history.search`)
  - 過去7日間の閲覧履歴を取得
  - APIの制限により最大1000件まで取得可能
  - テキスト、タイトル、URLで検索

- **Chrome i18n API** (`chrome.i18n`)
  - 完全な多言語対応
  - ブラウザの言語設定に基づいて自動選択

- **Chrome Tabs API** (`chrome.tabs`)
  - 履歴アイテムへのナビゲーション
  - 新しいタブで開く機能をサポート

### パフォーマンス最適化

- **遅延ロード**: 初回は20件のみ読み込んで即座にポップアップを表示
- **バックグラウンドロード**: 100ms後に残りのアイテム（最大1000件）をロード
- **スマート再描画**: 検索中でない場合のみ表示を更新

### セキュリティ機能

- **XSS対策**: すべてのユーザー生成コンテンツは`escapeHtml()`でエスケープ
- **外部スクリプト不使用**: セキュリティのためすべてのコードをインライン化
- **Manifest V3**: 最新のChrome拡張セキュリティ標準を使用
- **最小限のパーミッション**: `history`パーミッションのみを要求

### アーキテクチャ

- **単一ファイル実装**: 依存関係のない自己完結型の`popup.js`
- **インラインCSS**: CSPコンプライアンスのため`popup.html`内にすべてのスタイルを配置
- **イベント駆動**: すべてのインタラクションにネイティブDOMイベントを使用
- **レスポンシブUI**: 効率的なスクロールを備えた固定サイズ（480x550px）のポップアップ

## 対応言語

- English (デフォルト)
- 日本語

## ライセンス

MIT
