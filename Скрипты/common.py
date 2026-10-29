import re
"""Общие данные томов для журналов, актов о смонтированном оборудовании и протоколов."""
import r, acts_abk as A
from equip import EQ

OBJ = ("«Центр временного содержания иностранных граждан», Калужская область, м. р-н Боровский, "
       "д. Старомихайловское, ул. 1-я Индустриальная, вл. 2, земельный участок с кадастровым номером 40:03:068314:1874")
ZAK = "АНО «СОЮЗЭКСПЕРТИЗА» ТПП РФ, ОГРН 1027739381548, ИНН 7710310183"
STR = "Индивидуальный предприниматель Белоногова Ольга Андреевна, ОГРНИП 315723200029770, ИНН 720200188305"
ISP = "ООО «АльтЭн», ОГРН 1024000944098, ИНН 4025062969"
SYSN = {'СПС': "система пожарной сигнализации и система оповещения и управления эвакуацией (АПС, СОУЭ)",
        'СКУД': "система контроля и управления доступом (СКУД)", 'СКС': "структурированная кабельная система (СКС)",
        'СОТ': "система охранная телевизионная (СОТ)", 'СОТС': "система охранной и тревожной сигнализации (СОТС)"}
SYSTEMS = ['СПС', 'СКУД', 'СКС', 'СОТ', 'СОТС']

KPP_ID = {c: f"16/1/26-{'АПС,СОУЭ' if c == 'СПС' else c}-ИД-КПП" for c in ['СПС', 'СКУД', 'СКС', 'СОТ', 'СОТС']}

def fix_kpp(t, code):
    """Ссылки на старую сводную ИД КПП -> раздельные документы по системам."""
    cid = KPP_ID[code]
    t = re.sub(r'16/1/26-ИД-КПП\.КЖ \(раздел [^)]*\)', cid + '.КЖ', t)
    t = re.sub(r'16/1/26-ИД-КПП, лист \d+', cid + ', лист 2', t)
    t = re.sub(r'по ИД, лист \d+', f'по ИД {cid}, лист 2', t)
    t = re.sub(r'листе \d+ ИД', f'листе 2 ИД {cid}', t)
    return t.replace('16/1/26-ИД-КПП', cid)

def vol(bld, code):
    """RD, лист РД, ID, лист ИД, группы материалов (заголовок, [(key, qty)])."""
    if bld == 'КПП':
        name, rd, sheet, groups = r.VOL[code]
        rdl = {'СПС': 'лист 3'}.get(code, 'лист 4')
        cid = KPP_ID[code]
        return dict(rd=rd, rdl=rdl, id=cid, idl='лист 2', groups=groups, kj=f'{cid}.КЖ', so=f'{cid}.СО')
    name, rd, sheet, groups = A.RVOL[code]
    return dict(rd=rd, rdl=A.RD[code][1], id=A.ID, idl=A.IDL[code], groups=groups, kj=f'{A.ID}.КЖ (раздел {code})', so=None)

def docs_of(key):
    nm, mf, un, dks = r.M[key]
    dks = dks if isinstance(dks, list) else [dks]
    return nm, mf, un, [r.D[d] for d in dks if d]

def doc_text(d):
    import re
    vid, num, date, srok, who, lst = d
    t = re.sub(r'\s*\([^)]*\)', '', vid)
    m = re.match(r'^([А-ЯЁ ,\-]+?)(?=\s+[а-яa-z«№]|,|$)', t)
    if m:
        head = m.group(1); t = head[:1] + head[1:].lower() + t[len(head):]
    app = ''
    mm = re.search(r'\s+с приложени[а-я]+.*$', t)
    if mm: app = mm.group(0); t = t[:mm.start()]
    if num and num != '—' and num not in t:
        n = num.replace('исх. ', '').replace('№ ', '')
        t += (' исх.' if 'исх' in num else '') + f" № {n}"
    if date and date != '—':
        t += f" от {date}" if len(date) == 10 else f" ({date})"
    t += app
    if srok and srok != '—': t += f", действует {srok}"
    if t.lower().startswith('паспорт') and (not num or num == '—'): t += f" ({who.replace('Изготовитель ', 'изготовитель ')})"
    return t

# даты (ДД.ММ.ГГГГ)
DATES = {
 'КПП': dict(mat='04.09.2026', eq='16.10.2026', act='26.10.2026', prot='27.10.2026'),
 'АБК': dict(mat='14.08.2026', eq='04.09.2026', act='18.09.2026', prot='21.09.2026'),
}
AOSR = {'КПП': {'СПС': 3, 'СКУД': 2, 'СКС': 3, 'СОТ': 2, 'СОТС': 1},
        'АБК': {'СПС': 3, 'СКУД': 2, 'СКС': 3, 'СОТ': 2, 'СОТС': 3}}
def aosr_list(bld, code):
    return ', '.join(f'{i}-{code}-{bld}' for i in range(1, AOSR[bld][code] + 1))
