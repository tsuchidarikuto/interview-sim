# MENTRY - AI面接シミュレーター

## プロジェクト概要

MENTRYは、AI技術を活用した面接練習アプリケーションです。就職活動を控えた学生や転職を考えている社会人が、実際の面接前に練習できる環境を提供します。

## 主な機能

### 🎯 面接シミュレーション
- **AIによる質問生成**: OpenAI GPT-4を使用して、履歴書と企業情報に基づいた個別の面接質問を自動生成
- **リアルタイム面接**: チャット形式と音声形式の2つのモードで面接を体験
- **難易度調整**: 簡単・普通・難しい・激ムズの4段階で面接の難易度を設定
- **面接タイプ**: 技術面接・行動面接・複合面接から選択可能

### 📝 プロフィール管理
- **履歴書作成・編集**: 名前、学歴、プログラミング経験、自己PR、志望動機などを管理
- **企業情報管理**: 面接を受ける企業の情報（会社名、ポジション、スキルセット、社風など）を登録・編集
- **設定管理**: 面接の難易度、時間、形式などの設定を保存

### 🔊 音声機能
- **Azure Speech Service統合**: 音声認識（Speech-to-Text）と音声合成（Text-to-Speech）
- **リアルタイム音声面接**: マイクを使って実際に話して面接練習が可能
- **音声フィードバック**: AIからの質問や応答を音声で聞くことができる

### 📊 結果分析・フィードバック
- **6つの評価軸**: 技術力、コミュニケーション力、チームワーク、論理的思考力、学習意欲、企業理解
- **詳細フィードバック**: ポジティブ・ネガティブな点を具体的に指摘
- **合否判定**: 総合スコアに基づく合否判定
- **興味度変化**: 面接官の興味度の変化をグラフで可視化

### 📱 ユーザー体験
- **Google OAuth認証**: 安全で簡単なログイン機能
- **レスポンシブデザイン**: PC・タブレット・スマートフォンに対応
- **履歴管理**: 過去の面接結果を確認・管理
- **ランキング機能**: 他のユーザーとのスコア比較

## 技術スタック

### フロントエンド
- **Next.js 15** (App Router)
- **React 18** 
- **TypeScript**
- **Material-UI (MUI)** - UIコンポーネント
- **Jotai** - 状態管理
- **Sass** - スタイリング

### バックエンド・データベース
- **Supabase** - データベース（PostgreSQL）・認証・リアルタイム機能
- **Google OAuth** - 認証システム

### AI・音声サービス
- **OpenAI GPT-4o-mini** - 質問生成・回答分析・フィードバック生成
- **Azure Speech Service** - 音声認識・音声合成

### 開発・デプロイ
- **Vercel** - ホスティング・デプロイ
- **ESLint** - コード品質管理

## データベース構造

### 主要テーブル
- `resumes` - 履歴書情報
- `companies` - 企業情報  
- `settings` - 面接設定
- `histories` - 面接履歴
- `interview_results` - 面接結果・評価
- `conversations` - 会話履歴
- `selected_resumes` - 選択中の履歴書
- `selected_companies` - 選択中の企業

## アプリケーションフロー

1. **ログイン**: Googleアカウントでサインイン
2. **プロフィール設定**: 履歴書・企業情報・面接設定を登録
3. **面接開始**: AI質問生成 → 面接実行（チャット/音声）
4. **結果分析**: OpenAIによる評価・フィードバック生成
5. **履歴確認**: 過去の面接結果を確認・分析

## セキュリティ・プライバシー
- OAuth 2.0による安全な認証
- Supabase Row Level Security (RLS)によるデータ保護
- 個人情報の適切な管理
- プロンプトインジェクション対策

## 開発環境

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start
```

## 環境変数

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SPEECH_KEY=your_azure_speech_key
NEXT_PUBLIC_SPEECH_REGION=your_azure_speech_region
```

## 主要ディレクトリ構成

- `app/` - Next.js App Routerのページコンポーネント
- `components/` - 再利用可能なUIコンポーネント
- `utils/` - ユーティリティ関数・データベース操作
- `atoms/` - Jotaiの状態管理
- `types.ts` - TypeScript型定義
- `styles/` - スタイリング関連ファイル