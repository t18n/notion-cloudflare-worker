import { config } from './config';

export class HeadRewriter {
  element(element: any) {
    if (config.googleFont !== '') {
      element.append(`<link href="https://fonts.googleapis.com/css?family=${config.googleFont.replace(' ', '+')}:Regular,Bold,Italic&display=swap" rel="stylesheet">
      <style>* { font-family: "${config.googleFont}" !important; }</style>`, {
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
    </style>`, {
      html: true
    })
  }
}
