import { validateToken } from './utils/validation.js';

window.addEventListener('DOMContentLoaded', async () => {
  const foundToken = validateToken();



  const appElement = document.querySelector("app");
  if (!appElement) return;

  try {
    if (!foundToken) {
      loadPage('start');
    }


  } catch (err) {
    console.error('Error loading login page:', err);
    appElement.innerHTML = '<p style="color:red;">Failed to load content.</p>';
  }
});


function loadPage(page) {
  const appElement = document.querySelector("app");
  if (!appElement) return;

  fetch(`./pages/${page}/${page}.html`)
    .then(response => response.text())
    .then(htmlContent => {
      appElement.innerHTML = htmlContent;

      // Load CSS
      const cssHref = `./pages/${page}/style.css`;
      const existingLink = document.querySelector(`link[href="${cssHref}"]`);
      if (!existingLink) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = cssHref;
        document.head.appendChild(cssLink);
      }

      // Load JS
      const script = document.createElement('script');
      // script.type = 'module';
      script.src = `./pages/${page}/${page}.js`;
      document.body.appendChild(script);
    })
    .catch(err => {
      console.error(`Error loading ${page} page:`, err);
      appElement.innerHTML = '<p style="color:red;">Failed to load content.</p>';
    });
}
