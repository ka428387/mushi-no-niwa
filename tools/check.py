#!/usr/bin/env python3
"""Izayoi 公開前チェック

使い方:
  python3 tools/check.py                 いまのフォルダの中身をチェック
  python3 tools/check.py --commit HEAD   コミット済みの版を取り出してチェック
  python3 tools/check.py --quick         ファイルの点検だけ（Chromeで動かすテストを省く）

git の pre-push フックから --commit <公開する版> --base <公開中の版> で呼ばれ、
1つでも失敗したら公開（push）を止める。
"""
import argparse, http.server, json, os, re, shutil, subprocess, sys, tempfile, threading, time

JSC = '/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc'
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# キャッシュ番号を上げなくてよいファイル（アプリの表示に関係しない）
NO_CACHE_BUMP = re.compile(r'^(tools/|README\.md$|LICENSE$|\.gitignore$)')

failures = []

def ok(msg): print(f'  ✓ {msg}')
def ng(msg, detail=''):
    failures.append(msg)
    print(f'  ✗ {msg}' + (f'\n      {detail}' if detail else ''))

def git(*a, cwd=REPO):
    return subprocess.run(['git', *a], cwd=cwd, capture_output=True, text=True).stdout

# ───────── 1段目：ファイルの点検 ─────────
def check_syntax(root):
    html = open(os.path.join(root, 'index.html'), encoding='utf-8').read()
    scripts = re.findall(r'<script>(.*?)</script>', html, re.S)
    tmp = tempfile.mkdtemp()
    targets = []
    for i, js in enumerate(scripts):
        p = os.path.join(tmp, f'index-script{i+1}.js'); open(p, 'w', encoding='utf-8').write(js); targets.append(('index.html', p))
    targets.append(('sw.js', os.path.join(root, 'sw.js')))
    for label, p in targets:
        r = subprocess.run([JSC, '-e', f'checkSyntax({json.dumps(p)})'], capture_output=True, text=True)
        if r.returncode:
            line = re.search(r':(\d+)\n', r.stdout + r.stderr)
            ng(f'構文エラー：{label}', (r.stdout + r.stderr).strip().splitlines()[0] + (f'（スクリプト内 {line.group(1)} 行目）' if line else ''))
        else:
            ok(f'構文OK：{label}（iPhoneのSafariと同じJavaScriptCoreで確認）')
    shutil.rmtree(tmp, ignore_errors=True)
    return html

def check_files(root, html):
    need = set()
    sw = open(os.path.join(root, 'sw.js'), encoding='utf-8').read()
    need |= {p[2:] for p in re.findall(r"'(\./[^']+)'", sw) if p not in ('./',)}
    man = json.load(open(os.path.join(root, 'manifest.webmanifest'), encoding='utf-8'))
    need |= {i['src'] for i in man.get('icons', [])}
    need |= set(re.findall(r'''(?:src|href)=["']((?:assets|icons)/[^"']+)["']''', html))
    need |= set(re.findall(r"url\('((?:assets|icons)/[^']+)'\)", html))
    need |= set(re.findall(r"'(assets/[^'$`]+\.(?:png|jpg|svg))'", html))
    need |= {f'assets/fields/{a}' for a in re.findall(r"art:'([^']+)'", html)}
    need |= {f'assets/insects/{k}.png' for k in re.findall(r"^  (\w+):\{name:'[^']*',voice:", html, re.M)}
    missing = sorted(p for p in need if not os.path.exists(os.path.join(root, p)))
    if missing: ng('読み込むファイルが見つからない', ', '.join(missing))
    else: ok(f'読み込むファイルがすべてそろっている（{len(need)}個）')
    # オフライン用の一覧（sw.js）に、アプリが読む画像が入っているか
    listed = {p[2:] for p in re.findall(r"'(\./[^']+)'", sw)}
    unlisted = sorted(p for p in need if p.startswith('assets/') and p not in listed)
    if unlisted: ng('オフライン用の一覧（sw.js）に入っていない画像がある', ', '.join(unlisted))
    else: ok('オフライン用の一覧（sw.js）に画像がすべて入っている')

