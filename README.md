# PCノート

PC・GPU・ゲーム・ローカルAI・動画編集の情報を扱う日本語の静的サイトです。Next.jsの静的exportを使い、ビルド成果物は`out/`に生成します。

## ローカル開発

```bash
npm install
npm run dev
```

未設定時のサイトURLは開発用`http://localhost:3000`です。この状態ではcanonicalとsitemapにホストURLを出力しません。

## 公開手順

1. `npm install`を実行します。
2. 実際に公開するサイトのoriginを`.env.production.local`（Gitへ登録しない）またはデプロイ環境の環境変数へ設定します。

   ```dotenv
   NEXT_PUBLIC_SITE_URL=https://公開する実ドメイン
   ```

   HTTPSのorigin（例: `https://www.example.jp`）を指定します。サブパスではなく、実際にcanonicalとして使うホストを設定してください。未設定や不正値の場合はビルドできますが、本番URLを含むcanonical、sitemap、RSSのリンクは出力されません。プレースホルダーのドメインを設定しないでください。

3. `npm run catalog`で商品データを検証します。
4. `npm run content:validate`で記事Frontmatterを検証します。
5. `npm run lint`を実行します。
6. `npm run typecheck`を実行します。
7. `npm run build`を実行します。静的サイトホストへ`out/`の内容を配置します。
8. 使用する静的ホスティングサービスで独自ドメインとHTTPSを設定し、環境変数をビルド環境に登録します。環境変数変更後は再ビルド・再配置してください。
9. Google Search ConsoleでドメインまたはURLプレフィックスプロパティを所有権確認します。
10. 公開URLから`/robots.txt`と`/sitemap.xml`を確認し、Search Consoleのサイトマップ機能へ`https://公開する実ドメイン/sitemap.xml`を登録します。主要ページをURL検査し、インデックス登録をリクエストします。反映には時間がかかる場合があります。

## 記事・出典

`content/articles/`へMarkdownファイルを追加します。ファイル名がslugになります。Frontmatterに`title`、`description`、`date`、任意の`updated`、`category`、`tags`、`gpuIds`、`related`、`faqs`などを設定します。`updated`がない記事は公開日のみを表示します。

出典は次の配列形式で管理し、記事末尾に「参考・出典」として表示できます。

```yaml
sources:
  - name: "出典の名称"
    url: "https://公式または参照先のURL"
    checkedAt: "YYYY-MM-DD"
```

登録する出典と確認日は実際に確認した情報を記載してください。`npm run content:validate`は日付、分類、slug、GPU参照、出典URLなどを検証します。

## 商品カタログ

`data/products.json`にProduct、`data/offers.json`にShopOfferを保存します。商品は`npm run product`、販売情報は`npm run offer`で対話登録できます。検証は`npm run catalog`で実行します。未確認の商品、価格、販売URLは登録しないでください。スクレイピングや自動価格取得は行いません。

## 公開前の確認

- お問い合わせ方法を提供する場合は、連絡を受けて対応できる連絡先またはフォームを実際に設定してください。現在のContactページからは送信できません。
- アクセス解析やCookieを使うサービスを追加した場合は、実装前にプライバシーポリシーを実態に合わせて更新してください。
- アフィリエイトプログラムの利用開始時には、契約条件と表示要件を確認し、広告リンク近くの表示を点検してください。
- Search Consoleの所有権確認、サイトマップ送信、代表URLのインデックス状況を確認してください。

## コマンド

```bash
npm run product
npm run offer
npm run catalog
npm run content:validate
npm run lint
npm run typecheck
npm run build
```
