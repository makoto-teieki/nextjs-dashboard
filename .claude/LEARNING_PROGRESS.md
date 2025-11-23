# Next.js学習進捗

最終更新: 2025-11-22

> **📚 他のドキュメント**: プロジェクト全体のドキュメント一覧は [README.md](./README.md) を参照してください。

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

### ✅ Chapter 11: 検索とページネーション
- URL検索パラメータを使った検索機能の実装
- `useSearchParams`, `usePathname`, `useRouter`フックの活用
- `useDebouncedCallback`でデバウンス処理（300ms）
- ページネーション機能の実装
- Next.js 15対応（searchParamsのawait）

**学んだこと:**
- **URL検索パラメータの利点**: 共有可能、SSR対応、分析容易
- **useSearchParams**: 現在のURLパラメータにアクセス
- **usePathname**: 現在のURLパス名を取得
- **useRouter**: クライアントコンポーネントでプログラム的にナビゲーション
- **デバウンス**: ユーザー入力後の不要なリクエストを削減
- **URLSearchParams**: URLパラメータの操作
- **Next.js 15の変更**: searchParamsはPromiseとしてawaitする必要がある

**実装内容:**
- `/app/dashboard/invoices/page.tsx`: Server Componentで検索とページネーションを処理
- `/app/ui/search.tsx`: Client Componentで検索入力とURL更新
- `/app/ui/invoices/pagination.tsx`: ページネーションUI
- `use-debounce`パッケージの導入

**機能:**
- リアルタイム検索（300msデバウンス）
- URLベースのページネーション
- 検索クエリとページ番号の同期
- 検索時にページ番号を1にリセット
- ブックマーク可能なURL

### ✅ Chapter 12: データの変更（Mutating Data）
- Server Actionsを使ったデータ変更の実装
- `'use server'`ディレクティブでServer Actionsを定義
- Zodを使ったフォームバリデーション
- 請求書の作成、更新、削除機能
- `revalidatePath`でキャッシュの再検証
- `redirect`でページ遷移

**学んだこと:**
- **Server Actions**: サーバー上で実行される非同期関数。`'use server'`で定義
- **フォームアクション**: `<form action={serverAction}>`でServer Actionsを呼び出せる
- **データベース変更**: Server ActionsからPostgreSQLに直接アクセス可能
- **Zodバリデーション**: `z.coerce.number()`で型変換、`z.enum()`で選択肢を制限
- **revalidatePath**: 指定したパスのキャッシュを再検証してUIを更新
- **redirect**: Server Actionからページ遷移を実行
- **bind()の活用**: `updateInvoice.bind(null, id)`でIDを事前に渡す

**実装内容:**
- `/app/lib/actions.ts`: Server Actionsの定義（createInvoice, updateInvoice, deleteInvoice）
- `/app/dashboard/invoices/create/page.tsx`: 請求書作成ページ
- `/app/dashboard/invoices/[id]/edit/page.tsx`: 請求書編集ページ（動的ルート）
- `/app/ui/invoices/create-form.tsx`: action属性にcreateInvoiceを設定
- `/app/ui/invoices/edit-form.tsx`: action属性にupdateInvoiceWithIdを設定
- `/app/ui/invoices/buttons.tsx`: UpdateとDeleteボタンの実装

**機能:**
- 請求書作成フォーム（顧客選択、金額入力、ステータス選択）
- 請求書編集フォーム（既存データをdefaultValueで表示）
- 削除ボタン（formでdeleteInvoiceをラップ）
- 作成・更新後に/dashboard/invoicesにリダイレクト
- 動的ルート`[id]`でIDベースの編集ページ

### ✅ Chapter 13: エラーハンドリング
- try-catchでデータベースエラーをキャッチ
- `error.tsx`で予期しないエラーをキャッチ
- `not-found.tsx`で404エラーを処理
- `notFound()`関数で意図的に404をトリガー

**学んだこと:**
- **try-catch**: Server Actionsでデータベースエラーをキャッチしてメッセージを返す
- **error.tsx**: ルートセグメント内の予期しないエラーをキャッチする特殊ファイル
- **Client Component**: error.tsxは`'use client'`が必要（resetなどのインタラクティブ機能のため）
- **reset関数**: エラーバウンダリをリセットしてコンポーネントを再レンダリング
- **not-found.tsx**: 404エラー用のカスタムUI
- **notFound()関数**: next/navigationからインポートして404をトリガー
- **Error Boundary**: error.tsxは子コンポーネントのエラーをキャッチ（ページ自体のエラーは親のerror.tsxでキャッチ）