def check_markers(root):
    bad = []
    for dp, dn, fn in os.walk(root):
        dn[:] = [d for d in dn if d != '.git']
        for f in fn:
            if not f.endswith(('.html', '.js', '.json', '.webmanifest', '.md', '.css', '.py')): continue
            p = os.path.join(dp, f)
            for n, line in enumerate(open(p, encoding='utf-8', errors='ignore'), 1):
                if re.match(r'^(<{7}|>{7}|={7})( |$)', line): bad.append(f'{os.path.relpath(p, root)}:{n}')
    if bad: ng('取り込みでぶつかった跡（<<<<<<< など）が残っている', ', '.join(bad[:8]))
    else: ok('取り込みでぶつかった跡は残っていない')

def check_cache_bump(root, base, commit):
    if not base: print('  - キャッシュ番号：比べる版がないので省略'); return
    changed = [f for f in git('diff', '--name-only', base, *([commit] if commit else [])).split('\n') if f and not NO_CACHE_BUMP.match(f)]
    if not changed: ok('キャッシュ番号：アプリの中身は変わっていない'); return
    old = re.search(r"const CACHE = '([^']+)'", git('show', f'{base}:sw.js') or '')
    new = re.search(r"const CACHE = '([^']+)'", open(os.path.join(root, 'sw.js'), encoding='utf-8').read())
    if old and new and old.group(1) == new.group(1):
        ng('中身を変えたのに、キャッシュ番号（sw.js の CACHE）を上げていない', f"{new.group(1)} のまま。iPhoneで古い版が出続ける。変更: {', '.join(changed[:6])}")
    else:
        ok(f"キャッシュ番号：{old.group(1) if old else '?'} → {new.group(1) if new else '?'}")

# ───────── 2段目：画面を出さないChromeで実際に動かす ─────────
def run_selftest(root, timeout=90):
    if not os.path.exists(CHROME):
        ng('Chrome が見つからないので動作テストができない'); return
    res = {}
    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(s, *a, **k): super().__init__(*a, directory=root, **k)
        def log_message(s, *a): pass
        def do_POST(s):
            n = int(s.headers.get('Content-Length', 0)); res['r'] = json.loads(s.rfile.read(n) or b'{}')
            s.send_response(204); s.end_headers()
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), H)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    ud = tempfile.mkdtemp()
    p = subprocess.Popen([CHROME, '--headless=new', '--autoplay-policy=no-user-gesture-required', '--no-first-run',
                          '--no-default-browser-check', '--window-size=390,844', f'--user-data-dir={ud}',
                          f'http://127.0.0.1:{srv.server_address[1]}/index.html?selftest'],
                         stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    t0 = time.time()
    while 'r' not in res and time.time() - t0 < timeout and p.poll() is None: time.sleep(.3)
    p.kill(); srv.shutdown(); shutil.rmtree(ud, ignore_errors=True)
    if 'r' not in res:
        ng('動作テストが最後まで終わらなかった', f'{timeout}秒以内に結果が返ってこない（途中で止まった可能性）'); return
    for r in res['r'].get('results', []):
        (ok if r['ok'] else ng)(r['name'], *([r['detail']] if not r['ok'] and r.get('detail') else []))
    print(f'    （{time.time() - t0:.0f}秒）')

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--commit', help='この版を取り出してチェック（省略時はいまのフォルダ）')
    ap.add_argument('--base', help='比べる版（キャッシュ番号の確認用。省略時は origin/main）')
    ap.add_argument('--quick', action='store_true', help='Chromeでの動作テストを省く')
    a = ap.parse_args()
    root, tmp = REPO, None
    if a.commit:
        tmp = tempfile.mkdtemp()
        subprocess.run(f'git archive {a.commit} | tar -x -C "{tmp}"', shell=True, cwd=REPO, check=True)
        root = tmp
    base = a.base or (git('rev-parse', '--verify', '-q', 'origin/main').strip() or None)
    label = a.commit or 'いまのフォルダ'
    print(f'\n■ Izayoi 公開前チェック（{label}）\n\n1段目：ファイルの点検')
    html = check_syntax(root)
    check_files(root, html); check_markers(root); check_cache_bump(root, base, a.commit)
    if not a.quick:
        if any(f.startswith('構文エラー') for f in failures):
            print('\n2段目：構文エラーがあるので動作テストは省略')
        else:
            print('\n2段目：画面を出さないChromeで動かす')
            run_selftest(root)
    if tmp: shutil.rmtree(tmp, ignore_errors=True)
    if failures:
        print(f'\n✗ {len(failures)}件の問題があります。直してから公開してください。\n'); sys.exit(1)
    print('\n✓ すべて問題なし\n')

if __name__ == '__main__':
    main()
