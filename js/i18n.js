'use strict';
/* i18n.js — 画面の文字（日本語・英語）。Claude Code 担当
   t('キー', {値}) で今の言語の文字を返す。{n} などは値で置き換える。
   英語の虫の名前は「日本語名のローマ字（name）＋英語の説明（common）」。英語の聞きなし（voice）はローマ字。 */

const TEXT={
ja:{
  'brand.sub':'虫の音の庭',
  'start.lead':'夜の草むらで秋の虫をさがして、<br>自分だけの庭に放して音を育てる。<br><small>イヤホンだと、虫のいる方向が聞き分けられます。</small>',
  'start.begin':'はじめる',
  'play.pause':'一時停止','play.play':'再生',
  'lang.switch':'English',
  'tab.field':'探す','tab.garden':'庭','tab.zukan':'図鑑',
  'field.hint':'灯りを動かして声のする方へ。<b>急いで近づくと鳴きやみます</b>。灯りの中で虫が光ったら、そこをタップして網をふります。<br>パソコンはマウスで灯りを動かしてクリック。スマホはドラッグで灯りを動かし、灯りのそばをタップ。',
  'field.stat':'{area}　今夜は{moon}',
  'garden.empty':'まだ庭に虫がいません。<br>「探す」で虫をつかまえてきましょう。',
  'garden.hint':'虫をドラッグして置き場所を変えられます。<b>左右</b>で聞こえる方向が、<b>奥／手前</b>で遠さと響きが変わります。同じ種類の虫を近くに置くと、<b>交互に鳴き交わします</b>。ドラッグ中に<b>中央下の虫かご</b>へ運ぶと、控えに移せます。虫をタップすると詳しく見られます。',
  'garden.stat':'庭の虫 {n}／{max}','garden.statRain':'　小雨',
  'garden.back':'奥（遠く・よく響く）','garden.front':'手前（近く・はっきり）','garden.left':'左','garden.right':'右',
  'cage.label':'控えの虫かご','cage.drop':'はなすと控えへ',
  'wx.title':'天気','wx.note':'小雨にすると、虫の声に雨音が重なります。','wx.clear':'晴れ','wx.light':'小雨',
  'ctl.temp':'気温','ctl.depth':'夜の深さ（響き）','ctl.tempNote':'秋の虫は気温が高いほど速く、低いほどゆっくり鳴きます。',
  'ctl.wind':'風の音','ctl.soft':'音のやわらかさ','ctl.vol':'音量','ctl.timer':'おやすみタイマー',
  'temp.fmt':'{v}℃（{speed}）','temp.slow':'ゆっくり','temp.normal':'ふつう','temp.fast':'はやい',
  'depth.shallow':'浅い','depth.normal':'ふつう','depth.deep':'深い',
  'wind.none':'なし','soft.crisp':'くっきり','soft.round':'まるい','soft.veryRound':'とてもまるい',
  'timer.off':'なし','timer.min':'{m}分','timer.left':'あと{m}分で静かになります',
  'btn.clearGarden':'庭の虫をすべて控えへ','btn.freeAll':'虫をすべて逃がす',
  'bench.title':'控えの虫かご（{n}）','bench.empty':'庭がいっぱいのときや、休ませたい虫はここに入ります。',
  'bench.toGarden':'庭に出す','bench.release':'逃がす','bench.again':'もう一度押す',
  'catch.first':'はじめての {name}をつかまえた！','catch.title':'{name}をつかまえた！',
  'catch.body':'「{name}」 {traits}。','catch.toGarden':'庭に放しました。','catch.toBench':'庭がいっぱいなので控えの虫かごに入れました。',
  'catch.more':'つづけて探す','catch.go':'庭へ行く',
  'bug.name':'名前','bug.ok':'決定','bug.rest':'休ませる','bug.sing':'鳴かせる','bug.toBench':'控えへ','bug.release':'逃がす','bug.close':'閉じる',
  'bug.info':'{species}（{voice}）・{traits}','bug.nameFmt':'{base}{n}号','bug.restMark':'（休）',
  'trait.low':'低めの声','trait.high':'高めの声','trait.mid':'ふつうの声','trait.fast':'せっかち','trait.slow':'のんびり屋','trait.steady':'マイペース','trait.sep':'・',
  'toast.toBench':'{name}を控えの虫かごへ','toast.noGarden':'庭に虫がいません',
  'arm.clearGarden':'もう一度押すと、庭の虫をすべて控えへ','toast.cleared':'{n}匹を控えの虫かごへ移しました',
  'toast.noBugs':'逃がす虫がいません','arm.freeAll':'もう一度押すと{n}匹を逃がします',
  'toast.freedAll':'{n}匹を野に逃がしました。バイバイ！','toast.freed':'{name}を野に逃がしました。バイバイ！',
  'arm.release':'もう一度押すと逃がします',
  'zukan.listen':'声を聞く','zukan.listening':'聞いています…','zukan.caught':'つかまえた数 {n}',
  'zukan.unknown':'まだ出会っていない虫。{areas}で声がするらしい。','zukan.areaSep':'、',
  'zukan.stat':'見つけた種類 {found}／{total}　・　つかまえた虫 {n}匹（庭 {g}）',
},
en:{
  'brand.sub':'A Garden of Insect Songs',
  'start.lead':'Search the autumn night for singing insects,<br>then release them into your own garden and let its song grow.<br><small>With earphones, you can hear where each insect is.</small>',
  'start.begin':'Begin',
  'play.pause':'Pause','play.play':'Play',
  'lang.switch':'日本語',
  'tab.field':'Search','tab.garden':'Garden','tab.zukan':'Field Guide',
  'field.hint':'Move the lantern toward the voices. <b>Come too close too fast, and they fall silent.</b> When an insect glints in the light, tap there to swing your net.<br>On a computer, move the lantern with the mouse and click. On a phone, drag to move the lantern, then tap near it.',
  'field.stat':'{area} · Tonight: {moon}',
  'garden.empty':'No insects in your garden yet.<br>Go to “Search” and catch some.',
  'garden.hint':'Drag insects to move them. <b>Left and right</b> set where you hear them; <b>back and front</b> set how far away and how echoing they sound. Place two of the same kind close together and they will <b>sing in turns</b>. While dragging, drop an insect on the <b>cage at the bottom</b> to move it to your spare cage. Tap an insect for details.',
  'garden.stat':'Garden {n}/{max}','garden.statRain':' · Light rain',
  'garden.back':'Back (far, more echo)','garden.front':'Front (near, clear)','garden.left':'L','garden.right':'R',
  'cage.label':'Spare cage','cage.drop':'Release to move here',
  'wx.title':'Weather','wx.note':'Light rain adds the sound of rain to the insect songs.','wx.clear':'Clear','wx.light':'Light rain',
  'ctl.temp':'Temperature','ctl.depth':'Night depth (echo)','ctl.tempNote':'Autumn insects sing faster when it is warm and slower when it is cool.',
  'ctl.wind':'Wind','ctl.soft':'Softness','ctl.vol':'Volume','ctl.timer':'Sleep timer',
  'temp.fmt':'{v}°C ({speed})','temp.slow':'slow','temp.normal':'normal','temp.fast':'fast',
  'depth.shallow':'shallow','depth.normal':'normal','depth.deep':'deep',
  'wind.none':'off','soft.crisp':'crisp','soft.round':'soft','soft.veryRound':'very soft',
  'timer.off':'Off','timer.min':'{m} min','timer.left':'Going quiet in {m} min',
  'btn.clearGarden':'Move all to spare cage','btn.freeAll':'Release all insects',
  'bench.title':'Spare cage ({n})','bench.empty':'Insects stay here when the garden is full, or when you want them to rest.',
  'bench.toGarden':'To garden','bench.release':'Release','bench.again':'Tap again',
  'catch.first':'Your first {name}!','catch.title':'You caught a {name}!',
  'catch.body':'“{name}” — {traits}. ','catch.toGarden':'Released into your garden.','catch.toBench':'Your garden is full, so it went to the spare cage.',
  'catch.more':'Keep searching','catch.go':'Go to garden',
  'bug.name':'Name','bug.ok':'OK','bug.rest':'Rest','bug.sing':'Sing','bug.toBench':'To cage','bug.release':'Release','bug.close':'Close',
  'bug.info':'{species} ({voice}) · {traits}','bug.nameFmt':'{base} #{n}','bug.restMark':' (resting)',
  'trait.low':'low voice','trait.high':'high voice','trait.mid':'medium voice','trait.fast':'impatient','trait.slow':'easygoing','trait.steady':'steady','trait.sep':' · ',
  'toast.toBench':'{name} moved to the spare cage','toast.noGarden':'No insects in the garden',
  'arm.clearGarden':'Tap again to move all to the spare cage','toast.cleared':'Moved {n} insects to the spare cage',
  'toast.noBugs':'No insects to release','arm.freeAll':'Tap again to release {n} insects',
  'toast.freedAll':'Released {n} insects into the wild. Bye-bye!','toast.freed':'Released {name} into the wild. Bye-bye!',
  'arm.release':'Tap again to release',
  'zukan.listen':'Listen','zukan.listening':'Listening…','zukan.caught':'Caught: {n}',
  'zukan.unknown':'An insect you have not met yet. Its voice is heard in {areas}.','zukan.areaSep':', ',
  'zukan.stat':'Species found {found}/{total} · Insects {n} (garden {g})',
},
};

