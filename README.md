[![npm version](https://img.shields.io/npm/v/@two02/n8n-nodes-google-maps-scraper.svg)](https://www.npmjs.com/package/@two02/n8n-nodes-google-maps-scraper)

# n8n-nodes-geoscraper

This is an n8n community node for Google Maps scraping, including places, reviews, and auto-search functionality.

## Package

You can install this node from npm:

[https://www.npmjs.com/package/@two02/n8n-nodes-google-maps-scraper](https://www.npmjs.com/package/@two02/n8n-nodes-google-maps-scraper)

```
npm install @two02/n8n-nodes-google-maps-scraper
```

Geoscraper is a powerful tool for scraping Google Maps data, including reviews, search results, and auto search suggestions. Pricing is now package-based with both pay-as-you-go credits and monthly plans. Obtain your API token by visiting [https://geoscraper.net/api](https://geoscraper.net/api), then use this node to access GeoScraper in n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node supports the following operations:

- Scrape Google Maps reviews
- Scrape Google Maps results
- Scrape Google Maps auto search suggestions

## Credentials

To use this node, you need a Geoscraper API token. You can get a token by signing up at [https://geoscraper.net/api](https://geoscraper.net/api), choosing either pay-as-you-go credits or a monthly package. After signing up, copy your API token and add it to the node's credentials in n8n.

--

## Pricing

GeoScraper pricing has changed and is now package-based:

- **Pay-as-you-go:** `$1 per 1,000 credits` (no subscription required)
- **Google Maps scraping usage:** `2 credits per request`
- **Monthly plans:** Starter, Pro, and Business tiers
- **Enterprise:** Custom packages for high-volume teams

See the latest pricing and package details here: [https://www.geoscraper.net/pricing](https://www.geoscraper.net/pricing).

---

## Compatibility

- Minimum n8n version: 1.95.3
- Tested with: 1.95.3
- Known issues: None

## Usage

To automate the extraction of Google Maps data for your business or research needs, follow these steps to get started:

### How to Get Your GeoScraper API Token

1. Go to [https://geoscraper.net/api](https://geoscraper.net/api).
2. Log in or sign up and choose a pricing package (pay-as-you-go credits or monthly plan).
3. Once logged in, you will see your API token on the dashboard. See the example below:

   ![Copy your API token from the GeoScraper dashboard](images/api/api1.png)

4. Copy the API token.
5. In n8n, add a new credential for the GeoScraper node and paste your API token into the appropriate field. See the example below:

   ![Paste your API token into n8n](images/api/api2.png)

Now you can use this node to automate Google Maps scraping in your workflows.

For more details on how to use the node, refer to the n8n documentation or the Geoscraper API docs.

### Map Search

Use the **Map Search** operation to find places on Google Maps by location and query.

- You can enter either a location name (e.g., "New York") or geographic coordinates (e.g., "40.7128,-74.0060").
- Add your search query (e.g., "coffee shop").
- Specify the page number you want to retrieve results from.

See the example below:

![Map Search operation in n8n](images/operations/mapSearch1.png)

#### Example Output

Once you have run the operation, you will get an output like this:

![Map Search output example](images/operations/mapSearch2.png)

If no data is found, you will see a message like this:

![No data found output example](images/operations/mapSearch3.png)

### Review

Use the **Review** operation to gather reviews from Google Maps for a specific place.

- First, obtain the Place Data ID from a previous Map Search operation.
- Enter the Place Data ID into the Review operation to fetch reviews for that location.

See the example below:

![Review operation in n8n](images/operations/MapReview1.png)

#### Fetching Additional Pages

If there are more reviews available, the response will include a `next_page_token`. Use this token in the Review operation to fetch the next page of reviews.

See the example below:

![Using next_page_token for more reviews](images/operations/MapReview2.png)

### Single Place Details

Use the **Single Place Details** operation to retrieve detailed information about a specific place on Google Maps.

- You need to provide either the Data ID or the Place ID for the location you want details about.

See the example below:

![Single Place Details operation in n8n](images/operations/SinglePlace1.png)

#### Example Output

The operation will return output like this:

![Single Place Details output example](images/operations/SinglePlace2.png)

### Google Maps Auto Search for Places

Use the **Google Maps Auto Search** operation to quickly find basic information about places.

- This operation returns only coordinates, data_id, country code, and other basic details.
- It is especially suitable for finding the data_id for single places.

See the example below:

![Google Maps Auto Search operation in n8n](images/operations/autoSearch1.png)

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Geoscraper API documentation](https://geoscraper.net/api)

## Version history

- v1.0.10: Latest release.
- v1.0.0: Initial release with support for Google Maps reviews, results, and auto search scraping.
