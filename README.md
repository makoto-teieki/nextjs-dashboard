# Next.js Dashboard - 学習プロジェクト

Next.js App Router Courseの学習を通じて構築したダッシュボードアプリケーションです。

## 🚀 デプロイ

- **本番環境**: https://nextjs-dashboard-[your-vercel-url].vercel.app
- **リポジトリ**: https://github.com/makoto-teieki/nextjs-dashboard

## 📚 プロジェクトドキュメント

### 開発者向け
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - 開発ガイド、エラーチェック、ベストプラクティス
- **[.claude/README.md](./.claude/README.md)** - Claude Code用ドキュメントインデックス

### 学習記録
- **[.claude/LEARNING_PROGRESS.md](./.claude/LEARNING_PROGRESS.md)** - 学習進捗、完了チャプター、理解度

## 🛠️ セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev

# 型チェック
pnpm run type-check

# ビルド
pnpm build
```

## 📖 学習リソース

- [Next.js Learn Course](https://nextjs.org/learn) - 公式チュートリアル
- [Next.js Documentation](https://nextjs.org/docs)

## 🤖 Claude Codeとの開発

このプロジェクトはClaude Codeと一緒に開発しています。

### セッション開始時の自動設定

**`.clinerules`** ファイルにより、Claude Codeは**自動的に**以下を実行します：
- `.claude/README.md` を読んでドキュメント構造を把握
- `LEARNING_PROGRESS.md` で学習進捗を確認
- プロジェクト固有のルールとガイドラインを適用

**何も指示しなくても、Claudeはプロジェクトの文脈を理解した状態で開始します。**

詳細は [.claude/README.md](./.claude/README.md) を参照してください。
