export function replaceVariable(html, variables = {}) {
    console.log("html, variables ==> ", html, variables);

    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`\\{${key}\\}`, 'gm');
        html = html.replace(regex, value);
    });

    return html;
}