"""Эталонный том (по замечаниям АН от 09.11.2026): сначала СПС КПП, затем по его образу — остальные.

Что меняется в эталонном томе по сравнению с остальными:
- документы о качестве — в «Реестре паспортов и сертификатов» здания (6-й том), сквозные строки; в актах — «стр. N»;
- к каждому акту — своя исполнительная схема (№ схемы = № акта), протокол изоляции — к акту на кабельные линии;
- журнал входного контроля — только материалы и кабели; оборудование — отдельный акт входного контроля;
- акт смонтированного оборудования — с исполнительной схемой, входным контролем, реестром и датами в теле акта;
- реестр передачи ИД (опись тома) с количеством листов и нарастающим итогом.
"""
import os, re, math, subprocess, tempfile, shutil
from docx import Document
from docx.shared import Pt, Mm
from docx.enum.text import WD_ALIGN_PARAGRAPH as A
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT
import common as C, r
from equip import EQ
from aso import font, para, lab, borders, fix_widths, cell, save
import paths

OUT = str(paths.TMP)
MODEL = {('КПП', 'СПС')}            # тома, переведённые на эталон
def is_model(bld, code): return (bld, code) in MODEL

MON = ["", "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
def dl(s): return f'«{s[:2]}» {MON[int(s[3:5])]} {s[6:]} г.'

# ---------------- реквизиты эталонного тома ----------------
REG_ID = {'КПП': '16/1/26-РПС-КПП'}   # не содержит «16/1/26-ИД-КПП» — иначе common.fix_kpp перепишет
REG_NAME = 'Реестр паспортов и сертификатов'
DT = {('КПП', 'СПС'): dict(vk='16.10.2026', eq_start='20.10.2026', eq_end='24.10.2026', prot='22.10.2026')}
P1 = {'3-СПС-КПП': 'Монтаж кабельных линий'}           # решение пользователя 09.11.2026: «монтаж, не прокладка»
SCH = {  # исполнительные схемы к актам: № схемы = № акта
    '1-СПС-КПП': 'Кабельные проходки',
    '2-СПС-КПП': 'Кабеленесущая система',
    '3-СПС-КПП': 'Кабельные линии',
    'СПС-КПП-О': 'Расположение оборудования. Структурная схема ШПС-24',
}
def sch(no): return f'Исполнительная схема № {no} «{SCH[no]}» (лист 1, листов 1)'
def vk_no(bld, code): return f'ВК-{code}-{bld}'
def prot_no(bld, code): return f'ПИ-{code}-{bld}'
def o_no(bld, code): return f'{code}-{bld}-О'
def reg_full(bld): return f'{REG_NAME} {REG_ID[bld]}'

# ---------------- реестр паспортов и сертификатов: строки ----------------
FILL = '________'   # заполнить по документу (паспорту)

def _equip_docs(pos, nm, typ, mf):
    """Документы о качестве на оборудование. Номера и даты паспортов — по оригиналам (уточняет пользователь)."""
    if 'Delta' in mf:
        return [('Декларация о соответствии', 'РОСС RU Д-VN.РА01.В.24646/23', FILL, FILL, 'заявитель — по декларации'),
                ('Паспорт изготовителя', FILL, FILL, '—', 'Delta')]
    return [('Паспорт (этикетка) изготовителя', FILL, FILL, '—', mf)]

def reg_lines(bld, code):
    """[(стр., продукция, изготовитель, вид, №, дата, срок, кем выдан, листов, к акту, key)]."""
    assert bld == 'КПП'
    out = []
    for title, items in r.VOL[code][3]:
        act = title.split(' — ')[0].replace('АОСР № ', '')
        for key, qty in items:
            nm, mf, un, dks = r.M[key]
            for d in (dks if isinstance(dks, list) else [dks]):
                vid, num, date, srok, who, lst = r.D[d]
                who = who.replace('Изготовитель ', '')
                vid = re.sub(r'^([А-ЯЁ ]+?)(?=\s+[а-яa-z«№(]|$)', lambda m: m.group(1)[:1] + m.group(1)[1:].lower(), vid)
                out.append([nm, mf, vid, num if num not in ('—', None) else 'б/н', date if date not in ('—', None) else 'б/д',
                            srok if srok not in (None,) else '—', who, lst, act, key])
    for pos, nm, typ, mf, qty, src in EQ[(bld, code)]:
        for vid, num, date, srok, who in _equip_docs(pos, nm, typ, mf):
            out.append([f'{nm}, {typ}' + (f' (поз. {pos})' if pos != '—' else ''), mf, vid, num, date, srok, who, FILL,
                        o_no(bld, code), 'EQ:' + typ])
    return [[i] + x for i, x in enumerate(out, 1)]

def lines_of(bld, code, key=None, act=None):
    ls = reg_lines(bld, code)
    return [x[0] for x in ls if (key is None or x[10] == key) and (act is None or x[9] == act)]

def rng(ns):
    ns = sorted(ns)
    return f'стр. {ns[0]}' if len(ns) == 1 else (f'стр. {ns[0]}–{ns[-1]}' if ns == list(range(ns[0], ns[-1] + 1)) else 'стр. ' + ', '.join(map(str, ns)))

# ---------------- АОСР эталонного тома ----------------
LID = set()   # лотки с крышкой (АН: окончание КНС = окончание КЛ). Кабель-каналы сюда не относятся (пользователь, 09.11.2026); у нас лотки проволочные, без крышек

def rekv(d):
    """Реквизиты документа для п. 3 АОСР; паспорт без номера и даты — «б/н, б/д» (АН, 09.11.2026)."""
    import acts2
    t = acts2._rekv(d)
    return t + ', б/н, б/д' if r.D[d][1] in ('—', None, '') else t

def ids(bld, code):
    """Исполнительные схемы тома (№ схемы = № акта)."""
    return [k for k in SCH if bld in k.split('-') and code in k.split('-')]

def aosr(a):
    """Правка АОСР КПП для эталонного тома (вызывается до gen.build)."""
    no = a['no']; code, bld = no.split('-')[1], no.split('-')[2]
    if not is_model(bld, code): return a
    import acts2
    a = dict(a)
    if no in P1: a['p1'] = [P1[no], '']
    # п. 3: материал — документ — строка реестра
    p3 = []
    for title, items in r.VOL[code][3]:
        if not title.startswith(f'АОСР № {no} '): continue
        for key, qty in items:
            nm, mf, un, dks = r.M[key]
            dks = dks if isinstance(dks, list) else [dks]
            ns = lines_of(bld, code, key=key, act=no)
            docs = '; '.join(f'{rekv(d)} (реестр, стр. {n})' for d, n in zip(dks, ns))
            p3.append(f'{nm} — {docs};')
    p3[-1] = p3[-1][:-1] + '.'
    a['p3'] = p3
    # п. 4 и приложения: своя схема; к акту на кабельные линии — КЖ и протокол изоляции
    v = C.vol(bld, code); d = DT[(bld, code)]
    p4 = [sch(no)]
    if no.startswith('3-'):
        p4 += [f'кабельный журнал {v["kj"]};', f'протокол измерения сопротивления изоляции № {prot_no(bld, code)} от {d["prot"]}']
        p4[0] += ';'
    a['p4'] = p4
    apps = [sch(no) + '.']
    if no.startswith('3-'):
        apps += [f'Кабельный журнал {v["kj"]}.', f'Протокол измерения сопротивления изоляции № {prot_no(bld, code)} от {d["prot"]}.']
    apps.append(f'{reg_full(bld)}, {rng(lines_of(bld, code, act=no))} (отдельный том).')
    a['apps'] = apps
    a['p7'] = [x.replace('Прокладка кабельных линий', 'Монтаж кабельных линий') for x in a['p7']]
    if 'кабеленесущ' in a['p1'][0].lower():
        vol = [f'{r.M[k][0]} — {q} {r.M[k][2]}' for t, its in r.VOL[code][3] if t.startswith(f'АОСР № {no} ') for k, q in its]
        a['dop'] = ['; '.join(vol) + f'. Трасса, типоразмер и длина — по исполнительной схеме № {no}.']
        # АН 09.11.2026: КНС с крышкой (кабель-канал) — окончание монтажа совмещается с окончанием монтажа кабельных линий
        keys = [k for t, its in r.VOL[code][3] if t.startswith(f'АОСР № {no} ') for k, q in its]
        if any(k in LID for k in keys):
            import acts2
            kl = next(x for x in acts2.ACTS if x['no'] == f'3-{code}-{bld}')
            a['end'] = a['date'] = kl['end']
            a['p7'] = list(kl['p7'])   # последующие работы — те же, что после монтажа кабельных линий
            a['dop'][0] += ' Крышки лотка установлены после укладки кабелей (акт № ' + kl['no'] + ').'
    a['dop'] = [re.sub(r'Проходки по ИД(?: [^,]+)?, лист \d+', f'Проходки — по исполнительной схеме № {no}', x)
                .replace('после прокладки кабельных линий', 'после монтажа кабельных линий') for x in a['dop']]
    return a

# ---------------- общие куски документов ----------------
REPS = [('Представитель застройщика (технического заказчика) по вопросам строительного контроля',
         'главный специалист отдела строительного контроля Департамента строительного консалтинга АНО «СОЮЗЭКСПЕРТИЗА» ТПП РФ Коренев Д.Ю., НРС НОСТРОЙ С-50-002782, приказ № 37 от 27.04.2026 г.', 'Коренев Д.Ю.'),
        ('Представитель лица, осуществляющего строительство',
         'руководитель проекта Белоногов И.Ю., НРС НОСТРОЙ С-72-258451, приказ № 2 от 14.01.2026 г.', 'Белоногов И.Ю.'),
        ('Представитель лица, выполнившего работы',
         'начальник отдела систем технической безопасности ООО «АльтЭн» Иванчук М.В., приказ № 346 от 01.09.2026 г.', 'Иванчук М.В.')]

def new_doc(landscape=False):
    doc = Document(); s = doc.sections[0]
    if landscape:
        s.orientation = WD_ORIENT.LANDSCAPE; s.page_width, s.page_height = Mm(297), Mm(210)
        s.left_margin = Mm(20); s.right_margin = Mm(10); s.top_margin = Mm(12); s.bottom_margin = Mm(12)
    else:
        s.page_width, s.page_height = Mm(210), Mm(297)
        s.left_margin = Mm(25); s.right_margin = Mm(10); s.top_margin = Mm(15); s.bottom_margin = Mm(15)
    st = doc.styles['Normal']; st.font.name = 'Times New Roman'; st.font.size = Pt(10)
    return doc

def header(doc, title, sub, no, date, isp='Лицо, выполнившее работы:'):
    lab(doc, 'Объект капитального строительства:', C.OBJ)
    lab(doc, 'Застройщик (технический заказчик):', C.ZAK)
    lab(doc, 'Лицо, осуществляющее строительство:', C.STR)
    lab(doc, isp, C.ISP)
    para(doc, 'АКТ', 14, True, align=A.CENTER, before=8, after=0)
    para(doc, title, 12, True, align=A.CENTER, after=0)
    para(doc, sub, 11, True, align=A.CENTER, after=6)
    t = doc.add_table(rows=1, cols=2); t.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell(t.rows[0].cells[0], f'№ {no}', 11); cell(t.rows[0].cells[1], dl(date), 11, align=A.RIGHT)

def commission(doc, verb):
    para(doc, 'Комиссия в составе:', 10, True, before=4)
    for role, who, _ in REPS: lab(doc, role + ':', who, 9)
    para(doc, verb, 10, before=3)

def numbered(doc, xs, start=1):
    for k, x in enumerate(xs, start):
        p = para(doc, after=1); font(p.add_run(f'{k}. '), 10, True)
        if isinstance(x, tuple):
            font(p.add_run(x[0] + ' '), 10, True); font(p.add_run(x[1]), 10, False, True)
        else:
            font(p.add_run(x), 10, False, True)

def signs(doc, width=(Mm(95), Mm(80))):
    hp = para(doc, 'Подписи:', 10, True, before=8, after=2); hp.paragraph_format.keep_with_next = True
    sg = doc.add_table(rows=0, cols=2)
    for k, (role, _, who) in enumerate(REPS):
        rc = sg.add_row().cells
        cell(rc[0], role, 9, True); cell(rc[1], f'____________________ / {who} /', 10, align=A.RIGHT)
        if k < len(REPS) - 1:
            for c in rc:
                for pp in c.paragraphs: pp.paragraph_format.keep_with_next = True
    fix_widths(sg, list(width))

# ---------------- акт входного контроля оборудования ----------------
def build_vk(bld, code, out):
    v = C.vol(bld, code); d = DT[(bld, code)]
    doc = new_doc(landscape=True)
    header(doc, 'входного контроля оборудования', f'{C.SYSN[code]}, здание {bld}', vk_no(bld, code), d['vk'])
    commission(doc, 'провела входной контроль оборудования, поступившего для монтажа, и составила настоящий акт о нижеследующем:')
    numbered(doc, [
        ('Предъявлено оборудование:', f'по рабочей документации {v["rd"]}, {v["rdl"]}, и спецификации {v["so"]} — согласно таблице.'),
        ('Проверено:', 'наличие документов о качестве и их реквизиты, соответствие типа (марки) и количества рабочей документации, маркировка, комплектность, отсутствие внешних повреждений.'),
        ('Основание:', 'ГОСТ 24297-2013 «Верификация закупленной продукции»; СП 48.13330.2019 «Организация строительства».'),
    ])
    H = ['№', 'Наименование оборудования, тип (марка), поз. обозн.', 'Изготовитель', 'Кол-во, шт.',
         'Документ о качестве (вид, №, дата)', 'Срок действия', f'Строка реестра ({REG_ID[bld]})', 'Результат']
    W = [Mm(8), Mm(84), Mm(26), Mm(14), Mm(62), Mm(22), Mm(23), Mm(28)]
    t = doc.add_table(rows=1, cols=len(H)); borders(t); t.autofit = False
    for k, h in enumerate(H): cell(t.rows[0].cells[k], h, 8, True, A.CENTER)
    rl = [x for x in reg_lines(bld, code) if x[10].startswith('EQ:')]
    for n, (pos, nm, typ, mf, qty, src) in enumerate(EQ[(bld, code)], 1):
        mine = [x for x in rl if x[10] == 'EQ:' + typ]
        docs = '; '.join(f'{x[3]} № {x[4]} от {x[5]}' for x in mine)
        srok = '; '.join(x[6] for x in mine)
        rr = t.add_row().cells
        for k, x in enumerate([n, f'{nm}, {typ}' + (f' (поз. {pos})' if pos != '—' else ''), mf, qty, docs, srok,
                               rng([y[0] for y in mine]).replace('стр. ', ''), 'Соответствует']):
            cell(rr[k], x, 8, align=A.CENTER if k in (0, 3, 6) else A.LEFT)
    fix_widths(t, W)
    p = para(doc, before=6); font(p.add_run('Заключение: '), 10, True)
    font(p.add_run('вышеперечисленное оборудование допускается к монтажу.'), 10, False, True)
    para(doc, 'Акт составлен в 3 экземплярах.', 10, before=2)
    signs(doc, (Mm(170), Mm(90)))
    path = f'{out}/Акт входного контроля оборудования {code} {bld}.docx'; save(doc, path); return path

# ---------------- акт смонтированного оборудования ----------------
NORM = {'СПС': 'СП 484.1311500.2020; СП 6.13130.2025; СП 76.13330.2016; ГОСТ Р 59638-2021; эксплуатационной документацией изготовителей оборудования'}
SYSG = {'СПС': 'системы пожарной сигнализации и системы оповещения и управления эвакуацией (АПС, СОУЭ)'}

def build_aso(bld, code, out):
    v = C.vol(bld, code); d = DT[(bld, code)]; no = o_no(bld, code)
    eq = EQ[(bld, code)]; total = sum(x[4] for x in eq)
    doc = new_doc()
    header(doc, f'смонтированного оборудования {SYSG[code]}', f'здание {bld}', no, d['eq_end'])
    commission(doc, 'произвела осмотр оборудования, смонтированного на объекте, и составила настоящий акт о нижеследующем:')
    eq_lines = rng(lines_of(bld, code, act=no))
    numbered(doc, [
        ('К осмотру предъявлено смонтированное оборудование:', f'{SYSG[code]} здания {bld}, всего {total} ед. — '
         'перечень, типы, количество и позиционные обозначения — в ведомости смонтированного оборудования (приложение 1 к настоящему акту).'),
        ('Монтаж выполнен по рабочей документации:', f'{v["rd"]}, {v["rdl"]}. Разработчик — ООО «АльтЭн», ОГРН 1024000944098, ИНН 4025062969.'),
        ('Исполнительная схема:', sch(no).replace('Исполнительная схема ', '') + f'; спецификация установленных изделий и материалов {v["so"]}.'),
        ('Оборудование прошло входной контроль:', f'акт входного контроля оборудования № {vk_no(bld, code)} от {d["vk"]}.'),
        ('Предъявлены документы, подтверждающие соответствие оборудования предъявляемым к нему требованиям:',
         f'{reg_full(bld)}, {eq_lines}.'),
        ('Монтаж выполнен в соответствии с:', NORM[code] + '.'),
        ('Даты:', f'начала монтажа оборудования — {dl(d["eq_start"])}; окончания монтажа оборудования — {dl(d["eq_end"])}'),
        ('Результат осмотра:', 'оборудование смонтировано в полном объёме, повреждений и некомплектности не выявлено, '
                               'маркировка и позиционные обозначения соответствуют исполнительной схеме.'),
    ])
    p = para(doc, before=4); font(p.add_run('Заключение: '), 10, True)
    font(p.add_run(f'оборудование {SYSG[code]} здания {bld} смонтировано в соответствии с рабочей документацией и требованиями нормативных документов; '
                   'разрешается производство пусконаладочных работ.'), 10, False, True)
    para(doc, 'Акт составлен в 3 экземплярах.', 10, before=4)
    p = para(doc, before=2); font(p.add_run('Приложения: '), 10, True)
    font(p.add_run(f'1. Ведомость смонтированного оборудования. 2. {sch(no)}. 3. Акт входного контроля оборудования № {vk_no(bld, code)} от {d["vk"]}.'), 10, False, True)
    signs(doc)
    # приложение 1 — ведомость
    pb = para(doc, f'Приложение 1 к акту смонтированного оборудования № {no} от {d["eq_end"]}', 10, False, True, align=A.RIGHT)
    pb.paragraph_format.page_break_before = True
    para(doc, 'ВЕДОМОСТЬ СМОНТИРОВАННОГО ОБОРУДОВАНИЯ', 12, True, align=A.CENTER, before=4, after=0)
    para(doc, f'{C.SYSN[code]}, здание {bld}', 10, align=A.CENTER, after=6)
    H = ['№', 'Наименование оборудования', 'Тип, марка', 'Изготовитель', 'Поз. обозн.', 'Кол-во, шт.', 'Строка реестра']
    W = [Mm(8), Mm(66), Mm(34), Mm(20), Mm(17), Mm(13), Mm(17)]
    t = doc.add_table(rows=1, cols=len(H)); borders(t); t.autofit = False
    for k, h in enumerate(H): cell(t.rows[0].cells[k], h, 8, True, A.CENTER)
    rl = reg_lines(bld, code)
    for n, (pos, nm, typ, mf, qty, src) in enumerate(eq, 1):
        rr = t.add_row().cells
        ln = rng([x[0] for x in rl if x[10] == 'EQ:' + typ]).replace('стр. ', '')
        for k, x in enumerate([n, nm, typ, mf, pos, qty, ln]):
            cell(rr[k], x, 8, align=A.CENTER if k in (0, 4, 5, 6) else A.LEFT)
    rr = t.add_row().cells; cell(rr[1], 'Итого единиц оборудования', 8, True); cell(rr[5], total, 8, True, A.CENTER)
    fix_widths(t, W)
    para(doc, 'Ведомость составил: начальник отдела систем технической безопасности ООО «АльтЭн» ____________ / Иванчук М.В. /', 10, before=10)
    path = f'{out}/Акт смонтированного оборудования {code} {bld}.docx'; save(doc, path); return path

# ---------------- реестр паспортов и сертификатов (6-й том) ----------------
def build_reg(bld, out):
    doc = new_doc(landscape=True)
    para(doc, REG_NAME.upper(), 13, True, align=A.CENTER, after=0)
    para(doc, f'(документов о качестве на материалы, изделия и оборудование) — {REG_ID[bld]}', 11, True, align=A.CENTER, after=0)
    para(doc, f'Здание {bld}', 11, True, align=A.CENTER, after=4)
    for l, t in [('Объект:', C.OBJ), ('Застройщик (технический заказчик):', C.ZAK), ('Лицо, осуществляющее строительство:', C.STR), ('Лицо, выполнившее работы:', C.ISP)]:
        lab(doc, l, t, 9)
    para(doc, 'Акты исполнительной документации ссылаются на строки настоящего реестра. Копии документов приложены в порядке строк; '
              'на каждой копии — «Копия верна», подпись и печать лица, выполнившего работы. Оригиналы паспортов переданы лицу, осуществляющему строительство.', 9, False, True, after=4)
    H = ['Стр.', 'Продукция (наименование, марка, артикул)', 'Изготовитель', 'Вид документа', 'Номер', 'Дата', 'Срок действия', 'Кем выдан', 'Листов', 'Акт']
    W = [Mm(10), Mm(62), Mm(26), Mm(34), Mm(35), Mm(18), Mm(24), Mm(32), Mm(13), Mm(23)]
    done = [c for (b, c) in sorted(MODEL, key=lambda x: C.SYSTEMS.index(x[1])) if b == bld]
    for code in done:
        para(doc, f'Том {C.SYSTEMS.index(code) + 1}. {C.SYSN[code][:1].upper() + C.SYSN[code][1:]}', 10, True, before=4, after=2)
        t = doc.add_table(rows=1, cols=len(H)); borders(t); t.autofit = False
        for k, h in enumerate(H): cell(t.rows[0].cells[k], h, 8, True, A.CENTER)
        tl = 0
        for x in reg_lines(bld, code):
            rr = t.add_row().cells
            if isinstance(x[8], int): tl += x[8]
            for k, val in enumerate(x[:10]):
                cell(rr[k], val, 8, align=A.CENTER if k in (0, 5, 8, 9) else A.LEFT)
        fix_widths(t, W)
    para(doc, '', after=6)
    sg = doc.add_table(rows=0, cols=2)
    for role, who in [('Составил: начальник отдела систем технической безопасности ООО «АльтЭн»', 'Иванчук М.В.'),
                      ('Проверил: представитель лица, осуществляющего строительство, руководитель проекта', 'Белоногов И.Ю.')]:
        rc = sg.add_row().cells
        cell(rc[0], role, 9, True); cell(rc[1], f'____________________ / {who} /     «____» ____________ 2026 г.', 9, align=A.RIGHT)
    fix_widths(sg, [Mm(150), Mm(117)])
    path = f'{out}/{REG_NAME} {bld}.docx'; save(doc, path); return path

# ---------------- журнал входного контроля материалов ----------------
def build_jvk(bld, code, out):
    """Журнал — только материалы и кабели (оборудование — акт входного контроля)."""
    import jvk
    from openpyxl import load_workbook
    jvk.OUT = out
    p, n = jvk.build(bld, code)
    wb = load_workbook(p); ws = wb.active
    ws['A2'] = 'входного контроля строительных материалов, изделий и кабельной продукции'
    v = C.vol(bld, code)
    ws['A9'] = (f'Рабочая документация {v["rd"]}, {v["rdl"]}; исполнительные схемы № ' + ', '.join(x for x in ids(bld, code) if not x.endswith('-О'))
                + f'; кабельный журнал {v["kj"]}; спецификация {v["so"]}. Количество материалов — по АОСР № {C.aosr_list(bld, code)}.')
    ws['A11'] = f'Журнал начат: {C.DATES[bld]["mat"]}                    Журнал окончен: {C.DATES[bld]["mat"]}'
    # удалить раздел 2 (оборудование) и подписи; дописать ссылки на строки реестра, заключение и подписи
    s2 = next(rw for rw in range(1, ws.max_row + 1) if str(ws.cell(rw, 1).value or '').startswith('Раздел 2'))
    for rng_ in list(ws.merged_cells.ranges):
        if rng_.min_row >= s2: ws.unmerge_cells(str(rng_))
    ws.delete_rows(s2, ws.max_row - s2 + 1)
    rl = reg_lines(bld, code)
    for rw in range(1, s2):
        nm = ws.cell(rw, 3).value
        key = next((k for k, m in r.M.items() if m[0] == nm), None)
        if isinstance(ws.cell(rw, 1).value, int) and key:
            ns = sorted({x[0] for x in rl if x[10] == key})
            mine = [x for x in rl if x[10] == key]
            def fmt(x):
                if x[4] == 'б/н': return f'{x[3]}, б/н, б/д, {x[7].replace("Изготовитель ", "изготовитель ")}'
                return f'{x[3]} № {x[4].replace("№ ", "")} от {x[5]}' + (f', действует {x[6]}' if x[6] not in ('—', '', None) else '')
            ws.cell(rw, 7).value = '; '.join(fmt(x) for x in mine) + f' (Реестр паспортов и сертификатов, {rng(ns)})'
            ws.cell(rw, 11).value = ws.cell(rw, 11).value.replace('АОСР № ', 'АОСР № ')
    from openpyxl.styles import Font, Alignment
    last = 'K'; rw = s2 + 1
    ws.merge_cells(f'A{rw}:{last}{rw}'); c = ws.cell(rw, 1, 'Заключение: вышеперечисленные материалы, изделия и кабельная продукция соответствуют рабочей документации, документы о качестве в наличии; допускаются к применению.')
    c.font = Font(name='Times New Roman', size=10, bold=True); c.alignment = Alignment(wrap_text=True, vertical='top'); ws.row_dimensions[rw].height = 28
    rw += 2
    for role, _, who in REPS:
        ws.merge_cells(f'A{rw}:{last}{rw}'); ws.cell(rw, 1, role).font = Font(name='Times New Roman', size=10, bold=True); rw += 1
        ws.merge_cells(f'A{rw}:F{rw}'); ws.cell(rw, 1, who).font = Font(name='Times New Roman', size=10, italic=True)
        ws.merge_cells(f'G{rw}:H{rw}'); ws.cell(rw, 7, '____________________ (подпись)').font = Font(name='Times New Roman', size=10)
        ws.merge_cells(f'I{rw}:{last}{rw}'); ws.cell(rw, 9, '«____» ____________ 2026 г.').font = Font(name='Times New Roman', size=10)
        rw += 2
    newp = f'{out}/Журнал входного контроля материалов {code} {bld}.xlsx'
    wb.save(newp); os.remove(p); return newp

# ---------------- реестр передачи ИД (опись тома) ----------------
def pages(path):
    """Число страниц документа (LibreOffice → PDF)."""
    tmp = tempfile.mkdtemp()
    try:
        subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', tmp, path], capture_output=True, timeout=180)
        pdf = os.path.join(tmp, os.path.splitext(os.path.basename(path))[0] + '.pdf')
        out = subprocess.run(['pdfinfo', pdf], capture_output=True, text=True).stdout
        return int(re.search(r'Pages:\s+(\d+)', out).group(1))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

DUPLEX = True    # АН 09.11.2026: печать с двух сторон; лист = 2 страницы

def build_opis(bld, code, out):
    """Порядок: акт → его схема → КЖ/протокол; оборудование: акт входного контроля → акт смонтированного оборудования → схема → .СО."""
    v = C.vol(bld, code); d = DT[(bld, code)]; D = C.DATES[bld]
    import pnr
    pd = pnr.dates(bld, code); nn = pnr.ctx(bld, code)[2]
    def f(name): return f'{out}/{name}'
    acts = [a for a in __import__('acts2').ACTS if a['no'].split('-')[1] == code]
    rows = []  # (документ, №, дата, файл | None (лист ИД проектировщика), листов по умолчанию)
    rows.append(('Общие данные', v['id'], '', None, 1))
    rows.append(('Журнал входного контроля строительных материалов, изделий и кабельной продукции', 'б/н', D['mat'], f(f'Журнал входного контроля материалов {code} {bld}.xlsx'), None))
    for a in acts:
        a = aosr(a); no = a['no']; dt_ = f"{a['date'][0]}.{MON.index(a['date'][1]):02d}.2026"
        rows.append((f'Акт освидетельствования скрытых работ «{(P1.get(no) or a["p1"][0])}»', no, dt_, f(f'АОСР {no}.docx'), None))
        rows.append((f'Исполнительная схема «{SCH[no]}»', no, dt_, None, 1))
        if no.startswith('3-'):
            rows.append(('Кабельный журнал', v['kj'], dt_, None, 1))
            rows.append(('Протокол измерения сопротивления изоляции', prot_no(bld, code), d['prot'], f(f'Протокол сопротивления изоляции {code} {bld} (образец и бланк).xlsx'), 1))
    rows.append(('Акт смонтированного оборудования (с ведомостью — приложение 1)', o_no(bld, code), d['eq_end'], f(f'Акт смонтированного оборудования {code} {bld}.docx'), None))
    rows.append((f'Исполнительная схема «{SCH[o_no(bld, code)]}»', o_no(bld, code), d['eq_end'], None, 1))
    rows.append(('Акт входного контроля оборудования (приложение 3 к акту смонтированного оборудования)', vk_no(bld, code), d['vk'], f(f'Акт входного контроля оборудования {code} {bld}.docx'), None))
    rows.append(('Спецификация установленных изделий и материалов', v['so'], '', None, 1))
    for title, key, fn, dd in [('Акт об окончании монтажных работ', 'm', f'Акт об окончании монтажных работ {code} {bld}.docx', pd['mount']),
                               ('Акт о проведении индивидуальных испытаний (72 ч)', 'i', f'Акт индивидуальных испытаний (72 ч) {code} {bld}.docx', pd['end']),
                               ('Технический отчёт о пусконаладочных работах', 't', f'Технический отчёт о ПНР {code} {bld}.docx', pd['end']),
                               ('Акт об окончании пусконаладочных работ', 'p', f'Акт об окончании ПНР {code} {bld}.docx', pd['end']),
                               ('Акт ввода в эксплуатацию', 'v', f'Акт ввода в эксплуатацию {code} {bld}.docx', pd['enter'])]:
        rows.append((title, nn[key], pnr.ds(dd), f(fn), None))
    doc = new_doc()
    para(doc, 'РЕЕСТР', 13, True, align=A.CENTER, after=0)
    para(doc, 'передачи исполнительной документации (опись тома)', 12, True, align=A.CENTER, after=0)
    para(doc, f'Том {C.SYSTEMS.index(code) + 1}. {C.SYSN[code][:1].upper() + C.SYSN[code][1:]}. Здание {bld}', 11, True, align=A.CENTER, after=6)
    for l, t in [('Объект:', C.OBJ), ('Застройщик (технический заказчик):', C.ZAK),
                 ('Лицо, осуществляющее строительство (принимает):', C.STR), ('Лицо, выполнившее работы (передаёт):', C.ISP)]:
        lab(doc, l, t, 9)
    H = ['№', 'Наименование документа', '№ документа', 'Дата', 'Кол-во листов', 'Листов нарастающим итогом']
    W = [Mm(8), Mm(77), Mm(36), Mm(20), Mm(16), Mm(18)]
    t = doc.add_table(rows=1, cols=len(H)); borders(t); t.autofit = False
    for k, h in enumerate(H): cell(t.rows[0].cells[k], h, 8, True, A.CENTER)
    tot = 0
    for n, (nm, no, dt_, path, default) in enumerate(rows, 1):
        if path and default is None:
            pg = pages(path); sheets = math.ceil(pg / 2) if DUPLEX else pg
        else:
            sheets = default
        tot += sheets
        rr = t.add_row().cells
        for k, x in enumerate([n, nm, no or 'б/н', dt_ or 'б/д', sheets, tot]):
            cell(rr[k], x, 8, align=A.CENTER if k in (0, 3, 4, 5) else A.LEFT)
    rr = t.add_row().cells; cell(rr[1], f'Всего: {len(rows)} документов, {tot} листов', 8, True); cell(rr[5], tot, 8, True, A.CENTER)
    fix_widths(t, W)
    para(doc, f'Документы о качестве (копии) — в томе «{REG_NAME}» здания {bld} ({REG_ID[bld]}), передаётся отдельно.', 9, False, True, before=4)
    para(doc, 'Количество экземпляров: 3.', 10, before=2)
    para(doc, '', after=4)
    sg = doc.add_table(rows=0, cols=2)
    for role, who in [('Передал: представитель лица, выполнившего работы', 'Иванчук М.В.'),
                      ('Принял: представитель лица, осуществляющего строительство', 'Белоногов И.Ю.'),
                      ('Принял: ', '')]:
        rc = sg.add_row().cells
        cell(rc[0], role + ('______________________________' if not who else ''), 9, True)
        cell(rc[1], f'____________ / {who or "____________"} /  «___» ________ 2026 г.', 9, align=A.RIGHT)
    fix_widths(sg, [Mm(80), Mm(95)])
    path = f'{out}/Реестр передачи ИД (опись тома) {code} {bld}.docx'; save(doc, path); return path, tot
