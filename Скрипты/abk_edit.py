import re,sys,json
def apply(xml_path,new,empties):
    x=open(xml_path,encoding='utf-8').read()
    ms=[m for m in re.finditer(r'<w:t(?: [^>]*)?>([^<]*)</w:t>',x) if m.group(1).strip()]
    out=[];last=0
    for i,m in enumerate(ms):
        if i in new:
            out.append(x[last:m.start()]); out.append('<w:t xml:space="preserve">'+new[i]+'</w:t>'); last=m.end()
    out.append(x[last:]); x=''.join(out)
    for old,text in empties:
        assert x.count(old)==1,old
        x=x.replace(old,old[:-2]+'><w:r><w:rPr><w:i/><w:iCs/></w:rPr><w:t xml:space="preserve">'+text+'</w:t></w:r></w:p>')
    open(xml_path,'w',encoding='utf-8').write(x)