**実装内容:**
- `/app/lib/actions.ts`: 全てのServer Actionsにtry-catchを追加
- `/app/dashboard/invoices/error.tsx`: 請求書ページのエラーUI
- `/app/dashboard/invoices/[id]/edit/not-found.tsx`: 請求書編集ページの404 UI
- `/app/dashboard/invoices/[id]/edit/page.tsx`: `notFound()`で存在しない請求書をチェック

**エラーハンドリングの階層:**
1. データベースエラー → try-catchでキャッチ → エラーメッセージを返す
2. 予期しないエラー → error.tsxでキャッチ → ユーザーに「Try again」ボタンを表示
3. リソース不在 → notFound()をトリガー → not-found.tsxで404 UIを表示

### ✅ Chapter 14: アクセシビリティの向上とフォームバリデーション
- Server-Sideバリデーションの強化
- `useActionState`フックでフォーム状態を管理
- ARIA属性を使ったアクセシブルなエラー表示
- Zodバリデーションにカスタムエラーメッセージを追加

**学んだこと:**
- **useActionState**: React 19の新しいフック（旧useFormState）でフォームの状態とアクションを管理
- **safeParse()**: Zodの`safeParse()`でグレースフルなエラーハンドリング（`parse()`と違い例外を投げない）
- **ARIA属性**: アクセシビリティのための重要な属性
  - `aria-describedby`: フィールドとエラーメッセージを関連付け
  - `aria-live="polite"`: スクリーンリーダーに変更を通知（割り込まない）
  - `aria-atomic="true"`: 領域全体を読み上げる
- **フィールドバリデーション**: 各フィールドに対して個別のエラーメッセージを表示
- **Zodカスタムメッセージ**: `invalid_type_error`、`message`オプションでユーザーフレンドリーなエラー
- **State型**: Server Actionsの戻り値の型定義で、エラー情報を構造化

**実装内容:**
- `/app/lib/actions.ts`:
  - State型を定義（errors, message）
  - createInvoiceとupdateInvoiceにprevStateパラメータを追加
  - safeParse()でバリデーションエラーをキャッチ
  - Zodスキーマにカスタムエラーメッセージを追加
- `/app/ui/invoices/create-form.tsx`:
  - `'use client'`を追加
  - useActionStateでstateを管理
  - 各フィールドにaria-describedbyを追加
  - エラーメッセージを表示するdivを追加
- `/app/ui/invoices/edit-form.tsx`:
  - useActionStateでstateを管理
  - 各フィールドにエラー表示を実装

**バリデーションルール:**
- **顧客**: 必須選択
- **金額**: $0より大きい数値
- **ステータス**: "pending"または"paid"

**アクセシビリティ向上:**
- スクリーンリーダーがエラーを読み上げられる
- キーボードナビゲーションに対応
- エラーメッセージが視覚的にわかりやすい（赤色テキスト）

### ✅ Chapter 15: 認証機能（NextAuth.js）
- NextAuth.js v5（beta）のセットアップ
- Credentials Providerでメール・パスワード認証
- Middlewareでルート保護
- ログイン・ログアウト機能の実装

**学んだこと:**
- **NextAuth.js**: 認証の複雑さを抽象化し、セッション管理、ログイン/ログアウトフローを統一的に提供
- **Middleware**: リクエストごとに認証状態をチェックし、レンダリング前にルートを保護
- **Credentials Provider**: メール・パスワードによる認証方式
- **bcrypt**: パスワードのハッシュ化（`bcrypt.compare()`で検証）
- **authorized callback**: リクエストの認可判定を行う
  - `auth?.user`でログイン状態を確認
  - ログインが必要なルートへの未認証アクセスをブロック
  - ログイン済みユーザーを適切にリダイレクト
- **AuthError**: NextAuth.jsのエラー型（CredentialsSigninなど）
- **Server Actions**: `signIn('credentials', formData)`と`signOut()`
- **セッション管理**: NextAuth.jsがクッキーで自動的にセッションを管理

**実装内容:**
- `auth.config.ts`: 認証設定
  - pagesでカスタムログインページ（/login）を指定
  - authorized callbackでルート保護ロジック
  - /dashboardへの未認証アクセスをブロック
- `middleware.ts`: Next.jsミドルウェア
  - NextAuth(authConfig).authでミドルウェアをエクスポート
  - matcherで静的ファイルを除外
