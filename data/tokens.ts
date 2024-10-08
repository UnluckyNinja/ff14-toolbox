// search what tokens can buy here: https://observablehq.com/d/618dcf86d688669a
export const tokens = [
  // 39919, // 稀少外典神典石
  20, // 黑涡团军票
  21, // 双蛇党军票
  22, // 恒辉队军票
  28, // 亚拉戈诗学神典石
  44, // 亚拉戈因果神典石
  25199, // 巧手白票
  33913, // 巧手紫票
  25200, // 大地白票
  33914, // 大地紫票
  26807, // 双色宝石
  31135, // 博兹雅晶簇
  27, // 同盟徽章
  10307, // 兵团徽章
  26533, // 怪物狩猎的战利品
  28063, // 天穹街振兴票
  30341, // 幻巧叶
  37549, // 谢尔达莱青船币
  37550, // 谢尔达莱绿岛币
  25, // 狼印战绩
  39884, // 六根山遗物
  39886, // 六根山书籍
  41078, // 阿罗阿罗岛遗物
  41080, // 阿罗阿罗岛书籍
  41668, // 猫耳小员的票据
]

export const tokenRewards: Record<string, Record<string, number>> = {
  20: {
    5119: 200, // 斑铜矿
    5261: 200, // 沉积岩磨刀石
    5274: 200, // 铅丹
    5357: 200, // 天鹅之羽
    5358: 200, // 雄鹰之羽
    5501: 200, // 灰汁
    5502: 200, // 石灰硫磺合剂
    5530: 200, // 焦炭
    5531: 200, // 兽脂
    5532: 200, // 树汁块
    5558: 200, // 软糊怪肉
    6141: 500, // 强心剂
    6151: 20, // 高级料酒
    6153: 20, // 纯净水
    6154: 20, // 妖异之血
    6470: 6800, // 碧海吊扇灯
    6526: 5050, // 碧海储物椅
    6538: 8300, // 碧海写字桌
    6545: 9070, // 碧海军床
    6553: 6900, // 碧海衣橱
    6556: 6700, // 碧海收纳柜
    6600: 14470, // 私用以太之光
    6656: 4900, // 黑涡团团旗
    6662: 1100, // 艾欧泽亚全景图
    7059: 1500, // 精炼药
    7095: 19150, // 提督的肖像画
    7133: 10950, // 碧海内墙
    7143: 10950, // 碧海地板
    7596: 1500, // 硅化木
    7597: 1500, // 白钨矿
    7598: 1500, // 拉吉克灵沙
    7599: 1500, // 蛟蜥的粗皮
    7600: 1500, // 山羊绒
    7601: 1500, // 金刚砂
    7602: 30, // 星八角
    7603: 30, // 卫月新薯
    7604: 30, // 皇家可可豆
    7605: 30, // 填鸭胸肉
    7621: 200, // 驱幻晶
    7806: 450, // 黄褐乳胶
    9356: 2300, // 速干密封剂
    9357: 2500, // 塞尔法特尔天然水
    9366: 250, // 硼砂
    9367: 2250, // 织蛛网
    9368: 2250, // 乌兹矿
    9369: 250, // 拉吉克灵药
    9370: 2250, // 皮革蜡油
    9371: 250, // 烟肉
    9372: 250, // 烘焙咖啡豆
    13589: 5000, // 精金投斧
    13591: 5000, // 钛合金镜
    13593: 5000, // 破魔箭
    13595: 5000, // 国王饼
    15649: 7000, // 玻璃纤维
    15855: 500, // 阿尔基克薰衣草种子
    15856: 500, // 虚无界风茄种子
    21800: 200, // 幻象棱晶
    33916: 600, // 8级暗物质
    38642: 40000, // 管弦乐琴乐谱：黑涡军令部
    38645: 40000, // 管弦乐琴乐谱：海上涟漪
  },
  21: {
    5119: 200, // 斑铜矿
    5261: 200, // 沉积岩磨刀石
    5274: 200, // 铅丹
    5357: 200, // 天鹅之羽
    5358: 200, // 雄鹰之羽
    5501: 200, // 灰汁
    5502: 200, // 石灰硫磺合剂
    5530: 200, // 焦炭
    5531: 200, // 兽脂
    5532: 200, // 树汁块
    5558: 200, // 软糊怪肉
    6141: 500, // 强心剂
    6151: 20, // 高级料酒
    6153: 20, // 纯净水
    6154: 20, // 妖异之血
    6472: 6800, // 密林吊扇灯
    6528: 5050, // 密林储物椅
    6539: 8300, // 密林写字桌
    6546: 9070, // 密林军床
    6554: 6900, // 密林衣橱
    6557: 6700, // 密林收纳柜
    6600: 14470, // 私用以太之光
    6657: 4900, // 双蛇党党旗
    6662: 1100, // 艾欧泽亚全景图
    7059: 1500, // 精炼药
    7097: 19150, // 幻术皇的肖像画
    7134: 10950, // 密林内墙
    7144: 10950, // 密林地板
    7596: 1500, // 硅化木
    7597: 1500, // 白钨矿
    7598: 1500, // 拉吉克灵沙
    7599: 1500, // 蛟蜥的粗皮
    7600: 1500, // 山羊绒
    7601: 1500, // 金刚砂
    7602: 30, // 星八角
    7603: 30, // 卫月新薯
    7604: 30, // 皇家可可豆
    7605: 30, // 填鸭胸肉
    7621: 200, // 驱幻晶
    7806: 450, // 黄褐乳胶
    9356: 2300, // 速干密封剂
    9357: 2500, // 塞尔法特尔天然水
    9366: 250, // 硼砂
    9367: 2250, // 织蛛网
    9368: 2250, // 乌兹矿
    9369: 250, // 拉吉克灵药
    9370: 2250, // 皮革蜡油
    9371: 250, // 烟肉
    9372: 250, // 烘焙咖啡豆
    13589: 5000, // 精金投斧
    13591: 5000, // 钛合金镜
    13593: 5000, // 破魔箭
    13595: 5000, // 国王饼
    15649: 7000, // 玻璃纤维
    15855: 500, // 阿尔基克薰衣草种子
    15856: 500, // 虚无界风茄种子
    21800: 200, // 幻象棱晶
    33916: 600, // 8级暗物质
    38641: 40000, // 管弦乐琴乐谱：蛇巢司令部
    38644: 40000, // 管弦乐琴乐谱：露水之玉，明月之光
  },
  22: {
    5119: 200, // 斑铜矿
    5261: 200, // 沉积岩磨刀石
    5274: 200, // 铅丹
    5357: 200, // 天鹅之羽
    5358: 200, // 雄鹰之羽
    5501: 200, // 灰汁
    5502: 200, // 石灰硫磺合剂
    5530: 200, // 焦炭
    5531: 200, // 兽脂
    5532: 200, // 树汁块
    5558: 200, // 软糊怪肉
    6141: 500, // 强心剂
    6151: 20, // 高级料酒
    6153: 20, // 纯净水
    6154: 20, // 妖异之血

    6471: 6800, // 黄沙吊扇灯
    6527: 5050, // 黄沙储物椅
    6540: 8300, // 黄沙写字桌
    6547: 9070, // 黄沙军床
    6555: 6900, // 黄沙衣橱
    6558: 6700, // 黄沙收纳柜

    6600: 14470, // 私用以太之光

    6658: 4900, // 恒辉队队旗

    6662: 1100, // 艾欧泽亚全景图
    7059: 1500, // 精炼药

    7096: 19150, // 女王与总帅的肖像画
    7135: 10950, // 黄沙内墙
    7145: 10950, // 黄沙地板
    7152: 19150, // 女王的肖像画

    7596: 1500, // 硅化木
    7597: 1500, // 白钨矿
    7598: 1500, // 拉吉克灵沙
    7599: 1500, // 蛟蜥的粗皮
    7600: 1500, // 山羊绒
    7601: 1500, // 金刚砂
    7602: 30, // 星八角
    7603: 30, // 卫月新薯
    7604: 30, // 皇家可可豆
    7605: 30, // 填鸭胸肉
    7621: 200, // 驱幻晶
    7806: 450, // 黄褐乳胶
    9356: 2300, // 速干密封剂
    9357: 2500, // 塞尔法特尔天然水
    9366: 250, // 硼砂
    9367: 2250, // 织蛛网
    9368: 2250, // 乌兹矿
    9369: 250, // 拉吉克灵药
    9370: 2250, // 皮革蜡油
    9371: 250, // 烟肉
    9372: 250, // 烘焙咖啡豆
    13589: 5000, // 精金投斧
    13591: 5000, // 钛合金镜
    13593: 5000, // 破魔箭
    13595: 5000, // 国王饼
    15649: 7000, // 玻璃纤维
    15855: 500, // 阿尔基克薰衣草种子
    15856: 500, // 虚无界风茄种子
    21800: 200, // 幻象棱晶
    33916: 600, // 8级暗物质

    38643: 40000, // 管弦乐琴乐谱：恒辉作战总部
    38646: 40000, // 管弦乐琴乐谱：沙中秘密
  },
  27: {
    7118: 180,
    7119: 180,
    7120: 180,
    7967: 80,
    21072: 4,
    25186: 400,
    25187: 400,
    25188: 400,
    25189: 400,
    25190: 400,
    25197: 400,
    25198: 400,
    26727: 400,
    26728: 400,
    26729: 400,
    26730: 400,
    26731: 400,
    26738: 400,
    26739: 400,
  },
  28: {
    6178: 3,
    6189: 3,
    6198: 3,
    14147: 5,
    14150: 5,
    14153: 5,
    14156: 5,
    14164: 5,
    14266: 375,
    14268: 500,
    15814: 375,
    16727: 10,
    16728: 10,
    16729: 10,
    16730: 10,
    16731: 10,
    16732: 10,
    16733: 25,
    16805: 500,
    17622: 500,
    17645: 375,
    17646: 375,
    17647: 375,
    17648: 375,
    18011: 100,
    18018: 100,
    18019: 100,
    18020: 100,
    18021: 100,
    18028: 100,
    18029: 100,
    19935: 10,
    19960: 10,
    19961: 10,
    19992: 10,
    20005: 10,
    21279: 1600,
    22412: 10,
    22413: 10,
    22414: 10,
    22415: 10,
    22416: 10,
    22421: 10,
    22475: 1600,
    22477: 1600,
    24244: 20,
    24245: 20,
    24246: 20,
    24247: 20,
    24248: 20,
    24249: 20,
    27695: 5,
    27718: 5,
    27719: 5,
    27737: 5,
    27744: 5,
    27762: 5,
    27796: 5,
    29969: 10,
    29971: 10,
    29973: 10,
    29975: 10,
    29977: 10,
    29979: 10,
    32944: 20,
    32945: 20,
    32946: 20,
    32947: 20,
    32948: 20,
    32949: 20,
  },
  44: {
    36218: 10,
    36219: 10,
    36220: 10,
    36221: 10,
    36222: 10,
    37823: 10,
    37825: 10,
    37826: 10,
    37827: 10,
    37828: 10,
    37829: 10,
    39711: 20,
    39712: 20,
    39713: 20,
    39714: 20,
    39715: 20,
    39716: 20
  },
  10307: {
    12670: 300,
    17625: 300,
    17859: 300,
    18011: 400,
    18018: 400,
    18019: 400,
    18020: 400,
    18021: 400,
    18028: 400,
    18029: 400,
    21072: 4,
  },
  // 25199:
  // 4554 之前为无用绿装，去除
  // 19527 ~ 19636 为无用装备，去除
  25199: {
    4554: 1,
    5339: 25,
    5702: 25,
    5703: 200,
    5707: 25,
    5708: 200,
    5712: 25,
    5713: 200,
    12633: 16.666666666666668,
    12886: 8,
    12905: 4,
    12906: 15,
    12907: 15,
    12931: 10,
    12932: 10,
    12933: 10,
    12934: 10,
    12935: 10,
    14142: 5,
    14143: 5,
    14144: 5,
    14145: 5,
    14937: 6,
    15652: 8,
    15945: 200,
    16734: 8,
    16735: 8,
    16906: 200,
    16907: 200,
    17574: 200,
    18025: 200,
    18026: 200,
    18027: 200,
    19840: 10,
    19876: 10,
    21082: 100,
    21089: 10,
    21281: 200,
    21301: 10,
    22438: 10,
    22439: 10,
    22446: 10,
    23181: 25,
    24281: 10,
    24282: 10,
    24518: 50,
    24520: 50,
    24521: 50,
    25062: 200,
    25066: 200,
    25194: 200,
    25195: 200,
    25196: 200,
    26735: 250,
    26736: 250,
    26737: 250,
    28724: 15,
    31320: 250,
    33925: 250,
    33926: 250,
    33927: 250,
  },
  // 25200:
  // 2544 ~ 3937 为无用绿装，去除
  // 19535 ~ 19641 为无用装备，去除
  25200: {
    5687: 25,
    5688: 200,
    5692: 25,
    5693: 200,
    5697: 25,
    5698: 200,
    12708: 1,
    12709: 1,
    12710: 1,
    12711: 1,
    12712: 1,
    13733: 20,
    13734: 5,
    13736: 10,
    13737: 5,
    13738: 10,
    13739: 5,
    13740: 5,
    13744: 75,
    13745: 75,
    13750: 10,
    13752: 10,
    13753: 10,
    15945: 200,
    16906: 200,
    16907: 200,
    17570: 20,
    17571: 20,
    17574: 200,
    17594: 40,
    18022: 200,
    18023: 200,
    18024: 200,
    20013: 10,
    20014: 10,
    20015: 15,
    20016: 15,
    20017: 15,
    20616: 1,
    20618: 15,
    20619: 15,
    20675: 1,
    20676: 1,
    21282: 200,
    23898: 75,
    24516: 50,
    24517: 50,
    24519: 50,
    25063: 200,
    25064: 200,
    25065: 200,
    25191: 200,
    25192: 200,
    25193: 200,
    26732: 250,
    26733: 250,
    26734: 250,
    27298: 75,
    28931: 150,
    28932: 225,
    28933: 375,
    28934: 600,
    33849: 200,
    33922: 250,
    33923: 250,
    33924: 250,
  },
  26533: {
    25186: 150,
    25187: 150,
    25188: 150,
    25189: 150,
    25190: 150,
    25197: 150,
    25198: 150,
    26727: 400,
    26728: 400,
    26729: 400,
    26730: 400,
    26731: 400,
    26738: 400,
    26739: 400,
    27315: 300,
    27917: 300,
    33917: 150,
    33918: 150,
    33919: 150,
    33920: 150,
    33921: 150,
    33928: 150,
    33929: 150,
    33930: 400,
    33931: 400,
    33932: 400,
    33933: 400,
    33934: 400,
    33941: 400,
    33942: 400,
    35804: 300,
    36367: 300,
  },
  26807: {
    6141: 4,
    7621: 6,
    17837: 6,
    21800: 6,
    25186: 120,
    25187: 120,
    25188: 120,
    25189: 120,
    25190: 120,
    25197: 120,
    25198: 120,
    26727: 240,
    26728: 240,
    26729: 240,
    26730: 240,
    26731: 240,
    26738: 240,
    26739: 240,
    27276: 100,
    27288: 100,
    27294: 100,
    27313: 100,
    27732: 2,
    27733: 2,
    27734: 2,
    27735: 2,
    27736: 2,
    27756: 2,
    27763: 1,
    27764: 1,
    27773: 1,
    27774: 1,
    27797: 2,
    27798: 1,
    27799: 2,
    27800: 2,
    27850: 1,
    27851: 1,
    27852: 1,
    27893: 350,
    27894: 350,
    27895: 350,
    27896: 350,
    27897: 350,
    27898: 350,
    27899: 350,
    27900: 350,
    28146: 100,
    28635: 100,
    28878: 350,
    28879: 350,
    28880: 350,
    28881: 350,
    28882: 350,
    28883: 350,
    28884: 350,
    28885: 350,
    28967: 25,
    28968: 25,
    28969: 10,
    28972: 50,
    28988: 10,
    28999: 30,
    29000: 10,
    30263: 350,
    30264: 350,
    30265: 350,
    32232: 100,
    33269: 100,
    33274: 50,
    35833: 100,
    36203: 2,
    36242: 2,
    36243: 2,
    36244: 2,
    36245: 2,
    36246: 2,
    36253: 2,
    36254: 2,
    36255: 2,
    36256: 2,
    36257: 2,
    36258: 2,
    36259: 2,
    36260: 2,
    36261: 2,
    36262: 2,
    36264: 2,
    36630: 2,
  },
  28063: {
    13275: 800,
    13279: 800,
    15441: 800,
    17626: 600,
    25191: 240,
    25192: 240,
    25193: 240,
    25194: 240,
    25195: 240,
    25196: 240,
    26732: 300,
    26733: 300,
    26734: 300,
    26735: 300,
    26736: 300,
    26737: 300,
    28125: 8400,
    28140: 900,
    28141: 600,
    28592: 2200,
    28593: 2000,
    28594: 2200,
    28612: 1800,
    28615: 1800,
    28622: 1200,
    28628: 1200,
    28893: 1200,
    28906: 200,
    28907: 200,
    28908: 200,
    28917: 8400,
    28963: 250,
    28964: 200,
    28971: 350,
    28979: 900,
    28989: 900,
    28995: 350,
    29403: 1200,
    30052: 2200,
    30053: 2000,
    30054: 1200,
    30110: 900,
    30111: 1800,
    30112: 1800,
    30113: 1800,
    30116: 100,
    30117: 100,
    30118: 100,
    30119: 100,
    30120: 100,
    30121: 100,
    30122: 500,
    30123: 500,
    30124: 500,
    30259: 600,
    30260: 600,
    30261: 600,
    30262: 1200,
    30267: 600,
    30269: 1800,
    30270: 900,
    30413: 200,
    30414: 200,
    30415: 250,
    30416: 350,
    30417: 350,
    30418: 600,
    30862: 8400,
    31117: 20,
    31118: 20,
    31119: 20,
    31120: 20,
    31121: 20,
    31122: 20,
    31123: 20,
    31124: 20,
    31324: 900,
    31325: 1800,
    31401: 1800,
    31406: 1800,
    31674: 600,
    31675: 1200,
    31758: 30,
    31759: 30,
    31760: 30,
    31761: 30,
    31762: 30,
    31763: 30,
    31764: 30,
    31765: 30,
    32213: 600,
    32216: 350,
    32793: 1200,
    32794: 2200,
    32795: 1200,
    32796: 2000,
    32797: 1200,
    32826: 1800,
    32829: 1800,
    32841: 8400,
    33039: 1800,
    33127: 1200,
    33674: 8400,
    33847: 1200,
    33905: 1200,
    38647: 1200,
  },
  30341: {
    12056: 150,
    13283: 150,
    30865: 600,
    30874: 400,
    31397: 1.25,
    32859: 1.25,
    33143: 250,
    33145: 600,
    33691: 400,
    33709: 1.25,
    36003: 600,
    36117: 1.25,
    36119: 250,
    36120: 250,
    36904: 600,
    38428: 1.25,
    38450: 400,
    38457: 600,
    39474: 400,
    39501: 1.25,
  },
  31135: {
    30102: 180, // 劳动十四号认证密钥
    30884: 0.2, // 未鉴定的新锐失传碎晶 ×5
    30887: 0.25, // 未鉴定的熟练失传碎晶 ×4
    31402: 50, // 演技教材·巡视
    31407: 150, // 发型样式：飞翔者
    31666: 25, // 管弦乐琴乐谱：动乱 帝国版（黄道年代）
    31665: 25, // 管弦乐琴乐谱：博兹雅的血风
    31403: 50, // 演技教材·诅咒
    32162: 1, // 未鉴定的探索失传碎晶
    32165: 1, // 未鉴定的睿智失传碎晶
    32832: 1, // 未鉴定的射技失传碎晶
    32834: 1, // 未鉴定的祈祷失传碎晶
    32831: 1, // 未鉴定的剑豪失传碎晶
    33037: 25, // 趣味圆点阳伞
    32833: 1, // 未鉴定的豪勇失传碎晶
    33772: 5, // 未鉴定的奇迹失传碎晶
  },
  33913: {
    33938: 500, // 名匠魔晶石拾型
    33940: 500, // 巨匠魔晶石拾型
    33939: 500, // 魔匠魔晶石拾型
    36099: 10, // 高级牛肉
    36101: 10, // 白桃
    36100: 10, // 巨型南瓜
    36102: 10, // 高级桂皮
    36103: 10, // 高级扇贝
    37284: 125, // 非挥发性炼金药
    38271: 15, // 电感蜜瓜
    38272: 15, // 落日胡萝卜
    38274: 15, // 悬挂番茄
    38275: 15, // 帝王海胆
    38273: 15, // 洛夫坦山羊臀肉
  },
  33914: {
    33935: 500, // 达识魔晶石拾型
    33936: 500, // 博识魔晶石拾型
    33937: 500, // 器识魔晶石拾型
    36223: 100, // 晓月灵砂
    36224: 200, // 巨岩灵砂
    36225: 200, // 巨树灵砂
    36226: 200, // 巨海灵砂
    36591: 5, // 蜉蝣
    36593: 5, // 青花鱼块
    36597: 5, // 星尘
    38936: 300, // 地鸣灵砂
  },
  37549: {
    30116: 500,
    30117: 500,
    30118: 500,
    30119: 500,
    30120: 500,
    30121: 500,
    30122: 2500,
    30123: 2500,
    30124: 2500,
    33922: 750,
    33923: 750,
    33924: 750,
    33925: 750,
    33926: 750,
    33927: 750,
    33935: 1500,
    33936: 1500,
    33937: 1500,
    33938: 1500,
    33939: 1500,
    33940: 1500,
    38540: 2,
    38589: 1000,
    38610: 1000,
    38628: 1000,
    39419: 1000,
    39425: 1000,
    39427: 1000,
    39428: 1000,
    39502: 2,
  },
  37550: {
    7621: 150,
    21800: 150,
    33922: 1750,
    33923: 1750,
    33924: 1750,
    33925: 1750,
    33926: 1750,
    33927: 1750,
    33935: 3500,
    33936: 3500,
    33937: 3500,
    33938: 3500,
    33939: 3500,
    33940: 3500,
    38540: 5,
    38589: 2500,
    38610: 2500,
    38628: 2500,
    39502: 5,
  },
  25: {
    5594: 100, // 1级暗物质
    5595: 100, // 2级暗物质
    5596: 100, // 3级暗物质
    5597: 100, // 4级暗物质
    5598: 100, // 5级暗物质
    10386: 100, // 6级暗物质
    17837: 100, // 7级暗物质
    33916: 100, // 8级暗物质
    21800: 100, // 幻象棱晶
    6954: 20, // 伊卡洛斯之翼
    6955: 20, // 技力恢复之羽
    6739: 350, // 饿狼翼剑
    6740: 500, // 饿狼爪
    6741: 500, // 饿狼双刃斧
    6742: 500, // 饿狼战戈
    6743: 500, // 饿狼弓
    6744: 500, // 饿狼牧杖
    6745: 500, // 饿狼长杖
    6746: 500, // 饿狼咏咒魔导书
    6747: 500, // 饿狼治愈魔导书
    6748: 150, // 饿狼鸢盾
    6749: 250, // 饿狼头盔
    6750: 250, // 饿狼骑兵头盔
    6751: 250, // 饿狼角盔
    6752: 250, // 饿狼狩猎帽
    6753: 250, // 饿狼骑士帽
    6754: 250, // 饿狼宽边帽
    6755: 500, // 饿狼胸甲
    6756: 500, // 饿狼鳞铠
    6757: 500, // 饿狼皮甲
    6758: 500, // 饿狼束腰衣
    6759: 500, // 饿狼外袍
    6760: 500, // 饿狼长袍
    6761: 500, // 饿狼软甲裤
    6762: 500, // 饿狼马裤
    6763: 500, // 饿狼衬裤
    6764: 500, // 饿狼腿套
    6765: 500, // 饿狼束膝裤
    6766: 500, // 饿狼紧身裤
    6767: 250, // 饿狼手铠
    6768: 250, // 饿狼鳞指套
    6769: 250, // 饿狼护臂
    6770: 250, // 饿狼弓术手套
    6771: 250, // 饿狼礼服手套
    6772: 250, // 饿狼手箍
    6773: 250, // 饿狼铠靴
    6774: 250, // 饿狼鳞胫甲
    6775: 250, // 饿狼腿甲靴
    6776: 250, // 饿狼狩猎靴
    6777: 250, // 饿狼礼鞋
    6778: 250, // 饿狼鸭嘴靴
    6785: 125, // 饿狼红电气石手镯
    6786: 125, // 饿狼锆石手镯
    6787: 125, // 饿狼碧玺手镯
    6788: 125, // 饿狼琥珀手镯
    6789: 125, // 饿狼尖晶石手镯
    6790: 125, // 饿狼绿松石手镯
    6791: 125, // 饿狼红电气石耳坠
    6792: 125, // 饿狼锆石耳坠
    6793: 125, // 饿狼碧玺耳坠
    6794: 125, // 饿狼琥珀耳坠
    6795: 125, // 饿狼尖晶石耳坠
    6796: 125, // 饿狼绿松石耳坠
    6797: 125, // 饿狼红电气石项环
    6798: 125, // 饿狼锆石项环
    6799: 125, // 饿狼碧玺项环
    6800: 125, // 饿狼琥珀项环
    6801: 125, // 饿狼尖晶石项环
    6802: 125, // 饿狼绿松石项环
    6803: 125, // 饿狼红电气石戒指
    6804: 125, // 饿狼锆石戒指
    6805: 125, // 饿狼碧玺戒指
    6806: 125, // 饿狼琥珀戒指
    6807: 125, // 饿狼尖晶石戒指
    6808: 125, // 饿狼绿松石戒指
    9242: 500, // 饿狼辅剑
    10414: 500, // 饿狼双手剑
    10476: 500, // 饿狼火枪
    10538: 500, // 饿狼天星盘
    14273: 5000, // 陈旧的乐谱：以血洗血
    14274: 10000, // 陈旧的乐谱：饿狼群集
    21277: 10000, // 管弦乐琴乐谱：猛禽猎食
    22473: 10000, // 管弦乐琴乐谱：烈羽争锋
    28890: 10000, // 管弦乐琴乐谱：攻势战场
    28891: 10000, // 管弦乐琴乐谱：守势战场
    33917: 5000, // 信力魔晶石玖型
    33918: 5000, // 神眼魔晶石玖型
    33919: 5000, // 武略魔晶石玖型
    33920: 5000, // 雄略魔晶石玖型
    33921: 5000, // 刚柔魔晶石玖型
    33928: 5000, // 战技魔晶石玖型
    33929: 5000, // 咏唱魔晶石玖型
    33930: 15000, // 信力魔晶石拾型
    33931: 15000, // 神眼魔晶石拾型
    33932: 15000, // 武略魔晶石拾型
    33933: 15000, // 雄略魔晶石拾型
    33934: 15000, // 刚柔魔晶石拾型
    33941: 15000, // 战技魔晶石拾型
    33942: 15000, // 咏唱魔晶石拾型
  },
  39919: {
    "9347": 7,
    "24301": 30,
    "24302": 30,
    "24303": 30,
    "25005": 0.1,
    "30094": 7,
    "30095": 7,
    "30270": 30,
    "31401": 50,
    "31663": 50,
    "32225": 20,
    "32226": 20,
    "32229": 20,
    "32250": 20,
    "32251": 20,
    "32253": 20,
    "32829": 50,
    "32841": 50,
    "33250": 20,
    "37412": 50
  },
  39884: {
    "40363": 9,
    "40364": 3,
    "40441": 9,
    "40442": 18,
    "40443": 9,
    "40444": 9,
    "40445": 9,
    "40446": 18,
    "40447": 9,
    "40601": 6,
    "40713": 9
  },
  39886: {
    "33930": 1,
    "33931": 1,
    "33932": 1,
    "33933": 1,
    "33934": 1,
    "33941": 1,
    "33942": 1
  },
  41078: {
    "41462": 9,
    "41465": 6,
    "41466": 3,
    "41587": 15,
    "41588": 27,
    "41589": 9,
    "41590": 12,
    "41591": 9,
    "41662": 9
  },
  41080: {
    "33930": 1,
    "33931": 1,
    "33932": 1,
    "33933": 1,
    "33934": 1,
    "33941": 1,
    "33942": 1
  },
  41668: {
    "41709": 10
  }
}
