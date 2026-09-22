/* art-fit.js — 絵とシステムのつなぎ目（Claude Code 担当）
   Codex の絵を測って入れる値。絵の構図を変えたら Claude Code が測り直す。Codex は編集しない。 */

// 絵に描かれた満月の位置（画像の幅・高さに対する割合）と、月のふち・まわりの空の色
const ART_MOON={
  garden:{x:.7081,y:.1026,r:.0421,rim:'#44525a',sky:'#082c44'},
  kusamura:{x:.7077,y:.1022,r:.0419,rim:'#664c50',sky:'#3a2439'},
  kawara:{x:.7078,y:.1022,r:.0419,rim:'#2d608b',sky:'#032751'},
  hayashi:{x:.7077,y:.1021,r:.0419,rim:'#374936',sky:'#0d2a22'},
  kouen:{x:.7077,y:.1022,r:.0419,rim:'#685470',sky:'#3b2b53'},
};

// 地平線（草地や水辺が始まる高さ、画像の高さに対する割合）。虫はこれより下にだけ出る
const HORIZON={kusamura:.38,kawara:.56,hayashi:.5,kouen:.47};
const GARDEN_GROUND=.4; // 庭の絵の地平線
