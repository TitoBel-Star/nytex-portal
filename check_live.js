async function check() {
  const res = await fetch('https://nytex-erp-portal.onrender.com/portal');
  const text = await res.text();
  const match = text.match(/src="(\/assets\/[^"]+)"/);
  console.log('Live JS on Render:', match ? match[1] : 'not found');
}
check();
