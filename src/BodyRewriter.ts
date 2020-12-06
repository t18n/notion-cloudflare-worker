import { config } from './custom/config';
import { scripts } from './custom/scripts';

export class BodyRewriter {
  prettifySlugs: string[];

  constructor(prettifySlugs: string[]) {
    this.prettifySlugs = prettifySlugs;
  }

  element(element: any) {
    element.append(`
    <script>
        const prettifySlugs = ${JSON.stringify(this.prettifySlugs)};
        const PAGE_TO_SLUG = {};
        const slugs = [];
        const pages = [];
        const el = document.createElement('div');
        let redirected = false;
        Object.keys(prettifySlugs).forEach(slug => {
          const page = prettifySlugs[slug];
          slugs.push(slug);
          pages.push(page);
          PAGE_TO_SLUG[page] = slug;
        });

        function getPage() {
          return location.pathname.slice(-32);
        }

        function getSlug() {
          return location.pathname.slice(1);
        }

        function updateSlug() {
          const slug = PAGE_TO_SLUG[getPage()];
          if (slug != null) {
            history.replaceState(history.state, '', '/' + slug);
          }
        }

        function onDark() {
          el.innerHTML = '<div style="margin-left: auto; margin-right: 14px; min-width: 0px;"><div role="button" tabindex="0" style="user-select: none; transition: background 120ms ease-in 0s; cursor: pointer; border-radius: 44px;"><div style="display: flex; flex-shrink: 0; height: 14px; width: 26px; border-radius: 44px; padding: 2px; box-sizing: content-box; background: rgb(46, 170, 220); transition: background 200ms ease 0s, box-shadow 200ms ease 0s;"><div style="width: 14px; height: 14px; border-radius: 44px; background: white; transition: transform 200ms ease-out 0s, background 200ms ease-out 0s; transform: translateX(12px) translateY(0px);"></div></div></div></div>';
          document.body.classList.add('dark');
          __console.environment.ThemeStore.setState({ mode: 'dark' });
        };

        function onLight() {
          el.innerHTML = '<div style="margin-left: auto; margin-right: 14px; min-width: 0px;"><div role="button" tabindex="0" style="user-select: none; transition: background 120ms ease-in 0s; cursor: pointer; border-radius: 44px;"><div style="display: flex; flex-shrink: 0; height: 14px; width: 26px; border-radius: 44px; padding: 2px; box-sizing: content-box; background: rgba(135, 131, 120, 0.3); transition: background 200ms ease 0s, box-shadow 200ms ease 0s;"><div style="width: 14px; height: 14px; border-radius: 44px; background: white; transition: transform 200ms ease-out 0s, background 200ms ease-out 0s; transform: translateX(0px) translateY(0px);"></div></div></div></div>';
          document.body.classList.remove('dark');
          __console.environment.ThemeStore.setState({ mode: 'light' });
        }

        function toggle() {
          if (document.body.classList.contains('dark')) {
            onLight();
          } else {
            onDark();
          }
        }

        function addDarkModeButton(device) {
          const nav = device === 'web' ? document.querySelector('.notion-topbar').firstChild : document.querySelector('.notion-topbar-mobile');
          el.className = 'toggle-mode';
          el.addEventListener('click', toggle);
          nav.appendChild(el);
          onLight();
        }
        const observer = new MutationObserver(function() {
          if (redirected) return;
          const nav = document.querySelector('.notion-topbar');
          const mobileNav = document.querySelector('.notion-topbar-mobile');
          if (nav && nav.firstChild && nav.firstChild.firstChild
            || mobileNav && mobileNav.firstChild) {
            redirected = true;
            updateSlug();
            addDarkModeButton(nav ? 'web' : 'mobile');
            const onpopstate = window.onpopstate;
            window.onpopstate = function() {
              if (slugs.includes(getSlug())) {
                const page = prettifySlugs[getSlug()];
                if (page) {
                  history.replaceState(history.state, 'bypass', '/' + page);
                }
              }
              onpopstate.apply(this, [].slice.call(arguments));
              updateSlug();
            };
          }
        });
        
        observer.observe(document.querySelector('#notion-app'), {
          childList: true,
          subtree: true,
        });
        const replaceState = window.history.replaceState;
        window.history.replaceState = function(state) {
          if (arguments[1] !== 'bypass' && slugs.includes(getSlug())) return;
          return replaceState.apply(window.history, arguments);
        };
        const pushState = window.history.pushState;
        window.history.pushState = function(state) {
          const dest = new URL(location.protocol + location.host + arguments[2]);
          const id = dest.pathname.slice(-32);
          if (pages.includes(id)) {
            arguments[2] = '/' + PAGE_TO_SLUG[id];
          }
          return pushState.apply(window.history, arguments);
        };
        const open = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function() {
          arguments[1] = arguments[1].replace('${config.domain}', 'www.notion.so');
          return open.apply(this, [].slice.call(arguments));
        };
      </script>
      ${scripts}`, {
      html: true
    });
  }
}