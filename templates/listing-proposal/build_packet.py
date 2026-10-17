"""Build a print-ready listing proposal PDF from packet HTML.
Usage: python3 build_packet.py <packet.html> <page_url> "<output.pdf>"
Logos come from public/3813-polumbo.html (white logos, for navy bands).
Placeholders in the HTML: src="RXW", src="TNT", src="QR".
"""
import sys, re, base64, asyncio, io, os
import qrcode
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src, url, out = sys.argv[1], sys.argv[2], sys.argv[3]
hub = open(os.path.join(ROOT, 'public/3813-polumbo.html')).read()
logos = dict(re.findall(r'<img class="(rx|tnt)" src="(data:image/png;base64,[A-Za-z0-9+/=]+)"', hub))
q = qrcode.QRCode(border=1, box_size=10); q.add_data(url); q.make(fit=True)
buf = io.BytesIO(); q.make_image(fill_color='#1A2744', back_color='white').save(buf, format='PNG')
qr = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()
html = open(src).read().replace('src="RXW"', f'src="{logos["rx"]}"').replace('src="TNT"', f'src="{logos["tnt"]}"').replace('src="QR"', f'src="{qr}"')
tmp = os.path.abspath(out + '.html'); open(tmp, 'w').write(html)
async def go():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        await pg.goto('file://' + tmp, wait_until='networkidle'); await pg.wait_for_timeout(800)
        over = await pg.evaluate("[...document.querySelectorAll('.page')].map(p=>p.scrollHeight-p.clientHeight)")
        print('overflow px per page (must all be 0):', over)
        await pg.pdf(path=out, format='Letter', print_background=True, margin={'top':'0','bottom':'0','left':'0','right':'0'})
        await b.close()
asyncio.run(go()); os.remove(tmp)
