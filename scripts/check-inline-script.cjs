const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const startTag = html.lastIndexOf('<script>');
const endTag = html.indexOf('</script>', startTag);
if (startTag < 0 || endTag < 0) throw new Error('Inline script not found');
const script = html.slice(startTag + '<script>'.length, endTag);
new Function(script);
console.log('Inline JavaScript syntax OK');
