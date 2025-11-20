# 開発ガイド

このプロジェクトでは、エラーを早期に検出するための**多層チェックシステム**を採用しています。

> **📚 他のドキュメント**: プロジェクト全体のドキュメント一覧は [.claude/README.md](./.claude/README.md) を参照してください。

> **🤖 Claude Code**: `.clinerules` により、セッション開始時に自動的にプロジェクトコンテキストが読み込まれます。

## 🛡️ エラー検出の階層

```
1. エディタ（即座）← TypeScript型チェック
   ↓
2. コミット前（自動）← Git hooks (husky)
   ↓
3. プッシュ後（自動）← GitHub Actions
   ↓
4. デプロイ時（最終）← Vercel
```

---

## 📋 チェックコマンド

### 手動でチェック

```bash
# 型チェック（TypeScript）
pnpm run type-check

# 全チェック実行（現在は型チェックのみ）
pnpm run validate
```

### コミット前に自動実行される

```bash
git commit -m "message"
# ↓ 自動的に以下が実行される
# 1. pnpm run type-check
# 2. pnpm exec lint-staged（変更ファイルのみlint）
```

---

## 🔧 セットアップ（新メンバー向け）

### 1. 依存関係のインストール

```bash
pnpm install
```

これで自動的に以下が設定されます：
- Git hooks（husky）
- ESLint
- TypeScript

### 2. VS Code拡張機能のインストール

VS Codeを開くと、推奨拡張機能のインストールを促されます：
- TypeScript and JavaScript Language Features（組み込み）
- Tailwind CSS IntelliSense

---

## ⚠️ エラーが出た場合

### コミット時にエラー

```bash
# エラーメッセージを確認
✗ pnpm run type-check failed

# 手動で修正
pnpm run type-check  # エラー箇所を確認

# 再度コミット
git add .
git commit -m "message"
```

### GitHub Actionsでエラー

1. GitHubのActionsタブでエラー内容を確認
2. ローカルで `pnpm run validate` を実行
3. エラーを修正してプッシュ

---

## 📝 よくあるエラーと解決方法

### 型エラー

```
Type 'X' is not assignable to type 'Y'
```

**解決方法:**
1. `pnpm run type-check` で詳細確認
2. TypeScriptの型定義を修正
3. Vercelビルド前にローカルでチェック

**今回のような例:**
```typescript
// ❌ NG: Server Actionが値を返している
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE...`;
    return { message: 'Deleted' }; // ← 型エラー
  } catch (error) {
    return { message: 'Error' };
  }
}

// ✅ OK: voidを返す、またはthrowする
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE...`;
    // 何も返さない（void）
  } catch (error) {
    throw new Error('Failed to delete');
  }
}
```

---

## 🚀 ベストプラクティス

1. **コミット前に必ずチェック**
   ```bash
   pnpm run validate
   ```

2. **エディタの警告を無視しない**
   - TypeScriptの赤い波線
   - ESLintの黄色い警告

3. **定期的にビルドテスト**
   ```bash
   pnpm run build
   ```

4. **CI/CDのログを確認**
   - GitHub Actionsが失敗したら必ず確認
   - Vercelデプロイログも確認

---

## ✅ 実装完了時のチェックリスト

新機能やページを実装した後は、必ず以下のチェックを実施してください。

### 1. コード品質チェック

```bash
# 型チェック
pnpm run type-check

# 開発サーバー起動
pnpm dev
```

### 2. ブラウザでの動作確認（必須）

**重要**: 型チェックが通っても、実際にブラウザで確認しないと見逃すエラーがあります。

- [ ] 該当ルートにアクセスして画面が表示されるか確認
- [ ] ブラウザの開発者ツール（Console）でエラーがないか確認
- [ ] 期待通りのUIが表示されているか確認

### 3. 機能テスト

実装した機能に応じて、以下をテスト：

#### フォーム機能の場合
- [ ] 正しいデータで送信が成功するか
- [ ] バリデーションエラーが正しく表示されるか
- [ ] エラーメッセージが適切か
- [ ] ローディング状態が正しく表示されるか

#### 認証機能の場合
- [ ] 正しい認証情報でログイン成功
- [ ] 間違った認証情報でエラー表示
- [ ] 保護されたルートへの未認証アクセスがブロックされるか
- [ ] ログアウト機能が正常に動作するか

#### データ表示機能の場合
- [ ] データが正しく表示されるか
- [ ] ローディング状態が適切か
- [ ] エラー状態が適切に処理されるか
- [ ] 空のデータ状態が適切に処理されるか

### 4. 新規ルート作成時の確認

新しいルート（例: `/login`）を作成する場合：

- [ ] `app/[route]/page.tsx` ファイルが存在するか
- [ ] 必要なコンポーネントがすべて作成されているか
- [ ] ルーティングが正しく設定されているか
- [ ] Middlewareでの認証チェックが適切か（認証が必要な場合）

### 5. よくある見落とし

#### ページファイルの作成忘れ
```
❌ app/ui/login-form.tsx だけ作成
✅ app/ui/login-form.tsx + app/login/page.tsx の両方を作成
```

**教訓**: コンポーネントとページは別物。ルートには必ず `page.tsx` が必要。

#### 環境変数の設定忘れ
```
❌ .env.example だけ更新
✅ .env.local に実際の値を設定
```

#### Server Componentとの混同
```
❌ useStateを使っているのに 'use client' なし
✅ Client Componentには必ず 'use client' を追加
```

---

## 📝 実装後の振り返り

実装完了後、以下を振り返ると品質向上に繋がります：

1. **何を見落としていたか？**
   - ファイルの作成漏れ
   - 設定の追加漏れ
   - ブラウザでの確認漏れ

2. **どうすれば防げたか？**
   - チェックリストの活用
   - 公式ドキュメントの再確認
   - ブラウザでの動作確認の徹底

3. **次回への改善点**
   - Todoリストの粒度を細かく
   - 実装前に必要なファイルをリストアップ
   - 各ステップで動作確認

---

## 🔗 関連リンク

- [Next.js ESLint](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [TypeScript Config](https://www.typescriptlang.org/tsconfig)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)
