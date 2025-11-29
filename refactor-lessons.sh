#!/bin/bash

# すごいAI道場 - HTMLリファクタリングスクリプト
# 全てのレッスンHTMLファイルを新しい構造にリファクタリング

echo "🔧 すごいAI道場 HTMLリファクタリング開始..."

# カテゴリ別のHTMLファイルを処理
process_category() {
    local category=$1
    local category_css=$2
    local depth=$3

    echo "📁 Processing ${category} category..."

    for file in ${category}/*.html; do
        if [ -f "$file" ]; then
            echo "  ✏️  Refactoring: $file"

            # 一時ファイルを作成
            temp_file="${file}.tmp"

            # headセクションの置換: styles.css を新しいCSS構造に
            sed -E '
                # styles.cssの行を見つけて、4つのCSSに置き換える
                s|<link rel="stylesheet" href="\.\./styles\.css">|<link rel="stylesheet" href="../styles/base.css">\n    <link rel="stylesheet" href="../styles/nav.css">\n    <link rel="stylesheet" href="../styles/lesson.css">\n    <link rel="stylesheet" href="../styles/'"${category_css}"'.css">|g
            ' "$file" > "$temp_file"

            # navセクションの置換: <nav>...</nav> を <div id="site-header"></div> に
            sed -E '
                # nav開始タグから閉じタグまでを削除して、site-headerに置き換え
                /<nav class="main-nav">/,/<\/nav>/ {
                    /<nav class="main-nav">/ {
                        s|.*|    <div id="site-header"></div>|
                        n
                    }
                    /<\/nav>/! d
                    /<\/nav>/ d
                }
            ' "$temp_file" > "${temp_file}.2"

            # scriptセクションの置換: script.js を common.js に
            sed -E '
                s|<script src="\.\./script\.js"></script>|<script src="../common.js"></script>|g
            ' "${temp_file}.2" > "$file"

            # 一時ファイルを削除
            rm -f "$temp_file" "${temp_file}.2"

            echo "  ✅ Completed: $file"
        fi
    done
}

# チュートリアルとトップページの処理
process_root_files() {
    echo "📁 Processing root files..."

    # tutorial.html
    if [ -f "tutorial.html" ]; then
        echo "  ✏️  Refactoring: tutorial.html"
        temp_file="tutorial.html.tmp"

        sed -E '
            s|<link rel="stylesheet" href="styles\.css">|<link rel="stylesheet" href="styles/base.css">\n    <link rel="stylesheet" href="styles/nav.css">\n    <link rel="stylesheet" href="styles/lesson.css">\n    <link rel="stylesheet" href="styles/category_tutorial.css">|g
        ' "tutorial.html" > "$temp_file"

        sed -E '
            /<nav class="main-nav">/,/<\/nav>/ {
                /<nav class="main-nav">/ {
                    s|.*|    <div id="site-header"></div>|
                    n
                }
                /<\/nav>/! d
                /<\/nav>/ d
            }
        ' "$temp_file" > "${temp_file}.2"

        sed -E '
            s|<script src="script\.js"></script>|<script src="common.js"></script>|g
        ' "${temp_file}.2" > "tutorial.html"

        rm -f "$temp_file" "${temp_file}.2"
        echo "  ✅ Completed: tutorial.html"
    fi
}

# 各カテゴリを処理
process_category "howtoAI" "category_ai" "../"
process_category "startup" "category_startup" "../"
process_category "creative" "category_creative" "../"
process_category "community" "category_community" "../"

# ルートファイルを処理
process_root_files

echo ""
echo "✨ リファクタリング完了！"
echo ""
echo "📊 処理されたファイル:"
echo "  - howtoAI: $(ls howtoAI/*.html 2>/dev/null | wc -l) files"
echo "  - startup: $(ls startup/*.html 2>/dev/null | wc -l) files"
echo "  - creative: $(ls creative/*.html 2>/dev/null | wc -l) files"
echo "  - community: $(ls community/*.html 2>/dev/null | wc -l) files"
echo "  - root: 1 file (tutorial.html)"
echo ""
echo "🎉 全てのHTMLファイルが新しい構造にリファクタリングされました！"
