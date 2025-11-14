# Next.js Dashboard プロジェクト開発ガイドライン

## プロジェクト概要
このプロジェクトは、Next.js公式チュートリアル「Learn Next.js」をベースに、Claude Codeを使った実践的な学習を行うためのものです。

## 開発環境
- **フレームワーク**: Next.js (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **パッケージマネージャー**: pnpm推奨
- **開発サーバー**: Turbopack使用

## コーディング規約

### ファイル構造
```
app/
├── ui/              # UIコンポーネント
├── lib/             # ユーティリティ関数・データベース処理
├── dashboard/       # ダッシュボード機能
├── layout.tsx       # ルートレイアウト
└── page.tsx         # ホームページ
```

### TypeScript
- すべての新規ファイルは `.tsx` または `.ts` で作成
- `any` 型の使用は避け、適切な型定義を行う
- コンポーネントのPropsは必ず型定義する

### React/Next.js
- Server Componentsをデフォルトとして使用
- クライアントサイドの状態管理が必要な場合のみ `'use client'` を使用
- 画像は `<Image>` コンポーネントを使用
- リンクは `<Link>` コンポーネントを使用
- フォントは `next/font` で最適化

### CSS/スタイリング
- Tailwind CSSのユーティリティクラスを優先
- グローバルスタイルは `app/ui/global.css` に記述
- CSS Modulesは必要な場合のみ使用
- `clsx` を使った条件付きクラス名を活用

### データフェッチング
- Server ComponentsでのデータフェッチはReact Server Componentsパターンに従う
- データベース操作は `app/lib/data.ts` に集約
- エラーハンドリングを必ず実装

## Claude Codeでの開発フロー

### 1. 新機能の実装前
- 既存のコードを確認（Read tool使用）
- 影響範囲を理解してから実装開始
- 必要に応じてTodoリストで進捗管理

### 2. コード作成時
- 既存のファイル構造に従う
- 類似機能のコードを参考にする
- コメントは日本語でOK（必要な場合のみ）

### 3. 実装後の確認
- TypeScriptのエラーチェック: `npm run build`
- 開発サーバーで動作確認: `npm run dev`
- 変更内容をgit statusで確認

### 4. チャプター完了時（重要！）
**1つのチャプターを完了するごとに、必ず以下を実行する:**

1. **コードの変更をコミット**
   ```bash
   git add .
   git commit -m "[feat] Chapter X完了: 簡潔な説明"
   git push
   ```

2. **学習進捗ファイルの更新**
   - `.claude/LEARNING_PROGRESS.md` を更新
   - 完了したチャプターの詳細を追加：
     - 実装内容
     - 学んだこと
     - つまづいたポイント（あれば）
   - チェックリストを更新（`[ ]` → `[x]`）
   - 理解度テーブルを更新
   - 「現在の進行状況」を次のチャプターに更新

3. **学習進捗の変更をコミット**
   ```bash
   git add .claude/LEARNING_PROGRESS.md
   git commit -m "[docs] Chapter X完了：学習進捗を更新"
   git push
   ```

**このルールを守ることで:**
- 学習の記録が残る
- 後から振り返りやすい
- Claude Codeとの会話で常に最新の進捗を共有できる

## コミットメッセージ
```
[種別] 簡潔な説明

例:
- [feat] ダッシュボードのレイアウト追加
- [fix] フォントの読み込みエラー修正
- [style] Tailwindクラスの整理
- [docs] README更新
- [refactor] データフェッチング処理の改善
```

## 注意事項
- このプロジェクトは学習目的のため、実験的な実装もOK
- わからないことがあればClaude Codeに質問しながら進める
- 公式チュートリアルの内容を基本としつつ、独自の改善も歓迎
- エラーが出たら慌てず、エラーメッセージをClaude Codeと共有

## 参考リンク
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Next.js Learn](https://nextjs.org/learn)
- [Tailwind CSS](https://tailwindcss.com/docs)
