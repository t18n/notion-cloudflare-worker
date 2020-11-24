import { config } from './custom/config';

export class MetaRewriter {
  element(element: any) {
    if (config.pageTitle !== '') {
      if (element.getAttribute('property') === 'og:title'
        || element.getAttribute('name') === 'twitter:title') {
        element.setAttribute('content', config.pageTitle);
      }
      if (element.tagName === 'title') {
        element.setInnerContent(config.pageTitle);
      }
    }
    if (config.pageDescription !== '') {
      if (element.getAttribute('name') === 'description'
        || element.getAttribute('property') === 'og:description'
        || element.getAttribute('name') === 'twitter:description') {
        element.setAttribute('content', config.pageDescription);
      }
    }
    if (element.getAttribute('property') === 'og:url'
      || element.getAttribute('name') === 'twitter:url') {
      element.setAttribute('content', config.domain);
    }
    if (element.getAttribute('name') === 'apple-itunes-app') {
      element.remove();
    }
  }
}