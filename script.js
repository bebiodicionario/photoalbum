from PIL import Image
import json
import marked

# Read configuration
with open("config.md") as f:
  config_md = f.read()
  config = marked.parse(config_md)

# Extract configuration data
album_names = config["album_names"]
album_paths = config["album_paths"]
template_paths = config["template_paths"]
site_title = config["site_title"]
navigation_links = config["navigation_links"]
about_bio = config["about_page_content"]

# Process albums
albums = {}
for album_name, album_path in zip(album_names, album_paths):
  images, descriptions = process_album("descriptions.txt", album_path)
  albums[album_name] = {
    "name": album_name,
    "images": images,
    "descriptions": descriptions,
  }

# Render templates
index_template = open(template_paths["index"]).read()
about_template = open(template_paths["about"]).read()

rendered_albums = []
for album in albums.values():
  album_template = index_template.copy()
  for key, value in album.items():
    album_template = album_template.replace("{{ " + key + " }}", value)
  rendered_albums.append(album_template)

rendered_about_content = about_template.replace("{{ about_bio }}", about_bio)

# Generate HTML and write it to files
with open("index.html", "w") as f:
  f.write("\n".join(rendered_albums))
with open("about.html", "w") as f:
  f.write(rendered_about_content)
