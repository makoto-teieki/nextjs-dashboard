# Next.js学習進捗

最終更新: 2025-11-12

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

---

## 🚧 現在の進行状況

**現在地**: Chapter 5 - ページ間のナビゲーション

**次にやること:**
- `<Link>`コンポーネントの使用
- アクティブなリンクの表示
- 自動コード分割とプリフェッチの理解

---

## 📝 今後の学習予定

### Phase 1: 基礎（続き）
- [ ] Chapter 5: ナビゲーション
- [ ] Chapter 6: データベースのセットアップ
- [ ] Chapter 7: データのフェッチング

### Phase 2: 実践
- [ ] Chapter 8: 静的・動的レンダリング
- [ ] Chapter 9: ストリーミング
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
（ここに学習中に困ったことを記録）

### 参考にしたリソース
- [Next.js Learn Course](https://nextjs.org/learn)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 🎯 学習目標

### 短期目標（1-2週間）
- [ ] データベース連携までの実装完了
- [ ] Server ActionsとClient Componentsの使い分けを理解

### 中期目標（1ヶ月）
- [ ] 公式チュートリアルの完走
- [ ] 認証機能の実装

### 長期目標
- [ ] オリジナル機能の追加
- [ ] 本番デプロイ（Vercel）
- [ ] 別のプロジェクトでNext.jsを使えるレベルに

---

## 📊 現在の理解度

| トピック | 理解度 | メモ |
|---------|--------|------|
| App Router | ⭐⭐⭐☆☆ | 基本は理解、複雑なルーティングはこれから |
| Server Components | ⭐⭐☆☆☆ | 概念は理解、実践的な使い分けが必要 |
| Styling (Tailwind) | ⭐⭐⭐⭐☆ | 基本的なスタイリングは問題なし |
| Data Fetching | ⭐☆☆☆☆ | これから学習 |
| Server Actions | ☆☆☆☆☆ | 未学習 |

---

**Note**: このファイルは学習を進めるたびに更新していきます。Claude Codeと一緒に学習する際の記録として活用してください。
