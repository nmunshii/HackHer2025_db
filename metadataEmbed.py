from PIL import Image, PngImagePlugin

def embed_metadata(image_path, hash):
    img = Image.open(image_path)
    metadata = PngImagePlugin.PngInfo()
    metadata.add_text("auth_hash", hash)
    img.save("output_image.png", pnginfo=metadata)
