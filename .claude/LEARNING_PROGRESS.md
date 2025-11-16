# Next.js学習進捗

最終更新: 2025-11-16

## 📚 完了したチャプター

### ✅ Chapter 1: はじめに
- プロジェクトのセットアップ
- フォルダ構造の理解

### ✅ Chapter 2: CSSスタイリング
- Tailwind CSSの基本
- グローバルスタイルの追加
- CSS Modulesの使用（home.module.css）
- `clsx`ライブラリで条件付きスタイル

**学んだこと:**
- Tailwind CSSのユーティリティクラスの使い方
- Next.jsでのCSSの読み込み方法

### ✅ Chapter 3: フォントと画像の最適化
- `next/font`でカスタムフォント（Lusitana, Inter）の追加
- `next/image`コンポーネントで画像の最適化
- レスポンシブ画像の実装

**学んだこと:**
- Next.jsの自動的な画像最適化
- フォントのサブセット化とプリロード

### ✅ Chapter 4: レイアウトとページの作成
- App Routerでのルーティング基礎
- ネストされたレイアウトの作成
- ダッシュボードページの作成（/dashboard, /dashboard/customers, /dashboard/invoices）
- SideNavコンポーネントの実装

**学んだこと:**
- フォルダベースのルーティング
- layout.tsxとpage.tsxの役割
- レイアウトの入れ子構造

### ✅ Chapter 5: ページ間のナビゲーション
- `<Link>`コンポーネントでクライアントサイドナビゲーション実装
- `usePathname()`フックでアクティブなリンク表示
- NavLinksコンポーネントをClient Componentに変更
- `clsx`で条件付きスタイリング

**学んだこと:**
- Next.jsの自動コード分割とプリフェッチング
- Client ComponentとServer Componentの使い分け
- `<Link>`vs`<a>`タグの違い
- ページ全体をリロードせずに高速ナビゲーション

### ✅ Chapter 6: データベースのセットアップ
- GitHubリポジトリの作成（https://github.com/makoto-teieki/nextjs-dashboard）
- Vercelへのデプロイ
- Neon Postgres（Serverless PostgreSQL）の作成
- データベースシードスクリプトの実行（/seed）
- 環境変数（POSTGRES_URL等）の設定

**学んだこと:**
- GitHub CLIの使い方
- Vercelでのデプロイフロー
- Neon Postgresの統合
- データベーススキーマの作成（Users, Customers, Invoices, Revenue）
- bcryptでのパスワードハッシュ化

**作成したデータ:**
- Users: 1件
- Customers: 6件
- Invoices: 15件
- Revenue: 12ヶ月分

### ✅ Chapter 7: データのフェッチング
- Server Componentsで`async/await`を使用してデータフェッチング
- `fetchRevenue()`、`fetchLatestInvoices()`、`fetchCardData()`を実装
- ダッシュボードページにCards、RevenueChart、LatestInvoicesを表示
- ローカル環境で`.env.local`を使用してPostgres接続

**学んだこと:**
- Server Componentsはサーバー上でのみ実行される
- データベースに直接接続できる（APIレイヤー不要）
- `async/await`でデータフェッチングがシンプルに
- 環境変数（`.env.local`）でローカル開発環境を設定

**トラブルシューティング:**
- ローカルでPOSTGRES_URLが必要
- Vercel CLIで環境変数を取得（または手動設定）

### ✅ Chapter 8: 静的・動的レンダリング
- 静的レンダリング（Static Rendering）と動的レンダリング（Dynamic Rendering）の違いを理解
- `fetchRevenue()`に3秒の遅延を追加してパフォーマンス問題を再現
- 遅いデータフェッチがページ全体をブロックする問題を体験（7.6秒の遅延）

**学んだこと:**
- **静的レンダリング**: ビルド時にレンダリング、結果をキャッシュ、高速・SEO向上
- **動的レンダリング**: リクエスト時にレンダリング、リアルタイムデータ・パーソナライズに最適
- **データフェッチングのウォーターフォール問題**: 「アプリケーションは最も遅いデータフェッチと同じ速度でしか動かない」
- ダッシュボードのような頻繁に更新されるデータには動的レンダリングが適している
- Next.jsは動的関数（cookies、headers、searchParams）を検出すると自動的に動的レンダリングに切り替わる

**パフォーマンス測定:**
- `fetchRevenue()`の遅延: 3秒
- ダッシュボードページ全体の読み込み: 7.6秒
- 他のデータフェッチ（`fetchLatestInvoices()`、`fetchCardData()`）も順次実行されている

### ✅ Chapter 9: ストリーミング
- ストリーミング（Streaming）を使ってデータフェッチングのウォーターフォール問題を解決
- `loading.tsx`でページレベルのローディングUI実装
- Route Groups `(overview)`を使って`loading.tsx`のスコープを限定
- データフェッチをコンポーネント内に移動（`CardWrapper`, `RevenueChart`, `LatestInvoices`）
- React Suspenseで個別コンポーネントをラップしてストリーミング実装
- RevenueChartとLatestInvoicesのコンテンツのコメントを解除して表示

**学んだこと:**
- **ストリーミング**: ページを小さなチャンク（chunk）に分割して順次レンダリング
- **loading.tsx**: Next.jsが自動的にSuspenseでラップする特殊ファイル
- **Route Groups**: `(folder)`形式でURLパスに影響を与えずにファイルを整理
- **React Suspense**: コンポーネントレベルでローディング状態を管理し、細かい制御が可能
- **並列データフェッチ**: 各コンポーネントが独立してデータフェッチするため、全体のパフォーマンスが向上
- **スケルトンUI**: ユーザーにコンテンツが読み込み中であることを視覚的に伝える