- `auth.ts`: メイン認証ロジック
  - Credentials Providerの設定
  - getUser()でデータベースからユーザー取得
  - Zodでメール・パスワードをバリデーション
  - bcrypt.compare()でパスワード検証
  - auth, signIn, signOutをエクスポート
- `/app/lib/actions.ts`:
  - authenticate()関数を追加
  - AuthErrorをハンドリング
  - CredentialsSigninエラーで「Invalid credentials.」を返す
- `/app/ui/login-form.tsx`:
  - `'use client'`を追加
  - useActionState(authenticate, undefined)で状態管理
  - isPendingでボタンの無効化
  - errorMessageをaria-live="polite"で表示
- `/app/ui/dashboard/sidenav.tsx`:
  - signOut()をインラインServer Actionとして実装
  - formのactionに`async () => { 'use server'; await signOut(); }`

**認証フロー:**
1. ユーザーがログインフォームに入力
2. authenticate()がcredentialsをsignIn()に渡す
3. auth.tsのauthorize()でバリデーション
4. bcrypt.compare()でパスワード照合
5. 成功ならユーザーオブジェクトを返す
6. NextAuth.jsがセッションを作成
7. Middlewareが後続リクエストで認証状態をチェック

**テスト認証情報:**
- Email: `user@nextmail.com`
- Password: `123456`

### ✅ Chapter 16: メタデータ
- Next.js Metadata APIの実装
- タイトルテンプレートでページタイトルを効率的に管理
- ページごとのメタデータ設定
- SEO最適化

**学んだこと:**
- **Metadata API**: Next.jsの型安全なメタデータ管理システム
- **Config-based metadata**: layout.tsxやpage.tsxから`metadata` objectをexport
- **Title template**: `%s | Acme Dashboard` で各ページのタイトルを自動生成
  - `%s` がページ固有のタイトルに置換される
  - ルートレイアウトで1回定義すれば、各ページは`title: 'Page Name'`だけでOK
- **metadataBase**: Open GraphやCanonical URLのベースURL設定
- **SEOへの影響**:
  - 検索エンジンがページ内容を理解しやすくなる
  - ソーシャルメディアでのシェア時の表示改善
  - ブラウザタブでのわかりやすい表示

**実装内容:**
- `/app/layout.tsx`:
  - titleテンプレート: `'%s | Acme Dashboard'`
  - デフォルトタイトル: `'Acme Dashboard'`
  - description: アプリの概要
  - metadataBase: ベースURL
- 各ページにメタデータを追加:
  - `/app/login/page.tsx`: `title: 'Login'` → "Login | Acme Dashboard"
  - `/app/dashboard/(overview)/page.tsx`: `title: 'Dashboard'` → "Dashboard | Acme Dashboard"
  - `/app/dashboard/invoices/page.tsx`: `title: 'Invoices'` → "Invoices | Acme Dashboard"
  - `/app/dashboard/customers/page.tsx`: `title: 'Customers'` → "Customers | Acme Dashboard"

**メタデータの種類:**
- **Title metadata**: ブラウザタブに表示、検索結果のタイトル
- **Description metadata**: 検索結果の説明文
- **Open Graph metadata**: SNSシェア時のプレビュー（今回は未実装）
- **Favicon metadata**: ブラウザタブのアイコン（Next.jsが自動処理）

**ベストプラクティス:**
- ルートレイアウトでテンプレートを定義
- 各ページでは簡潔なタイトルのみを指定
- descriptionは具体的で有用な情報を含める
- 一貫性のあるメタデータで全ページをカバー

---

### ✅ Phase 4A: テスティング基盤の構築（進行中）
- Jest + React Testing Libraryのセットアップ
- 包括的なテストスイートの作成
- テストカバレッジシステムの導入

**学んだこと:**
- **Jest + React Testing Library**: Next.jsアプリのテスト環境構築
- **Testing Library原則**: ユーザーの視点でコンポーネントをテスト
- **モック戦略**: next/cache、next/navigation、postgres、next-authのモック実装
- **テストパターン**:
  - ユニットテスト: 純粋関数のテスト（utils.ts）
  - 統合テスト: Server Actionsとバリデーションのテスト
  - コンポーネントテスト: UIとユーザーインタラクションのテスト
- **アクセシビリティテスト**: ARIA属性とスクリーンリーダー対応の検証
- **カバレッジ計測**: jest --coverageでコードカバレッジを可視化

