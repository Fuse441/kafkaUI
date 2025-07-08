import { replaceVariable } from "../../utils/replaceVariable.js";

export async function Dialog(variables = {}, action = {}) {
    const containerDialog = document.querySelector('.container-dialog');
    if (containerDialog) containerDialog.remove();

    if (!document.querySelector('link[data-dialog-style]')) {
        const cssHref = './components/dialog/style.css';
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = cssHref;
        cssLink.setAttribute('data-dialog-style', 'true');
        document.head.appendChild(cssLink);
    }


    const res = await fetch('./components/dialog/dialog.html');
    let html = await res.text();


    html = replaceVariable(html, variables);

    const container = document.createElement('div');
    container.className = "container-dialog"
    container.innerHTML = html;


    document.body.appendChild(container);


    const closeBtn = container.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.remove();
        });
    }

    const submit = container.querySelector('.submit-btn');
    if (submit) {

        submit.addEventListener('click', () => {
            container.remove()
            action?.submit()
        });
    }
    
    return container;
}

export function showDialog(variables = {}, action = {}) {
    Dialog(variables, action)
        .then(container => {
            const myDialog = container.querySelector('.dialog');
            if (myDialog) {
                myDialog.style.display = "block";
            }
        })
        .catch(err => {
            console.error("Failed to show dialog:", err);
        });
}