**実装内容:**
- `/app/dashboard/(overview)/loading.tsx`: ページレベルのローディング
- `/app/dashboard/(overview)/page.tsx`: Suspenseでコンポーネントをラップ
- `/app/ui/dashboard/cards.tsx`: CardWrapperでfetchCardData()を呼び出し
- `/app/ui/dashboard/revenue-chart.tsx`: コンポーネント内でfetchRevenue()を呼び出し、チャート表示
- `/app/ui/dashboard/latest-invoices.tsx`: コンポーネント内でfetchLatestInvoices()を呼び出し、リスト表示

**パフォーマンス改善:**
- **ページ全体の読み込み時間**: 7.6秒 → **3.2秒** (58%改善！)
- 遅い`RevenueChart`（3秒）が他のコンポーネントをブロックしなくなった
- ユーザーは即座にページタイトルと、準備できたコンポーネントから順に見ることができる
- 視覚的フィードバック（スケルトンUI）でUX向上

---

## 🚧 現在の進行状況

**現在地**: Chapter 10 - Partial Prerendering

**次にやること:**
- Partial Prerendering（部分的プリレンダリング）の概念を学ぶ
- 静的コンテンツと動的コンテンツの組み合わせ

---

## 📝 今後の学習予定

### Phase 1: 基礎（続き）
- [x] Chapter 5: ナビゲーション
- [x] Chapter 6: データベースのセットアップ
- [x] Chapter 7: データのフェッチング

### Phase 2: 実践
- [x] Chapter 8: 静的・動的レンダリング
- [x] Chapter 9: ストリーミング
- [ ] Chapter 10: Partial Prerendering
- [ ] Chapter 11: 検索とページネーション
- [ ] Chapter 12: データの変更
- [ ] Chapter 13: エラーハンドリング

### Phase 3: 高度な機能
- [ ] Chapter 14: フォームバリデーション
- [ ] Chapter 15: 認証
- [ ] Chapter 16: メタデータ

### Phase 4: 独自実装
- [ ] カスタム機能の追加
- [ ] リファクタリング
- [ ] テストの追加
- [ ] パフォーマンス最適化

---

## 💡 学習メモ

### 重要な概念
- **Server Components**: デフォルトでサーバーサイドでレンダリング
- **Client Components**: `'use client'`ディレクティブで明示的に指定
- **App Router**: ファイルシステムベースのルーティング
- **レイアウト**: 複数ページで共有されるUI

### つまづいたポイント
- **環境変数のプレフィックス**: NeonデータベースをVercelプロジェクトに接続する際、環境変数のプレフィックスを`POSTGRES`に設定する必要があった（デフォルトは`STORAGE`）
- **シードスクリプト**: `app/seed/route.ts`が`POSTGRES_URL`を使用しているため、正しいプレフィックスが重要

### 参考にしたリソース
- [Next.js Learn Course](https://nextjs.org/learn)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 🎯 学習目標

### 短期目標（1-2週間）
- [x] データベース連携までの実装完了
- [ ] Server ActionsとClient Componentsの使い分けを理解

### 中期目標（1ヶ月）
- [ ] 公式チュートリアルの完走
- [ ] 認証機能の実装

### 長期目標
- [ ] オリジナル機能の追加
- [x] 本番デプロイ（Vercel）
- [ ] 別のプロジェクトでNext.jsを使えるレベルに

---

## 📊 現在の理解度

| トピック | 理解度 | メモ |
|---------|--------|------|
| App Router | ⭐⭐⭐⭐☆ | ルーティング、レイアウト、ナビゲーションを理解 |
| Server Components | ⭐⭐⭐⭐☆ | サーバーサイドでのデータフェッチングを実践 |
| Client Components | ⭐⭐⭐☆☆ | usePathnameなどのHooksを使用 |
| Styling (Tailwind) | ⭐⭐⭐⭐☆ | 基本的なスタイリングは問題なし |
| Database (Postgres) | ⭐⭐⭐⭐☆ | セットアップ、シード、フェッチング完了 |
| Data Fetching | ⭐⭐⭐⭐☆ | async/awaitでデータベースからデータ取得 |
| Static Rendering | ⭐⭐⭐⭐☆ | ビルド時レンダリングの概念を理解 |
| Dynamic Rendering | ⭐⭐⭐⭐☆ | リクエスト時レンダリングの概念を理解 |
| Performance | ⭐⭐⭐⭐☆ | ストリーミングで大幅改善 |
| Streaming | ⭐⭐⭐⭐☆ | React Suspenseとloading.tsxを実装 |
| React Suspense | ⭐⭐⭐⭐☆ | コンポーネントレベルのローディング管理 |
| Route Groups | ⭐⭐⭐⭐☆ | (folder)でスコープ限定 |
| Deployment (Vercel) | ⭐⭐⭐⭐☆ | GitHubからVercelへのデプロイを実践 |
| Environment Variables | ⭐⭐⭐☆☆ | .env.localでローカル設定 |
| Server Actions | ☆☆☆☆☆ | 未学習 |

---

**Note**: このファイルは学習を進めるたびに更新していきます。Claude Codeと一緒に学習する際の記録として活用してください。
