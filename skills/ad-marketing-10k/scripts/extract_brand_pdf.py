"""Extract brand assets from a brand-bible PDF.
python3 extract_brand_pdf.py bible.pdf out_dir [--logo-page N]
- prints text per page (colours, fonts, rules, logo anatomy)
- lists vector drawings (fill colour + bbox) per page
- writes logo_wordmark.svg (one <path> per glyph, ids L0.., classes letter/accent/bar/dot) from the logo page
- extracts embedded images as RGB PNG (CMYK converted)
- lists embedded font names (do NOT extract commercial fonts)
Needs: pip install pymupdf"""
import sys, os, pymupdf as fitz
pdf, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
d = fitz.open(pdf)
hexc = lambda c: '#%02x%02x%02x' % tuple(int(v * 255) for v in c) if c else None
fonts = set()
for i, p in enumerate(d):
    print(f'\n=== page {i+1}\n' + p.get_text().strip()[:1500])
    for f in p.get_fonts(): fonts.add(f[3])
    for x in p.get_drawings():
        r = x['rect']
        if r.width > 3 or r.height > 3: print('  draw', hexc(x.get('fill')), hexc(x.get('color')), [round(v) for v in r])
    for j, im in enumerate(p.get_images(full=True)):
        pix = fitz.Pixmap(d, im[0])
        if pix.n - pix.alpha >= 4: pix = fitz.Pixmap(fitz.csRGB, pix)
        pix.save(f'{out}/img_p{i+1}_{j}.png'); print('  image', f'img_p{i+1}_{j}.png', pix.width, pix.height)
print('\nfonts:', sorted(fonts))
def pathd(dr, ox, oy):
    o, cur = [], None
    for it in dr['items']:
        if it[0] == 'l':
            a, b = it[1], it[2]
            if cur is None or abs(cur.x - a.x) > .01 or abs(cur.y - a.y) > .01: o.append(f'M{a.x-ox:.2f} {a.y-oy:.2f}')
            o.append(f'L{b.x-ox:.2f} {b.y-oy:.2f}'); cur = b
        elif it[0] == 'c':
            a, c1, c2, b = it[1:5]
            if cur is None or abs(cur.x - a.x) > .01 or abs(cur.y - a.y) > .01: o.append(f'M{a.x-ox:.2f} {a.y-oy:.2f}')
            o.append(f'C{c1.x-ox:.2f} {c1.y-oy:.2f} {c2.x-ox:.2f} {c2.y-oy:.2f} {b.x-ox:.2f} {b.y-oy:.2f}'); cur = b
        elif it[0] == 're':
            r = it[1]; o.append(f'M{r.x0-ox:.2f} {r.y0-oy:.2f}H{r.x1-ox:.2f}V{r.y1-oy:.2f}H{r.x0-ox:.2f}Z'); cur = None
        elif it[0] == 'qu':
            q = it[1]; o.append(f'M{q.ul.x-ox:.2f} {q.ul.y-oy:.2f}L{q.ur.x-ox:.2f} {q.ur.y-oy:.2f}L{q.lr.x-ox:.2f} {q.lr.y-oy:.2f}L{q.ll.x-ox:.2f} {q.ll.y-oy:.2f}Z'); cur = None
    if dr.get('closePath'): o.append('Z')
    return ''.join(o)
if '--logo-page' in sys.argv:
    p = d[int(sys.argv[sys.argv.index('--logo-page') + 1]) - 1]
    drs = sorted([x for x in p.get_drawings() if x.get('fill') and (x['rect'].width > 3 or x['rect'].height > 3)], key=lambda x: (x['rect'].x0, x['rect'].y0))
    x0 = min(x['rect'].x0 for x in drs); y0 = min(x['rect'].y0 for x in drs)
    x1 = max(x['rect'].x1 for x in drs); y1 = max(x['rect'].y1 for x in drs)
    from collections import Counter
    main = Counter(hexc(x['fill']) for x in drs).most_common(1)[0][0]
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {x1-x0:.1f} {y1-y0:.1f}" width="{x1-x0:.1f}" height="{y1-y0:.1f}">']
    li = ai = 0
    for x in drs:
        r, c = x['rect'], hexc(x['fill'])
        if c != main and r.height < 20: cls, idn = 'bar', 'bar%d' % ai; ai += 1
        elif r.width < 20 and r.height < 20: cls, idn = 'dot', 'dot'
        elif c != main: cls, idn = 'accent', 'A%d' % ai; ai += 1
        else: cls, idn = 'letter', 'L%d' % li; li += 1
        svg.append(f'<path id="{idn}" class="{cls}" data-fill="{c}" fill-rule="{"evenodd" if x.get("even_odd") else "nonzero"}" d="{pathd(x, x0, y0)}"/>')
    svg.append('</svg>'); open(f'{out}/logo_wordmark.svg', 'w').write('\n'.join(svg)); print('wrote', f'{out}/logo_wordmark.svg')
