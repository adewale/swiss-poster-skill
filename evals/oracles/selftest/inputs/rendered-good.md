```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  html, body { margin: 0; background: #fafaf9; color: #1c1917; font-family: sans-serif; }
  main { position: relative; width: 840px; height: 1200px; overflow: hidden; }
  h1 { position: absolute; left: 60px; top: 80px; margin: 0; font-size: 96px; line-height: 1; }
  .date { position: absolute; left: 60px; top: 260px; margin: 0; font-size: 40px; }
  .body { position: absolute; left: 60px; top: 400px; width: 600px; margin: 0; font-size: 28px; line-height: 1.3; }
  .cta { position: absolute; left: 60px; top: 1000px; padding: 12px 20px; font-size: 28px; background: #1c1917; color: #fafaf9; }
</style>
</head>
<body>
<main>
  <h1 data-critical="title">Night Tram</h1>
  <p class="date" data-critical="date">Fri 21:00</p>
  <p class="body" data-critical="body">Every station on the last line, one transfer, home before midnight.</p>
  <a class="cta" data-critical="cta">Plan the ride</a>
</main>
</body>
</html>
```
