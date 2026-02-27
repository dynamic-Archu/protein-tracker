import os
from rembg import remove
from PIL import Image

input_dir = 'public/floating'
output_dir = 'public/floating'

# Ensure the output directory exists
os.makedirs(output_dir, exist_ok=True)

for filename in os.listdir(input_dir):
    if filename.endswith('.png'):
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)
        
        try:
            print(f"Processing {filename}...")
            input_image = Image.open(input_path)
            output_image = remove(input_image)
            output_image.save(output_path)
            print(f"Successfully processed {filename}")
        except Exception as e:
            print(f"Failed to process {filename}: {e}")
