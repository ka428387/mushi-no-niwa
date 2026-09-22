# 公開前チェック

`git push` のたびに `.git/hooks/pre-push` から `tools/check.py` が自動で走り、1つでも失敗したら公開を止めます。

- 1段目（数秒）：構文（JavaScriptCore＝iPhoneのSafariと同じ）、読み込むファイルがそろっているか、sw.js のキャッシュ番号を上げたか、取り込みでぶつかった跡
- 2段目（20〜30秒）：画面を出さない Chrome で `index.html?selftest` を開き、アプリ内の自動テストを実行

手動で走らせる： `python3 tools/check.py`（`--quick` で1段目だけ）

フックは git の管理外なので、クローンし直したときは次で入れ直す：

```sh
cp tools/pre-push .git/hooks/pre-push && chmod +x .git/hooks/pre-push
```
