"""Полная пересборка 10 томов ИД (КПП и АБК) из данных в скриптах.

Запуск (из любой папки):
    python Скрипты/build_all.py                      # собрать в <репозиторий>/_сборка
    python Скрипты/build_all.py --only КПП           # только одно здание
    python Скрипты/build_all.py --deploy "C:/Users/admla/Desktop/Тюрьма для сдачи/ИД КПП и АБК — 10 томов"
                                                     # собрать и перезаписать тома у пользователя
Результат: _сборка/<КПП|АБК>/Том <СИСТЕМА> <ЗДАНИЕ>/ — АОСР, реестр, журнал входного контроля,
акт о смонтированном оборудовании, протокол изоляции; _сборка/КПП/Сводный реестр…; _сборка/Замечания к ИД КПП….
"""
import argparse, shutil, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import paths

SYS = ['СПС', 'СКУД', 'СКС', 'СОТ', 'СОТС']


def vol_dir(bld, code):
    d = paths.OUT / bld / f'Том {code} {bld}'
    d.mkdir(parents=True, exist_ok=True)
    return d


def build(only=None):
    import gen, acts2, acts_abk as AB, r, jvk, aso, prot2, pnr
    for bld in ('КПП', 'АБК'):
        if only and bld != only: continue
        acts = acts2.ACTS if bld == 'КПП' else AB.ACTS
        for code in SYS:
            d = str(vol_dir(bld, code))
            gen.OUT = d
            for a in acts:
                if a['no'].split('-')[1] == code: gen.build(a)
            if bld == 'КПП':
                r.build(code, OUT=d)
            else:
                r.build(code, VOL=AB.RVOL, BLD='АБК', IDC=AB.ABK_ID[code], OUT=d)
            jvk.OUT = aso.OUT = prot2.OUT = pnr.OUT = d
            jvk.build(bld, code); aso.build(bld, code); prot2.build(bld, code); pnr.build(bld, code)
            print(f'{bld} / {code}: {len(list(Path(d).iterdir()))} файлов')
    if only in (None, 'КПП'):
        import reg_certs_kpp, remarks_kpp  # noqa: F401  (собираются при импорте)
    if only in (None, 'АБК'):
        import reg_certs_abk, remarks_abk  # noqa: F401
    shutil.rmtree(paths.TMP, ignore_errors=True)


def deploy(target):
    target = Path(target)
    n = 0
    for f in paths.OUT.rglob('*'):
        if f.is_file() and f.suffix in ('.docx', '.xlsx') and '_tmp' not in f.parts:
            rel = f.relative_to(paths.OUT)
            dst = (target.parent / rel.name) if rel.name.startswith('Замечания') else target / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(f, dst); n += 1
    print(f'Перезаписано файлов: {n} → {target}')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--only', choices=['КПП', 'АБК'])
    ap.add_argument('--deploy', help='папка «ИД КПП и АБК — 10 томов» у пользователя')
    a = ap.parse_args()
    build(a.only)
    if a.deploy: deploy(a.deploy)
