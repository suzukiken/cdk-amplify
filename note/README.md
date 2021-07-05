+++
title = "CDKでAmplify Appを作るためのCDKプロジェクト"
date = "2021-03-19"
tags = ["Amplify"]
+++

[別の記事](/aws/about-amplify)に書いた話のCDKの具体的なコード。

<!--more-->

## CDKのコード

サンプルの[Githubのリポジトリ](https://github.com/suzukiken/cdkamplify)

## やっていること

* AmplifyウェブアプリのソースとなるリポジトリをCodeCommitに作成する。[これについての記事](/aws/cdkamplify-repo)
* Amplify アプリケーションの作成
* カスタムドメインの設定
* AWS System Managerのパラメーターストアの名前をAmplify appの環境変数に設定
* Amplify アプリケーションからパラメーターストアへアクセス権限を追加

## パラメーターストアについて

パラメータストアを使っているのは、デプロイ時に動的にAmplifyのaws-exports.jsを取り込むようにしているためで、
その設定内容については[ウェブアプリのリポジトリの記事](/aws/cdkamplify-repo)に書いた。
