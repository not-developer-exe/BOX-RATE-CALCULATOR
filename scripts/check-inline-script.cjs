const fs = require('node:fs');
const html = fs.readFileSync(new URL('../index.html', 'file://' + __filename), 'utf8');
const start = html.lastIndexOf('<script>') + 8;
const end = html.indexOf('</script>', start);
if (start < 8 || end < start) throw new Error('Inline script not found');
new Function(html.slice(start, end));
console.log('Inline JavaScript syntax OK');
