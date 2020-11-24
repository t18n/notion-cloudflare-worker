import { prettifySlugs } from './custom/slugs';
import { config } from './custom/config';
import { generateSitemap, handleOptions } from './utils';
import { MetaRewriter } from './MetaRewriter';
import { BodyRewriter } from './BodyRewriter';
import { HeadRewriter } from './HeadRewriter';

/** Process slugs */
const PAGE_TO_SLUG: Record<string, string> = {};
const slugs: string[] = [];
const pages = [];
Object.keys(prettifySlugs).forEach(slug => {
  const page = prettifySlugs[slug];
  slugs.push(slug);
  pages.push(page);
  PAGE_TO_SLUG[page] = slug;
});

async function fetchAndApply(request: any) {
  if (request.method === 'OPTIONS') {
    return handleOptions(request);
  }
  let url = new URL(request.url);
  url.hostname = 'www.notion.so';
  if (url.pathname === '/robots.txt') {
    return new Response('Sitemap: https://' + config.domain + '/sitemap.xml');
  }
  if (url.pathname === '/sitemap.xml') {
    let response = new Response(generateSitemap(slugs));
    response.headers.set('content-type', 'application/xml');
    return response;
  }
  let fullPathname = request.url.replace("https://" + config.domain, "");
  let response;
  if (url.pathname.startsWith('/app') && url.pathname.endsWith('js')) {
    response = await fetch(url.toString());
    let body = await response.text();
    response = new Response(body.replace(/www.notion.so/g, config.domain).replace(/notion.so/g, config.domain), response);
    response.headers.set('Content-Type', 'application/x-javascript');
    return response;
  } else if ((url.pathname.startsWith('/api'))) {
    // Forward API
    response = await fetch(url.toString(), {
      body: request.body,
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
      },
      method: 'POST',
    });
    response = new Response(response.body, response);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  } else if (slugs.indexOf(url.pathname.slice(1)) > -1) {
    const pageId = prettifySlugs[url.pathname.slice(1)];
    return Response.redirect('https://' + config.domain + '/' + pageId, 301);
  } else {
    response = await fetch(url.toString(), {
      body: request.body,
      headers: request.headers,
      method: request.method,
    });
    response = new Response(response.body, response);
    response.headers.delete('Content-Security-Policy');
    response.headers.delete('X-Content-Security-Policy');
  }

  return appendJavascript(response, prettifySlugs);
}

async function appendJavascript(res: any, prettifySlugs: any) {
  return new HTMLRewriter()
    .on('title', new MetaRewriter())
    .on('meta', new MetaRewriter())
    .on('head', new HeadRewriter())
    .on('body', new BodyRewriter(prettifySlugs))
    .transform(res);
}

addEventListener('fetch', event => {
  event.respondWith(fetchAndApply(event.request));
});