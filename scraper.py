import requests
from bs4 import BeautifulSoup
import csv
import sys

def scrape_stores(output_file='stores.csv'):
    url = "https://woonboulevardutrecht.com/jm-ajax/get_listings/"

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    page = 1
    all_stores = []

    while True:
        print(f"Fetching page {page}...")
        payload = {
            "per_page": 50,
            "orderby": "featured",
            "order": "DESC",
            "page": page,
            "show_pagination": "true"
        }

        try:
            response = requests.post(url, data=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            break

        html_content = data.get("html", "")
        if not html_content:
            print("No HTML content received.")
            break

        soup = BeautifulSoup(html_content, "html.parser")
        listings = soup.find_all(class_="job_listing")

        if not listings:
            print("No listings found on this page.")
            break

        for listing in listings:
            # Try to get data from data attributes first as it is cleaner
            store_url = listing.get('data-permalink')

            # Fallback to parsing HTML if attribute is missing
            if not store_url:
                title_tag = listing.select_one('.listing-title a')
                if title_tag:
                    store_url = title_tag.get('href')

            # Get title
            title_tag = listing.select_one('.listing-title a')
            store_name = title_tag.get_text(strip=True) if title_tag else "Unknown"

            if store_name and store_url:
                # Avoid duplicates if any
                if [store_name, store_url] not in all_stores:
                    all_stores.append([store_name, store_url])

        max_pages = data.get('max_num_pages', 1)
        print(f"Page {page} of {max_pages} processed. Found {len(listings)} listings on this page.")

        if page >= max_pages:
            break

        page += 1

    print(f"Total stores found: {len(all_stores)}")

    try:
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Store Name', 'URL'])
            writer.writerows(all_stores)
        print(f"Successfully wrote to {output_file}")
    except Exception as e:
        print(f"Error writing to CSV: {e}")

if __name__ == "__main__":
    scrape_stores()
