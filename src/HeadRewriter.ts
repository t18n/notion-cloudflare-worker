import { config } from './custom/config';
import fs from 'fs';

let contentCSS = "";

fs.readFile(__dirname + "/style.css", (error: any, data: any) => {
  if (error) {
    throw error;
  }

  contentCSS = data.toString();
});


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

    element.append(`<style>${contentCSS}</style>`, { html: true })
  }
}
