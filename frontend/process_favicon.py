from PIL import Image, ImageDraw

def make_circle_png(input_path, output_path):
    # Open the image and convert to RGBA
    img = Image.open(input_path).convert("RGBA")
    w, h = img.size
    
    # Scale to match frontend UI behavior to crop out pure black edges.
    new_w, new_h = int(w * 1.05), int(h * 1.05)
    img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    left = (new_w - w) / 2
    top = (new_h - h) / 2
    right = (new_w + w) / 2
    bottom = (new_h + h) / 2
    img = img.crop((left, top, right, bottom))

    # Create a perfectly round alpha mask to create a circular icon
    mask = Image.new('L', (w, h), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, w, h), fill=255)

    img.putalpha(mask)
    
    # Save as PNG properly
    img.save(output_path, "PNG")

if __name__ == "__main__":
    make_circle_png("public/logo1.jpeg", "public/favicon.png")