**実装内容:**
- `/jest.config.ts`: Jest設定（next/jest、jsdom環境、カバレッジ設定）
- `/jest.setup.ts`: Testing Libraryセットアップ
- `/__mocks__/`: next-auth、postgresのモック
- `/app/lib/__tests__/`:
  - `utils.test.ts` (17テスト): formatCurrency、formatDateToLocal、generateYAxis、generatePagination
  - `actions.test.ts` (10テスト): createInvoice、updateInvoice、deleteInvoice
  - `actions.validation.test.ts` (12テスト): Zodスキーマバリデーション
- `/app/ui/__tests__/`:
  - `login-form.test.tsx` (12テスト): ログインフォームのUI、バリデーション、アクセシビリティ
- `/app/ui/invoices/__tests__/`:
  - `create-form.test.tsx` (8テスト): 請求書作成フォーム
  - `edit-form.test.tsx` (13テスト): 請求書編集フォーム、既存データ表示

**テスト統計:**
- ユニット/統合テスト: 72テスト（全てパス）
- テストスイート: 6ファイル
- カバレッジ:
  - utils.ts: 100%
  - login-form.tsx: 100%
  - create-form.tsx: 96.05%
  - edit-form.tsx: 96.36%
  - actions.ts: 88.19%

**package.json scripts:**
```json
"test": "jest",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:e2e:headed": "playwright test --headed"
```

**ベストプラクティス:**
- Testing Libraryの`screen`と`userEvent`でユーザー視点のテスト
- `getByRole`、`getByLabelText`でアクセシブルなクエリを優先
- モックは`__mocks__`ディレクトリに集約
- テストファイルは`__tests__`ディレクトリに配置
- カバレッジレポート（HTML）で視覚的に未テスト箇所を確認

---

### ✅ Playwright E2Eテスト環境の構築

**学んだこと:**
- **Playwright**: ブラウザ自動化ツールでエンドツーエンドテストを実装
- **E2Eテスト**: 実際のブラウザで実ユーザーフローをテスト
- **Web Server統合**: `playwright.config.ts`で`pnpm dev`を自動起動
- **Page Object不要**: Playwrightの優れたロケーター機能で直接的なテスト記述が可能
- **テスト分離**: 各テストは独立して実行、セッション管理が重要
- **ビジュアルデバッグ**: スクリーンショット、トレース、UIモードでデバッグ容易

**実装内容:**
- `/playwright.config.ts`: Playwright設定
  - baseURL: `http://localhost:3000`
  - webServer: 開発サーバー自動起動
  - スクリーンショット: 失敗時のみ
  - トレース: リトライ時に記録
- `/e2e/auth.spec.ts` (6テスト):
  - ログインページ表示
  - 無効な認証情報でエラー表示
  - 有効な認証情報でログイン成功
  - ログアウト
  - 未認証でのリダイレクト
  - セッション永続化
- `/e2e/invoices.spec.ts` (10テスト):
  - 請求書ページ表示
  - 検索機能
  - 請求書作成フロー
  - バリデーションエラー表示
  - 請求書編集
  - 請求書削除
  - ページネーション

**テスト統計:**
- E2Eテストファイル: 2ファイル
- E2Eテスト数: 16テスト（全てパス）
- カバー範囲: 認証フロー、CRUD操作、検索、ページネーション

**Playwright機能:**
- Chromiumブラウザでテスト実行
- 並列実行対応（fullyParallel: true）
- CI環境でのリトライ設定
- HTMLレポート生成

**E2E認証問題の解決:**
1. **NextAuth v5リダイレクト処理の修正** (`app/lib/actions.ts:127-148`)
   - 問題: Server Actionsでの`signIn`がリダイレクトを自動処理せず、テストがタイムアウト
   - 原因: NextAuth v5では`redirect: false`オプションを指定して手動リダイレクトが必要
   - 解決: `signIn('credentials', { redirect: false, ...formData })` + `redirect('/dashboard')`

2. **ログアウト機能の実装** (`app/lib/actions.ts:150-153`)
   - 問題: ログアウト後にログインページにリダイレクトされない
   - 解決: 新しい`logout()`サーバーアクションを作成
   - 実装: `await signOut({ redirect: false })` + `redirect('/login')`

3. **アクセシビリティの改善** (`app/ui/invoices/buttons.tsx:23`)
   - 問題: 編集ボタンがアイコンのみで、スクリーンリーダー用テキストがない
   - 解決: `<span className="sr-only">Edit</span>`を追加
   - 効果: `getByRole('link', { name: /edit/i })`でボタンを見つけられるように