// 虫：名前・聞きなし・説明
const SPECIES_TEXT={
  suzumushi:{ja:{name:'スズムシ',voice:'リーン、リーン',desc:'平安時代から声を楽しまれてきた鳴く虫の代表。江戸時代には飼育して売り歩く「虫売り」もいた。翅を立ててこすり合わせて鳴く。'},
    en:{name:'Suzumushi',common:'Bell cricket',voice:'ri-in, ri-in',desc:'The classic singing insect of Japan, loved since the Heian period (8th–12th century). In the Edo period, “insect sellers” raised them and sold them on the streets. It sings by raising its wings and rubbing them together.'}},
  emma:{ja:{name:'エンマコオロギ',voice:'コロコロリー',desc:'日本で最も大きなコオロギの仲間。顔つきが閻魔さまに似ていることから名がついた。草むらや畑のすみでよく鳴いている。'},
    en:{name:'Enma-kōrogi',common:'Emma field cricket',voice:'koro-koro-ree',desc:'The largest field cricket in Japan, named after Enma, the stern king of the underworld, whose face its own is said to resemble. It sings in grassy corners and at the edges of fields.'}},
  matsumushi:{ja:{name:'マツムシ',voice:'チンチロリン',desc:'ススキなどの草原にすむ。声はよく知られているのに、姿を見たことのある人は少ない。和歌や唱歌にも多く登場する。'},
    en:{name:'Matsumushi',common:'Pine cricket',voice:'chin-chiro-rin',desc:'It lives in grasslands of silver grass. Its song is famous, yet few people have ever seen it. It appears often in classical poems and school songs.'}},
  kantan:{ja:{name:'カンタン',voice:'ルルルルル…',desc:'淡い緑色の細い体で「鳴く虫の女王」とも呼ばれる。クズなどの葉の上で、やわらかく長く鳴き続ける。'},
    en:{name:'Kantan',common:'Tree cricket',voice:'ru-ru-ru-ru…',desc:'A slender, pale green cricket known as “the queen of singing insects.” It sings long and softly from leaves such as kudzu.'}},
  kutsuwa:{ja:{name:'クツワムシ',voice:'ガチャガチャ',desc:'馬の口につける轡（くつわ）が鳴る音に似ていることから名がついた。大型のキリギリスの仲間で、声もにぎやか。'},
    en:{name:'Kutsuwamushi',common:'Bridle katydid',voice:'gacha-gacha',desc:'Named because its song sounds like the jingling of a horse’s bridle bit (kutsuwa). A large katydid with a lively, clattering voice.'}},
  umaoi:{ja:{name:'ウマオイ',voice:'スイーッチョン',desc:'馬を追う馬子（まご）の声に聞こえることから名がついた。ほかの虫を食べる肉食の虫で、林のへりの草木で鳴く。'},
    en:{name:'Umaoi',common:'Horse-chaser katydid',voice:'swee-chon',desc:'Its name means “horse chaser”: its song sounds like a packhorse driver calling out. It hunts other insects and sings from plants at the edge of the woods.'}},
  kanetataki:{ja:{name:'カネタタキ',voice:'チッ、チッ、チッ',desc:'鉦（かね）をたたく音にたとえられる。体長1cmほどの小さな虫で、生け垣や木の上で鳴く。声はするのに見つけにくい。'},
    en:{name:'Kanetataki',common:'Gong-striker cricket',voice:'chit, chit, chit',desc:'Its song is likened to someone striking a small gong (kane). Only about 1 cm long, it sings from hedges and trees. Easy to hear, hard to find.'}},
  kusahibari:{ja:{name:'クサヒバリ',voice:'フィリリリリ…',desc:'体長7mmほどの小さなコオロギの仲間。ヒバリのように澄んだ声で、昼間にも鳴く。とても臆病で、近づくとすぐ黙る。'},
    en:{name:'Kusahibari',common:'Grass lark',voice:'fi-ri-ri-ri…',desc:'A tiny cricket about 7 mm long, with a clear voice like a skylark. It sings even in the daytime. Very shy, it falls silent as soon as you come near.'}},
  tsuzure:{ja:{name:'ツヅレサセコオロギ',voice:'リッ、リッ、リッ…',desc:'人家のまわりにも多い、晩秋まで鳴く身近なコオロギ。昔の人はこの声を「肩刺せ、綴れ刺せ（冬に備えて着物をつくろえ）」と聞きなした。'},
    en:{name:'Tsuzuresase-kōrogi',common:'Stitch-and-mend cricket',voice:'rit, rit, rit…',desc:'A familiar cricket that sings around houses until late autumn. People of old heard its song as “kata sase, tsuzure sase” — “stitch your shoulders, mend your rags” — a reminder to prepare clothes for winter.'}},
  kirigirisu:{ja:{name:'キリギリス',voice:'ギーッ、チョン',desc:'夏から初秋の草原で鳴く大型の虫。古い和歌の「きりぎりす」は、今のコオロギのことだったといわれている。'},
    en:{name:'Kirigirisu',common:'Japanese katydid',voice:'gheee-chon',desc:'A large insect that sings in grasslands from summer to early autumn. In old poems, the word “kirigirisu” is said to have meant what we now call a cricket.'}},
  aomatsu:{ja:{name:'アオマツムシ',voice:'リーリーリー',desc:'明治時代に日本に入ったとされる外来の虫。街路樹や公園の木の上で、にぎやかに鳴く。いまでは都会の秋の音になっている。'},
    en:{name:'Aomatsumushi',common:'Green pine cricket',voice:'ree-ree-ree',desc:'An insect thought to have arrived in Japan in the Meiji era (late 19th century). It sings loudly from street trees and park trees, and has become the sound of autumn in the city.'}},
  kumasuzu:{ja:{name:'クマスズムシ',voice:'ジジジジ…',desc:'体長7mmほどの黒い小さな虫。名前にスズムシとあるが、スズムシとは別の仲間。落ち葉の間など地面の近くで、細かく鳴く。'},
    en:{name:'Kumasuzumushi',common:'Little black cricket',voice:'ji-ji-ji-ji…',desc:'A small black insect about 7 mm long. Despite “suzumushi” in its name, it is not a bell cricket. It sings a fine, buzzing song close to the ground, among fallen leaves.'}},
  tsuyumushi:{ja:{name:'ツユムシ',voice:'チッ…チキチキチキ',desc:'細長い体で、よく飛ぶ。声は小さく控えめで、つぶやくように鳴く。ほかの虫の声のすき間から聞こえてくる。'},
    en:{name:'Tsuyumushi',common:'Dew katydid',voice:'chit… chiki-chiki-chiki',desc:'A slender katydid that flies well. Its voice is small and modest, like a murmur, heard in the gaps between the other insects’ songs.'}},
  kayakiri:{ja:{name:'カヤキリ',voice:'ジーーーー',desc:'日本最大級のキリギリスの仲間。ススキなどカヤの草原で、太く長い声で鳴き続ける。ほかの虫の声を下から支える音。'},
    en:{name:'Kayakiri',common:'Thatch-grass katydid',voice:'jeeeeee',desc:'One of the largest katydids in Japan. It keeps up a deep, long song in fields of thatch grass such as silver grass — a low voice that supports all the others.'}},
};

