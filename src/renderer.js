import { validateToken } from './utils/validation.js';
import { Dialog } from './components/dialog/dialog.js';
const pageButtons = document.querySelectorAll('[id^="page_"]');

pageButtons.forEach(button => {
  const pageName = button.id.replace('page_', '');
  button.addEventListener('click', () => {
    console.log("pageName ==> ", pageName);

    loadPage(pageName);
  });
});




window.addEventListener('DOMContentLoaded', async () => {



  const appElement = document.querySelector("app");
  if (!appElement) return;

  try {
    const cssHref = `./style.css`;
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = cssHref;
    document.head.appendChild(cssLink);
    loadPage('start');



  } catch (err) {
    console.error('Error loading login page:', err);
    appElement.innerHTML = '<p style="color:red;">Failed to load content.</p>';
  }
});


export function loadPage(page, cmd, argv) {
  const appElement = document.querySelector("app");
  if (!appElement) return;

  // Remove previously loaded page CSS
  const prevCss = document.querySelector('link[data-page-style]');
  if (prevCss) prevCss.remove();

  // appElement.innerHTML = '<p style="color:gray;">Loading...</p>';

  fetch(`./pages/${page}/${page}.html`)
    .then(response => response.text())
    .then(htmlContent => {
      appElement.innerHTML = htmlContent;

      // Load CSS
      const cssHref = `./pages/${page}/style.css`;
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = cssHref;
      cssLink.setAttribute('data-page-style', page);
      document.head.appendChild(cssLink);

      // Load JS as module dynamically
      import(`./pages/${page}/${page}.js`)
        .then(module => {
          if (typeof module.initPage === 'function') {
            module.initPage(cmd, argv);
          }
        })
        .catch(err => {
          console.error(`Error loading module for ${page}:`, err);
        });
    })
    .catch(err => {
      console.error(`Error loading ${page} page:`, err);
      appElement.innerHTML = '<p style="color:red;">Failed to load content.</p>';
    });
}

