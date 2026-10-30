"""Пути проекта (относительно репозитория). Работает на Windows и Linux."""
from pathlib import Path
SCRIPTS = Path(__file__).resolve().parent
REPO = SCRIPTS.parent
BASE = SCRIPTS / 'base'                      # распакованный шаблон АОСР (приказ 344/пр)
DATA = SCRIPTS / 'data'                      # входные данные: КЖ КПП (итог), КЖ АБК, спецификация АБК
OUT = REPO / '_сборка'                       # куда build_all.py собирает тома
TMP = OUT / '_tmp'
for p in (OUT, TMP): p.mkdir(parents=True, exist_ok=True)