// 探す画面の場所
const AREA_TEXT={
  kusamura:{ja:'秋の野原',en:'Autumn Meadow'},
  kawara:{ja:'河原のススキ原',en:'Silver-Grass Riverbank'},
  hayashi:{ja:'雑木林のへり',en:'Woodland Edge'},
  kouen:{ja:'街の公園',en:'City Park'},
};

// 月の名前（月齢の区切り順。app.js の moonInfo が使う）
const MOON_TEXT=[
  {ja:'新月',en:'New moon'},
  {ja:'三日月',en:'Mikazuki — crescent moon'},
  {ja:'夕月',en:'Yūzuki — evening moon'},
  {ja:'上弦の月',en:'First quarter moon'},
  {ja:'十日夜の月',en:'Tōkanya — tenth-night moon'},
  {ja:'十三夜の月',en:'Jūsan’ya — thirteenth-night moon'},
  {ja:'満月',en:'Full moon'},
  {ja:'十六夜の月',en:'Izayoi — the hesitant moon'},
  {ja:'寝待月',en:'Nemachi — the lie-in-wait moon'},
  {ja:'下弦の月',en:'Last quarter moon'},
  {ja:'有明の月',en:'Ariake — the dawn moon'},
  {ja:'新月',en:'New moon'},
];

const LANGS=['ja','en'];
let LANG='ja';
const i18nMissing=new Set(); // 辞書にないキー（自動テストで確かめる）
function t(key,vars){let s=TEXT[LANG][key];if(s==null){i18nMissing.add(LANG+':'+key);s=TEXT.ja[key]??key}
  return vars?s.replace(/\{(\w+)\}/g,(m,k)=>vars[k]??m):s}
const spText=k=>SPECIES_TEXT[k][LANG];
const areaName=k=>AREA_TEXT[k][LANG];
const detectLang=()=>/^ja\b/i.test(navigator.language||'')?'ja':'en';
// 画面の骨組み（index.html）の data-i18n / data-i18n-html を今の言語で書き換える
function applyStaticText(){document.documentElement.lang=LANG;
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{el.innerHTML=t(el.dataset.i18nHtml)})}
