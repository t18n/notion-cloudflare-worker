import { config } from './custom/config';

export class HeadRewriter {
  element(element: any) {
    if (config.bodyFont !== '') {
      element.append(`
        <link href="https://fonts.googleapis.com/css?family=${config.bodyFont.replace(' ', '+')}:Regular,Bold,Italic&display=swap" rel="stylesheet" />
        <style>
          * {
            font-family: "${config.bodyFont}" !important;
          }
        </style>`, {
        html: true
      });
    }

    element.append(`<style>
      div.notion-topbar > div > div:nth-child(3) { display: none !important; }
      div.notion-topbar > div > div:nth-child(4) { display: none !important; }
      div.notion-topbar > div > div:nth-child(5) { display: none !important; }
      div.notion-topbar > div > div:nth-child(6) { display: none !important; }
      div.notion-topbar-mobile > div:nth-child(3) { display: none !important; }
      div.notion-topbar-mobile > div:nth-child(4) { display: none !important; }
      div.notion-topbar > div > div:nth-child(1n).toggle-mode { display: block !important; }
      div.notion-topbar-mobile > div:nth-child(1n).toggle-mode { display: block !important; }

      /* Hide Vault */
      div[data-block-id="335c950a-939b-4e07-97b7-cd90ee36b56e"] {
        display: none;
      }

      /* Disqus */
      div#disqus_thread {
        margin-top: 40px;
      }
    </style>`, { html: true })
  }
}