4. **ナビゲーション待機の追加** (`e2e/invoices.spec.ts:102`)
   - 問題: ページ遷移完了前にURLをチェックしてテスト失敗
   - 解決: `await page.waitForURL(/\/dashboard\/invoices\/.*\/edit/)`を追加

**最終テスト結果:**
- ✅ ユニット/統合テスト: 72/72 合格
- ✅ E2Eテスト: 16/16 合格
- ✅ **合計: 88/88 テスト全て合格**

---

## 🚧 現在の進行状況

**現在地**: Phase 4A - テスティング基盤の構築 ✅ **完了！**

**達成したこと:**
- Next.js App Routerの基礎から応用まで習得（Chapters 1-16完了）
- 認証、データ変更、エラーハンドリング、SEO最適化を実装
- 本番環境へのデプロイ完了
- **Jest + React Testing Libraryセットアップ完了**
- **72個のユニット/統合テスト作成（全てパス）**
- **主要機能のカバレッジ確保**（utils 100%, forms 96%+）
- **Playwrightセットアップ完了**
- **16個のE2Eテスト作成（全てパス）**
- **E2E認証問題を完全解決**
- **合計88テスト全て合格達成！**

**完了:**
- ✅ Phase 4A: テスティング基盤の構築（9/9完了）
  - ✅ Jest + React Testing Library
  - ✅ Utilityファイルのユニットテスト
  - ✅ Server Actionsのテスト
  - ✅ Zodバリデーション
  - ✅ Formコンポーネント
  - ✅ Playwrightのセットアップ（E2E）
  - ✅ 主要ユーザーフローのE2Eテスト
  - ✅ E2E認証問題の解決
  - ✅ NextAuth v5リダイレクト処理の理解と実装

**次のステップ:**
- Phase 4B: コード品質の向上へ
- または別のプロジェクトへ進む

---

## 📝 今後の学習予定

### Phase 1: 基礎（続き）
- [x] Chapter 5: ナビゲーション
- [x] Chapter 6: データベースのセットアップ
- [x] Chapter 7: データのフェッチング

### Phase 2: 実践
- [x] Chapter 8: 静的・動的レンダリング
- [x] Chapter 9: ストリーミング
- [x] Chapter 11: 検索とページネーション
- [x] Chapter 12: データの変更
- [x] Chapter 13: エラーハンドリング

### Phase 3: 高度な機能
- [x] Chapter 14: フォームバリデーション
- [x] Chapter 15: 認証
- [x] Chapter 16: メタデータ

### Phase 4A: テスティング基盤の構築 ✅ 完了
- [x] Jest + React Testing Libraryのセットアップ
- [x] Utilityファイル（lib/utils.ts等）のユニットテスト
- [x] Server Actionsのテスト
- [x] Zodバリデーションのテスト
- [x] Formコンポーネントのテスト
- [x] Playwrightのセットアップ（E2E）
- [x] 主要ユーザーフローのE2Eテスト
- [x] E2E認証エラーの修正
- [x] NextAuth v5リダイレクト処理の理解と実装
- [x] **最終結果: 88/88テスト全て合格**

### Phase 4B: コード品質の向上
- [ ] TypeScript strict modeの有効化
- [ ] Type-safe環境変数（zod + t3-env）
- [ ] 共通ロジックの抽出とカスタムフック作成
- [ ] コンポーネントの適切な分割
- [ ] セルフコードレビューチェックリスト作成
- [ ] PRテンプレートの作成

### Phase 4C: パフォーマンス最適化
- [ ] Lighthouse監査の実施と改善
- [ ] Bundle size分析（@next/bundle-analyzer）
- [ ] Core Web Vitalsの測定と最適化
- [ ] Dynamic Importsの活用
- [ ] 適切なMemoization（useMemo, useCallback）

### Phase 4D: 機能拡張
- [ ] ダークモード実装
- [ ] Toast通知システムの追加
- [ ] データエクスポート機能（CSV/PDF）
- [ ] フィルタリング機能の強化
- [ ] バルク操作（複数選択・削除）
- [ ] 国際化（i18n）対応

### Phase 4E: DevOps & セキュリティ
- [ ] GitHub Actionsでのテスト自動化
- [ ] E2Eテストの自動実行
- [ ] 依存関係の脆弱性チェック（Dependabot）
- [ ] CSP（Content Security Policy）の設定
- [ ] Rate limitingの実装

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
- [x] Server ActionsとClient Componentsの使い分けを理解
- [x] Jest + React Testing Libraryのセットアップ
- [x] 主要機能のテストカバレッジ確保
- [ ] E2Eテストの実装

