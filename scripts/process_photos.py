import os
import shutil
from pathlib import Path
from PIL import Image, ImageOps
import pillow_heif

pillow_heif.register_heif_opener()

PROJECT_ROOT = Path(r"c:\Users\Yuvraj\Downloads\macOS-Portfolio-main\macOS-Portfolio-main")
PUBLIC_PHOTOS = PROJECT_ROOT / "public" / "photos"

SOURCES = [
    {
        "album": "me",
        "label_prefix": "Yuvraj",
        "dir": Path(r"C:\Users\Yuvraj\Desktop\Neww")
    },
    {
        "album": "udaipur",
        "label_prefix": "Udaipur",
        "dir": Path(r"C:\Users\Yuvraj\Desktop\Udaipur")
    },
    {
        "album": "people",
        "label_prefix": "Friends & People",
        "dir": Path(r"C:\Users\Yuvraj\Desktop\People")
    }
]

def main():
    processed_items = []
    
    for src in SOURCES:
        album_name = src["album"]
        dest_dir = PUBLIC_PHOTOS / album_name
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        src_files = sorted(list(src["dir"].glob("*.*")))
        count = 1
        
        for file in src_files:
            if file.suffix.lower() not in [".jpg", ".jpeg", ".png", ".heic"]:
                continue
            
            out_filename = f"{album_name}_{count:02d}.jpg"
            out_path = dest_dir / out_filename
            
            try:
                with Image.open(file) as img:
                    # Fix EXIF orientation if needed
                    img = ImageOps.exif_transpose(img)
                    # Convert RGBA to RGB for JPEG
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    # Save with high quality
                    img.save(out_path, "JPEG", quality=92, optimize=True)
                    
                    web_url = f"/photos/{album_name}/{out_filename}"
                    processed_items.append({
                        "id": f"{album_name}-{count}",
                        "url": web_url,
                        "album": album_name,
                        "label": f"{src['label_prefix']} {count}",
                        "orig": file.name
                    })
                    print(f"Processed: {file.name} -> {web_url}")
                    count += 1
            except Exception as e:
                print(f"Error processing {file.name}: {e}")

    print("\nSummary:")
    print(f"Total processed: {len(processed_items)}")
    import json
    with open(PROJECT_ROOT / "scripts" / "photos_manifest.json", "w") as f:
        json.dump(processed_items, f, indent=2)

if __name__ == "__main__":
    main()
