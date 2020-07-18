# discord-bot
Node.jsのdiscord.jsとGASを組み合わせたdiscord botのリポジトリです

## 動かすために
リポジトリルートに`.env`ファイルを用意する必要があります。

`.env`ファイルは以下の2つの項目を含みます。

- BOT_TOKEN: discordのbot token
- BOT_NAME: discordのbotの名前

## 構成
- リポジトリをwebアプリとして公開
- persistence.gsをGASに保存
- persistence.gs内の`setTrigger`を実行