### 中期目標（1ヶ月）
- [x] 公式チュートリアルの完走
- [x] 認証機能の実装
- [ ] Phase 4Aの完了（テスティング基盤）
- [ ] コード品質の向上（Phase 4B）

### 長期目標
- [ ] オリジナル機能の追加
- [x] 本番デプロイ（Vercel）
- [ ] 別のプロジェクトでNext.jsを使えるレベルに
- [ ] テスト駆動開発（TDD）の実践

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
| URL Search Params | ⭐⭐⭐⭐☆ | 検索とページネーションをURL管理 |
| Client Hooks (useSearchParams等) | ⭐⭐⭐⭐☆ | useSearchParams, usePathname, useRouter |
| Debouncing | ⭐⭐⭐⭐☆ | use-debounceでパフォーマンス最適化 |
| Deployment (Vercel) | ⭐⭐⭐⭐☆ | GitHubからVercelへのデプロイを実践 |
| Environment Variables | ⭐⭐⭐☆☆ | .env.localでローカル設定 |
| Server Actions | ⭐⭐⭐⭐☆ | 'use server'でサーバー関数を定義 |
| Zod Validation | ⭐⭐⭐⭐☆ | フォームデータのスキーマ検証 |
| Data Mutation | ⭐⭐⭐⭐☆ | 作成・更新・削除をServer Actionsで実装 |
| Dynamic Routes | ⭐⭐⭐⭐☆ | [id]で動的ルートを実装 |
| Error Handling | ⭐⭐⭐⭐☆ | try-catch、error.tsx、not-found.tsx |
| Error Boundary | ⭐⭐⭐⭐☆ | error.tsxで予期しないエラーをキャッチ |
| Form Validation | ⭐⭐⭐⭐☆ | Zod safeParse()でサーバーサイドバリデーション |
| useActionState | ⭐⭐⭐⭐☆ | React 19の新しいフォーム状態管理フック |
| Accessibility (ARIA) | ⭐⭐⭐⭐☆ | aria-describedby、aria-liveでスクリーンリーダー対応 |
| Authentication (NextAuth.js) | ⭐⭐⭐⭐☆ | NextAuth.js v5でCredentials Provider実装 |
| Middleware | ⭐⭐⭐⭐☆ | 認証状態チェックとルート保護 |
| Password Hashing (bcrypt) | ⭐⭐⭐⭐☆ | bcrypt.compare()でセキュアなパスワード検証 |
| Session Management | ⭐⭐⭐⭐☆ | NextAuth.jsの自動セッション管理 |
| Metadata API | ⭐⭐⭐⭐☆ | titleテンプレートでページタイトル管理 |
| SEO Optimization | ⭐⭐⭐⭐☆ | メタデータでSEOとソーシャルメディア対応 |
| Jest | ⭐⭐⭐⭐☆ | Next.jsアプリのテスト環境構築 |
| React Testing Library | ⭐⭐⭐⭐☆ | ユーザー視点のコンポーネントテスト |
| Unit Testing | ⭐⭐⭐⭐☆ | 純粋関数のユニットテスト（17テスト作成） |
| Component Testing | ⭐⭐⭐⭐☆ | Formコンポーネントのテスト（33テスト） |
| Integration Testing | ⭐⭐⭐⭐☆ | Server ActionsとZodバリデーション（22テスト） |
| Test Mocking | ⭐⭐⭐⭐☆ | Next.js関数とDBのモック実装 |
| Test Coverage | ⭐⭐⭐⭐☆ | カバレッジ計測とHTMLレポート |
| Accessibility Testing | ⭐⭐⭐⭐☆ | ARIA属性とスクリーンリーダーのテスト |
| Playwright | ⭐⭐⭐⭐⭐ | E2Eテスト環境構築、16テスト作成・全て合格 |
| E2E Testing | ⭐⭐⭐⭐⭐ | 認証フロー、CRUD操作の実ユーザーフローテスト |
| NextAuth v5 Redirects | ⭐⭐⭐⭐⭐ | Server Actionsでの`redirect: false`パターン習得 |
| Playwright | ⭐⭐⭐⭐☆ | ブラウザ自動化によるE2Eテスト |
| E2E Testing | ⭐⭐⭐⭐☆ | エンドツーエンドのユーザーフローテスト |

---

**Note**: このファイルは学習を進めるたびに更新していきます。Claude Codeと一緒に学習する際の記録として活用してください。
