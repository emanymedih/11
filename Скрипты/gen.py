import re, shutil, os, subprocess, sys, html
import paths, zipfile
BASE = str(paths.BASE)
OUT = str(paths.TMP)
os.makedirs(OUT, exist_ok=True)

def esc(s): return html.escape(s, quote=False)

T = re.compile(r'(<w:t(?: [^>]*)?>)([^<]*)(</w:t>)')

def set_texts(row, vals):
    """vals: dict {index_of_nonempty_wt: new_text}"""
    ms = [m for m in T.finditer(row) if m.group(2).strip()]
    out = []; last = 0
    for i, m in enumerate(ms):
        if i in vals:
            out.append(row[last:m.start()]); out.append('<w:t xml:space="preserve">' + esc(vals[i]) + '</w:t>'); last = m.end()
    out.append(row[last:]); return ''.join(out)

def set_last(row, text):
    n = len([m for m in T.finditer(row) if m.group(2).strip()])
    return set_texts(row, {n - 1: text})

def strict(act):
    """Строго по подстрочникам формы (приказ Минстроя № 344/пр)."""
    import re
    no = act['no']; code = no.split('-')[1]; t = act['p1'][0].lower()
    a = dict(act)
    # п. 2: реквизиты РД и сведения о лице, подготовившем РД
    a['p2'] = [x.replace('Разработчик ООО «АльтЭн», разработал Иванчук М.В.', 'Разработчик — ООО «АльтЭн», ОГРН 1024000944098, ИНН 4025062969.') for x in act['p2']]
    # п. 4: только исполнительные схемы/чертежи/результаты испытаний
    a['p4'] = [x for x in act['p4'] if not x.startswith('(экспликации')]
    if a['p4']: a['p4'][-1] = re.sub(r'[.;,\s]*$', '', a['p4'][-1]) + '.'
    # п. 6: наименования и структурные единицы НД + раздел РД
    rd = [x for x in act['p6'] if x.startswith('рабочая документация')]
    fire = code == 'СПС'
    if 'гильз' in t:
        n6 = ['ПУЭ (7-е изд.), п. 2.1.58; СП 76.13330.2016, п. 6.3.1.13;'] + (['ГОСТ Р 59638-2021, п. 5.4.7;'] if fire else [])
    elif 'кабеленесущ' in t:
        n6 = ['СП 76.13330.2016, п. 6.3.2;'] + (['СП 6.13130.2025, пп. 6.4, 6.5;'] if fire else [])
    else:
        n6 = (['СП 6.13130.2025, пп. 6.2, 6.4, 6.5;', 'ГОСТ Р 59638-2021, пп. 5.4.8, 5.4.10, 5.4.11;', 'СП 76.13330.2016, п. 6.3.1;']
              if fire else ['СП 76.13330.2016, п. 6.3.1; ПУЭ (7-е изд.), гл. 2.1;'])
    a['p6'] = n6 + rd
    # п. 7: только наименования работ
    a['p7'] = [re.sub(r'\s*\(акт № [^)]*\)', '', x) for x in act['p7']]
    return a

def build(act):
    act = strict(act)
    if act['no'].endswith('-КПП'):
        import common as _C
        code = act['no'].split('-')[1]
        act = {k: ([_C.fix_kpp(x, code) for x in v] if isinstance(v, list) and v and isinstance(v[0], str) else v) for k, v in act.items()}
    x = open(BASE + '/word/document.xml', encoding='utf-8').read()
    # header: number / date (global indices in base)
    ms = [m for m in T.finditer(x) if m.group(2).strip()]
    assert ms[21].group(2) == '2КПП/ПС'
    rep = {21: act['no'], 23: act['date'][0], 25: act['date'][1]}
    out = []; last = 0
    for i, m in enumerate(ms):
        if i in rep:
            out.append(x[last:m.start()]); out.append('<w:t xml:space="preserve">' + esc(rep[i]) + '</w:t>'); last = m.end()
    out.append(x[last:]); x = ''.join(out)

    trs = [(m.start(), m.end()) for m in re.finditer(r'<w:tr[ >].*?</w:tr>', x, re.S)]
    rows = [x[a:b] for a, b in trs]
    head = x[:trs[0][0]]; tail = x[trs[-1][1]:]
    between = [x[trs[i][1]:trs[i + 1][0]] for i in range(len(trs) - 1)]
    assert all(b == '' for b in between), 'non-adjacent rows'
    full = rows[64]

    new = {}  # row index -> list of replacement rows (None = keep)
    def section(head_i, cont_is, lines, tmpl=None, head_has_value=True):
        lines = list(lines)
        if head_has_value:
            new[head_i] = [set_last(rows[head_i], lines.pop(0))]
        t = rows[tmpl] if tmpl is not None else (rows[cont_is[0]] if cont_is else full)
        clones = [set_last(t, l) for l in lines]
        if cont_is:
            new[cont_is[0]] = clones
            for c in cont_is[1:]: new[c] = []
        else:
            new[head_i] = new[head_i] + clones

    section(56, [57], act['p1'])
    section(59, [60], act['p2'])
    section(62, [63, 64, 65, 66, 67, 68], act['p3'], tmpl=64, head_has_value=False)
    section(71, [], act['p4'], tmpl=64)
    # dates
    (d1, m1), (d2, m2) = act['start'], act['end']
    new[74] = [set_texts(rows[74], {3: d1, 5: m1})]
    new[75] = [set_texts(rows[75], {2: d2, 4: m2})]
    section(77, [78, 79], act['p6'])
    section(81, [82], act['p7'], tmpl=82, head_has_value=False)
    section(84, [], act['dop'], tmpl=64)
    # appendices
    apps = []
    for k, a in enumerate(act['apps'], 1):
        apps.append(set_texts(rows[88], {0: f'{k}.', 1: a}))
    new[88] = apps
    for c in (89, 90, 91, 92): new[c] = []

    body = []
    for i, r in enumerate(rows):
        body.extend(new.get(i, [r]))
    x = head + ''.join(body) + tail
    d = f"{OUT}/{act['file']}"
    shutil.rmtree(d + '_u', ignore_errors=True)
    shutil.copytree(BASE, d + '_u')
    open(d + '_u/word/document.xml', 'w', encoding='utf-8').write(x)
    if os.path.exists(d + '.docx'): os.remove(d + '.docx')
    with zipfile.ZipFile(d + '.docx', 'w', zipfile.ZIP_DEFLATED) as z:
        names = sorted((os.path.relpath(os.path.join(rt, f), d + '_u').replace(os.sep, '/') for rt, _, fs in os.walk(d + '_u') for f in fs),
                       key=lambda n: (n != '[Content_Types].xml', n))
        for n in names: z.write(os.path.join(d + '_u', n), n)
    shutil.rmtree(d + '_u')
    return d + '.docx'

if __name__ == '__main__':
    import acts2 as acts
    for a in acts.ACTS:
        print(build(a))
