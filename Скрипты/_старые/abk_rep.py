import sys,json
def rep(p,pairs):
    x=open(p,encoding='utf-8').read()
    for a,b in pairs:
        c=x.count('>'+a+'<')
        assert c==1,(a,c)
        x=x.replace('>'+a+'<','>'+b+'<')
    open(p,'w',encoding='utf-8').write(x)
