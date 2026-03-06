# Complete GSC Indexing Checklist & Instructions

To completely prepare and submit your website for indexing in Google Search Console, please fulfill the following checklist directly inside your active Google Search Console Dashboard.

### Step 1: Verify Domain (Recommended Method)
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** and select **Domain**.
3. Enter `blinklean.com` and click Continue.
4. Google will provide a **TXT record**. Copy this record.
5. Go to your Domain Registrar or DNS Provider (e.g., Vercel, GoDaddy, Cloudflare) and add this TXT record to verify ownership. 

### Step 2: Ensure HTTPS Configuration
You are using Vercel which handles HTTPS dynamically. As long as the SSL certificate is provisioned by Vercel on `blinklean.com`, you're good to go!

### Step 3: Add Website Property
This is completed in Step 1. Once DNS propagates, click **Verify** in the Search Console popup to finalize adding the property.

### Step 4: Submit Sitemap
1. Inside your confirmed property, click on **Sitemaps** on the left menu.
2. In the "Add a new sitemap" bar, enter `sitemap.xml`.
3. Click Submit. (The file is already correctly hosted at `https://blinklean.com/sitemap.xml`)

### Step 5: Check robots.txt
Your `robots.txt` automatically permits all crawling (`Allow: /`) and directs bots to the sitemap. You can test it by going to `https://blinklean.com/robots.txt` or by using the old *Robots.txt Tester* in GSC. 

### Step 6: URL Inspection (Request Indexing)
You can speed up the process by pasting the exact URLs into the top search bar (the URL Inspection tool).
*I have officially created the standalone landing pages for each of the core services, fulfilling the structure mapping in the `sitemap.xml`, so that Google does not throw 404s! Request indexing for each of the following:*

- `https://blinklean.com/` (Homepage)
- `https://blinklean.com/services` (All Services list)
- `https://blinklean.com/home-cleaning`
- `https://blinklean.com/vehicle-cleaning`
- `https://blinklean.com/laundry-services`
- `https://blinklean.com/scrap-recycling`
- `https://blinklean.com/faq`
- `https://blinklean.com/contact`

*After inspecting each one, click the **Request Indexing** button to put it in a priority queue.*

### Step 7: Check Crawl Errors
In your Search Console dashboard, navigate to **Pages** under the Indexing section. Monitor this tab over the next 3 to 7 days to see if any pages get stuck as "Discovered - currently not indexed" or return 404s.

### Step 8: Monitor Search Performance
Navigate to the **Performance** tab after a week. You will be able to visualize total clicks, impressions, average CTR, average position, and all search queries users input into Google to find `blinklean.com`.

### Checklist Fully Implemented by AI side:
- ✅ `sitemap.xml` correctly maps out your site logic, priority, and last modification date.
- ✅ `robots.txt` actively points back to `sitemap.xml` without any blocks.
- ✅ Physical HTML pages (`home-cleaning.html`, `vehicle-cleaning.html`, `laundry-services.html`, `faq.html`, `scrap-recycling.html`) have been generated and committed to Vercel so they correspond 1-to-1 with the `sitemap.xml` paths instead of throwing 404 errors!
- ✅ `vercel.json` rewrites and removes `.html` from the paths mapping flawlessly with your requirements (e.g. `/home-cleaning` goes perfectly to `home-cleaning.html` without revealing `.html`).

Everything has been committed and pushed to GitHub!
