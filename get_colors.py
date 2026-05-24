from PIL import Image
from collections import Counter

def rgb_to_hex(rgb):
    return '#{:02x}{:02x}{:02x}'.format(rgb[0], rgb[1], rgb[2])

def get_dominant_colors(image_path, num_colors=5):
    img = Image.open(image_path).convert("RGBA")
    pixels = img.getdata()
    
    # Filter out transparent or semi-transparent pixels, and white-ish/black-ish if desired
    # For a logo, we just want the solid colors
    solid_pixels = []
    for p in pixels:
        # Ignore fully transparent or near transparent
        if p[3] > 200:
            # Ignore near white (background artifacts)
            if not (p[0] > 240 and p[1] > 240 and p[2] > 240):
                solid_pixels.append((p[0], p[1], p[2]))
                
    # Get the most common colors
    counts = Counter(solid_pixels)
    most_common = counts.most_common(num_colors)
    
    print("Dominant Colors found in the logo:")
    for color, count in most_common:
        hex_color = rgb_to_hex(color)
        print(f"{hex_color} - RGB: {color} (Count: {count})")

get_dominant_colors("logo_transparent.png")
