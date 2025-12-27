import requests
from bs4 import BeautifulSoup
import json
import os

def scrape_winkels():
    url = "https://woonboulevardutrecht.com"
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Error fetching URL: {e}")
        return

    soup = BeautifulSoup(response.text, "html.parser")

    stores_data = {}

    # Find all text editor widgets
    text_editors = soup.find_all("div", class_="elementor-widget-text-editor")

    for editor in text_editors:
        links = editor.find_all("a")
        # Filter for links that look like store pages
        store_links = [l for l in links if "/winkels/" in l.get("href", "")]

        if not store_links:
            continue

        # Determine category from previous sibling widget
        category = "Unknown"
        prev = editor.find_previous_sibling("div", class_="elementor-widget")
        if prev:
            title_elem = prev.find("h3", class_="elementor-icon-box-title")
            if title_elem:
                category = title_elem.get_text(strip=True)
            else:
                 # Fallback: try SVG title or just text content
                 svg = prev.find("svg")
                 if svg and svg.find("title"):
                     category = svg.find("title").text.capitalize()
                 else:
                     # Clean up text if needed (remove "Created with Sketch.")
                     text = prev.get_text(strip=True)
                     if "Created with Sketch." in text:
                         category = text.split("Created with Sketch.")[-1].strip()
                     else:
                         category = text

        # Process stores in this category
        for link in store_links:
            name = link.get_text(strip=True)
            url = link.get("href")

            if name not in stores_data:
                stores_data[name] = {
                    "name": name,
                    "categories": [],
                    "url": url
                }

            if category not in stores_data[name]["categories"]:
                stores_data[name]["categories"].append(category)

    # Convert to list
    output_list = list(stores_data.values())

    # Sort by name
    output_list.sort(key=lambda x: x["name"])

    with open("winkels_data.json", "w", encoding="utf-8") as f:
        json.dump(output_list, f, indent=4, ensure_ascii=False)

    print(f"Scraped {len(output_list)} stores. Data saved to winkels_data.json")

if __name__ == "__main__":
    scrape_winkels()
