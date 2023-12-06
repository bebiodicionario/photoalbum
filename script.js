from PIL import Image
import json

# Read configuration
with open("config.txt") as f:
  config = json.load(f)

# Process albums
albums = {}
for album_name, album_path in zip(config["album_names"], config["album_paths"]):
  images, descriptions = process_album("descriptions.txt", album_path)
  albums[album_name] = {
    "name": album_name,
    "images": images,
    "descriptions": descriptions,
  }

# Render template
template_path = config["template_path"] if request_path == "/" else config["about_template_path"]
template = open(template_path).read()

rendered_content = ""
if request_path == "/":
  rendered_albums = []
  for album in albums.values():
    album_template = template.copy()
    for key, value in album.items():
      album_template = album_template.replace("{{ " + key + " }}", value)
    rendered_albums.append(album_template)
  rendered_content = "\n".join(rendered_albums)
else:
  rendered_content = template.replace("{{ about_bio }}", config["about_bio"])

# Generate HTML and write it to a file
with open("index.html", "w") as f:
  f.write(rendered_content)
