# Personal Blog with Notion and CI deploy for CloudFlare Workers

I have been a [Notion](https://notion.so) user for well over a year and really enjoyed it. I have been using it heavily for note taking and interested in turning it to my personal blog, so I don't have to maintain the content separately. While Notion still do not provide support for custom domain, there are some solutions out there like Super, NotionHost, Potion, etc. offering you a solution for a few bucks a month. I've tried only Super but later switch to Fruition due to its flexibility and I can have more control over the code. Please visit [Fruition](https://fruitionsite.com/) first before continue digging to this repo.

This is a CI wrapper for [Fruition](https://fruitionsite.com/) for automatic deployment to CloudFlare. The reason I wanted this is because:
- Editting flexibility: I want to be able to quickly add a `slug`, run `git push` and have my Worker updated automatically instead of going through CloudFlare dashboard.
- Code versioning, of course

## Set up your site
1. Follow [Fruition](https://fruitionsite.com/) tutorial to set up your Notion `hello-world` site first, once it is running, get back here.
2. Clone this project
3. Create a Github repo, add `Secrets` for accessing CloudFlare with [this guide](https://developers.cloudflare.com/workers/learning/getting-started#6-configure-your-project-for-deployment)
  - `CF_API_TOKEN`: Your CF token
  - `CF_ACCOUNT_ID`: Your Worker account id
  - `CF_ZONE_ID`: Zone ID to deploy to
4. Config `wrangler.toml` file, change
  - `name` to the name of your worker
  - `route` to the route you want to serve your content
5. Push your change to Github and check CloudFlare Workers, you should see it deployed.

## Resources
- [Wrangler Action](https://github.com/cloudflare/wrangler-action)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/cli-wrangler/configuration)
- [Fruition](https://fruitionsite.com/)
