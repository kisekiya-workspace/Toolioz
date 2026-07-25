from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter


OUT_DIR = Path("public/biodata-backgrounds")
W, H = 794, 1123


def hex_color(value: str):
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4))


def save_floral():
    img = Image.new("RGB", (W, H), "#fbfaf7")
    draw = ImageDraw.Draw(img, "RGBA")

    for x in range(0, W, 18):
      draw.line((x, 0, x, H), fill=(80, 80, 80, 5), width=1)
    for y in range(0, H, 18):
      draw.line((0, y, W, y), fill=(80, 80, 80, 4), width=1)

    stem = (165, 145, 135, 80)
    petal = (200, 167, 160, 72)
    leaf = (92, 112, 90, 48)
    draw.line((690, 80, 650, 270, 676, 470), fill=stem, width=3)
    draw.line((725, 130, 672, 310, 704, 520), fill=stem, width=2)
    for cx, cy, r in [(716, 112, 8), (690, 162, 6), (674, 250, 7), (718, 292, 5), (656, 380, 6)]:
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=petal)
    for box in [(630, 210, 690, 246), (676, 340, 738, 374), (620, 450, 680, 484)]:
        draw.ellipse(box, fill=leaf)

    draw.ellipse((616, 46, 792, 224), fill=(200, 167, 160, 16))
    draw.ellipse((660, 380, 850, 578), fill=(200, 167, 160, 10))
    img.save(OUT_DIR / "floral-editorial.png", optimize=True)


def save_slate():
    img = Image.new("RGB", (W, H), "#ffffff")
    draw = ImageDraw.Draw(img, "RGBA")
    draw.rectangle((0, 0, 220, H), fill=hex_color("#f4f1ef"))
    draw.rectangle((170, 68, W, 188), fill=hex_color("#595550"))
    draw.rectangle((0, 0, 220, H), fill=(217, 208, 203, 58))
    draw.line((220, 0, 220, H), fill=(89, 85, 80, 24), width=2)
    draw.ellipse((28, 30, 182, 184), fill=(255, 255, 255, 255))
    draw.ellipse((38, 40, 172, 174), fill=(217, 208, 203, 130))
    for y in range(252, H - 50, 28):
        draw.line((268, y, W - 42, y), fill=(89, 85, 80, 26), width=1)
    img.save(OUT_DIR / "slate-banner.png", optimize=True)


def ornate_corner(draw, x, y, flip_x=False, flip_y=False):
    gold = (242, 192, 120, 190)
    def tx(px, py):
        return (x + (-px if flip_x else px), y + (-py if flip_y else py))
    def box(x0, y0, x1, y1):
        ax, ay = tx(x0, y0)
        bx, by = tx(x1, y1)
        return (min(ax, bx), min(ay, by), max(ax, bx), max(ay, by))
    for i in range(0, 5):
        draw.arc(box(8 + i * 14, 24 + i * 8, 86 + i * 6, 102 + i * 8), 205, 292, fill=gold, width=2)
    draw.line((*tx(18, 100), *tx(116, 18)), fill=gold, width=2)
    for px, py, r in [(35, 86, 6), (58, 62, 4), (84, 38, 5)]:
        cx, cy = tx(px, py)
        draw.ellipse((cx - r, cy - r, cx + r, cy + r), outline=gold, width=2)


def save_royal():
    img = Image.new("RGB", (W, H), "#00777c")
    draw = ImageDraw.Draw(img, "RGBA")
    for y in range(0, H, 18):
        for x in range(-18, W, 36):
            draw.arc((x, y, x + 36, y + 28), 200, 340, fill=(248, 231, 196, 18), width=1)
    draw.rectangle((22, 22, W - 22, H - 22), outline=(242, 192, 120, 160), width=2)
    draw.ellipse((W // 2 - 168, H // 2 - 168, W // 2 + 168, H // 2 + 168), outline=(242, 192, 120, 34), width=3)
    draw.ellipse((W // 2 - 112, H // 2 - 112, W // 2 + 112, H // 2 + 112), outline=(242, 192, 120, 24), width=2)
    ornate_corner(draw, 22, 22)
    ornate_corner(draw, W - 22, 22, flip_x=True)
    ornate_corner(draw, 22, H - 22, flip_y=True)
    ornate_corner(draw, W - 22, H - 22, flip_x=True, flip_y=True)
    img = img.filter(ImageFilter.UnsharpMask(radius=1, percent=80, threshold=3))
    img.save(OUT_DIR / "royal-teal.png", optimize=True)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    save_floral()
    save_slate()
    save_royal()


if __name__ == "__main__":
    main()
