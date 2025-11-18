# 開発ガイド

このプロジェクトでは、エラーを早期に検出するための**多層チェックシステム**を採用しています。

> **📚 他のドキュメント**: プロジェクト全体のドキュメント一覧は [.claude/README.md](./.claude/README.md) を参照してください。

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

## 🔗 関連リンク

- [Next.js ESLint](https://nextjs.org/docs/app/building-your-application/configuring/eslint)
- [TypeScript Config](https://www.typescriptlang.org/tsconfig)
- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)
