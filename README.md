# ZEROGRA RA Alliance Partner Portal

ZEROGRA の RA アライアンスパートナー企業向けポータルサイト。Next.js (App Router) + Tailwind CSS + Google Sheets API で構築。

## 機能
- メールアドレスのみでログイン（パートナー管理スプレッドシートと照合）
- 評価期間内売上に基づくランク表示（STANDARD / SILVER / GOLD / PLATINUM）
- 進行中の選考案件リスト表示
- HOT求人リスト / 求人データベース / 利用規約 への外部リンクバナー

## セットアップ

### 1. 依存パッケージのインストール
```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env.local` を作成し、以下を設定してください。

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
SPREADSHEET_ID_MAIN=
NEXT_PUBLIC_LOGO_URL=https://lh3.googleusercontent.com/d/1ocYgthsC2y2xag0zLA_G0umJsMbUY9ph
```

- `GOOGLE_PRIVATE_KEY` は JSON ファイル内の改行 `\n` をエスケープ済み（`\\n`）の状態で 1 行で設定します。例:
  ```
  GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
  ```
- HOT求人リスト等の外部リソースはダッシュボードからリンクバナーで遷移する設計のため、本アプリから直接 API でアクセスはしません。

### 3. サービスアカウントの作成手順

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセスし、プロジェクトを作成（または選択）。
2. 「APIとサービス」→「ライブラリ」から **Google Sheets API** を有効化。
3. 「APIとサービス」→「認証情報」→「認証情報を作成」→「サービスアカウント」を選択し作成。
4. 作成したサービスアカウントを開き、「キー」タブで「鍵を追加」→「新しい鍵を作成」→ JSON を選択しダウンロード。
5. JSON 内の `client_email` を `GOOGLE_SERVICE_ACCOUNT_EMAIL` に、`private_key` を `GOOGLE_PRIVATE_KEY` に設定（改行は `\n` のエスケープのまま）。

### 4. スプレッドシートの共有設定

パートナー・案件管理スプレッドシート（`SPREADSHEET_ID_MAIN`）を、サービスアカウントの `client_email` に対して **閲覧者** 以上で共有してください。

- シート名：`m_partner`、`アライアンス企業選考案件リスト`

### 5. 開発サーバーの起動
```bash
npm run dev
```
http://localhost:3000 でアクセス。

### 6. Vercel へのデプロイ
- リポジトリを Vercel にインポート。
- 環境変数（`GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY` / `SPREADSHEET_ID_MAIN` / `NEXT_PUBLIC_LOGO_URL`）を Vercel プロジェクト設定に登録。
- `GOOGLE_PRIVATE_KEY` は改行を含むため、Vercel の UI に貼り付ける際は `\n` をエスケープした 1 行文字列のままで OK。

## ファイル構成

```
/app
  /page.tsx              ログインページ
  /dashboard/page.tsx    ダッシュボード
  /api
    /auth/route.ts       メール照合 + 案件取得 + ランク計算
  /layout.tsx
  /globals.css
/components
  /RankBadge.tsx
  /SummaryCards.tsx
  /DealTable.tsx
  /LinkBanners.tsx
/lib
  /sheets.ts             Google Sheets API共通処理 + ランク計算
```

## ランク計算ロジック
- 評価期間：パートナー登録タイムスタンプから **180 日間**
- 期間内の `内定承諾 (入社日確定)` ステータス案件の `決定報酬額` 合計 = `periodSales`
- ランクテーブル
  - STANDARD：0円〜
  - SILVER：500万円〜
  - GOLD：1,000万円〜
  - PLATINUM：2,000万円〜
- レベニューシェア率（75% / 80% / 85% / 90%）はパートナー報酬列の計算に内部使用しますが、UI には表示しません。

## 認証
- Google OAuth ではなく、メールアドレス入力のみ。
- 一致したパートナー情報を `sessionStorage` に保存。ブラウザを閉じれば自動ログアウト。
