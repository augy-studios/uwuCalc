const fs = require('fs');
const path = require('path');
const { CALC_BY_SLUG } = require('../../js/registry');

let templateCache = null;

function getTemplate() {
    if (!templateCache) {
        templateCache = fs.readFileSync(
            path.join(__dirname, '..', '..', 'calc-template.html'),
            'utf-8'
        );
    }
    return templateCache;
}

module.exports = (req, res) => {
    const { slug } = req.query;
    const calc = CALC_BY_SLUG[slug];

    let html = getTemplate();

    if (calc) {
        const safeDesc = calc.description.replace(/"/g, '&quot;');
        html = html
            .replace(/\{\{CALC_NAME\}\}/g, calc.name)
            .replace(/\{\{CALC_DESC\}\}/g, safeDesc);
    } else {
        html = html
            .replace(/\{\{CALC_NAME\}\}/g, 'Calculator Not Found')
            .replace(/\{\{CALC_DESC\}\}/g, 'The requested calculator was not found.');
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
};
