# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Simple Popup HistoryはChrome拡張機能で、過去7日間のブラウザ履歴を検索可能なポップアップで表示します。Manifest V3に準拠しており、リアルタイム検索、コピー機能、ダーク/ライトモード対応を備えています。

## ディレクトリ構造

- `extension/` - Chrome拡張の公開用ファイル（このフォルダをChromeに読み込む）
  - `manifest.json` - Chrome拡張のマニフェストファイル（Manifest V3）
  - `popup.html` - ポップアップUI（インラインCSS含む）
  - `popup.js` - ポップアップのロジック（履歴取得、検索、表示）
  - `icon*.png` - 各サイズのアイコン（16px, 48px, 128px）
  - `_locales/` - 多言語化リソース（Chrome i18n）
    - `en/messages.json` - 英語メッセージ（デフォルトロケール）
    - `ja/messages.json` - 日本語メッセージ
- `design/` - デザイン素材
  - `icon512.png` - アイコンの元画像
  - `icon.svg` - アイコンのSVG版
  - `simplepopuphistory.key` - Keynoteデザインファイル

## 主要コンポーネント

### popup.js のアーキテクチャ

1. **初期化フロー** (`init()`)
   - 最初の20件のみ即座に表示してポップアップを高速表示
   - 100ms後にバックグラウンドで残り980件を遅延ロード（最大1000件）
   - Chrome History API: 過去7日間の履歴を取得

2. **履歴表示** (`displayHistory()`)
   - ファビコンはGoogleのfaviconサービスを使用（64pxサイズ）
   - SVGアイコン（コピー・チェック）をインライン定義
   - XSS防止のため`escapeHtml()`を使用
   - 各アイテムに`data-url`と`data-title`を格納

3. **検索機能**
   - リアルタイム検索（タイトルとURLを対象）
   - `allHistory`配列をフィルタリングして再表示

4. **コピー機能**
   - タイトル・URL個別にコピー可能
   - コピーボタンはホバー時のみ表示（opacity制御）
   - コピー成功時にチェックアイコンに変化、ホバー解除でリセット

5. **ナビゲーション**
   - 通常クリック: 現在のタブで開く
   - Cmd/Ctrlクリック: 新しいタブで開く
   - コピーボタンクリック時は`stopPropagation()`でナビゲーション防止

### popup.html の構造

- スタイルは完全にインライン（`<style>`タグ）
- ライト/ダークモードは`@media (prefers-color-scheme: dark)`で自動切替
- レイアウト: ヘッダー（検索）、スクロール可能な履歴リスト、フッター（全件確認ボタン）
- 初期表示時は`#app`を`visibility: hidden`にして、履歴ロード後に表示（チラつき防止）

## 開発コマンド

### ローカルでテスト

1. Chromeで`chrome://extensions/`を開く
2. デベロッパーモードをON
3. 「パッケージ化されていない拡張機能を読み込む」で`extension/`フォルダを選択

### アイコン更新

```bash
# design/icon512.png から各サイズを生成（macOSのsipsコマンド）
sips -z 16 16 design/icon512.png --out extension/icon16.png
sips -z 48 48 design/icon512.png --out extension/icon48.png
sips -z 128 128 design/icon512.png --out extension/icon128.png
```

### リリース

```bash
cd extension
zip -r ../simple-popup-history.zip .
```

生成されたZIPファイルをChrome Web Store Developer Dashboardにアップロード。

## 多言語化（i18n）の仕組み

この拡張機能はChrome i18n APIを使用して多言語対応しています。

### 基本構造

- **デフォルトロケール**: `en`（英語）- manifest.jsonで`"default_locale": "en"`を設定
- **対応言語**: 英語（en）、日本語（ja）

### メッセージ定義

`_locales/{言語コード}/messages.json`に各言語のメッセージを定義：

```json
{
  "extName": {
    "message": "Simple Popup History",
    "description": "拡張機能の名前"
  },
  "searchPlaceholder": {
    "message": "履歴を検索...",
    "description": "検索欄のプレースホルダー"
  }
}
```

### プレースホルダー機能

動的な値を含むメッセージには`placeholders`を使用：

```json
{
  "minutesAgo": {
    "message": "$COUNT$分前",
    "description": "分単位の時刻表示",
    "placeholders": {
      "count": {
        "content": "$1"
      }
    }
  }
}
```

JavaScript側では`chrome.i18n.getMessage("minutesAgo", [数値])`で使用。

### manifest.jsonでの使用

拡張機能の名前と説明を多言語化：

```json
{
  "name": "__MSG_extName__",
  "description": "__MSG_extDescription__"
}
```

### HTMLでの使用

`data-i18n`属性または`data-i18n-placeholder`属性でメッセージキーを指定：

```html
<!-- テキストコンテンツ -->
<button id="viewAllHistory" data-i18n="viewAllHistory"></button>

<!-- プレースホルダー -->
<input type="text" id="searchBar" data-i18n-placeholder="searchPlaceholder">
```

JavaScriptの初期化時に`chrome.i18n.getMessage()`を使ってこれらの要素に値をセット。

### 新しい言語を追加する場合

1. `extension/_locales/{言語コード}/`フォルダを作成
2. `messages.json`を作成し、既存のメッセージキーをすべて翻訳
3. 拡張機能を再読み込み（ブラウザの言語設定に応じて自動選択）

## 技術的な考慮事項

- **Manifest V3対応**: `chrome.history`パーミッションのみ使用
- **パフォーマンス**: 初回20件表示後に遅延ロードで体感速度を改善
- **セキュリティ**: `escapeHtml()`でXSS対策、外部スクリプト不使用
- **アクセシビリティ**: ホバー状態でのみコピーボタンを表示してUIをクリーンに保つ
- **レスポンシブ対応**: 固定サイズ（480x550px）のポップアップ
- **履歴取得制限**: Chrome History APIの制約により最大1000件、過去7日間
- **多言語化**: Chrome i18n APIによる完全な多言語対応、ブラウザ設定で自動切替
