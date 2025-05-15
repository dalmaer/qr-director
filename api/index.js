// api/index.js
import fs from 'fs';
import path from 'path';
import urlsData from '../urls.json';

export default function handler(req, res) {
  // 1. Build full URLs for any images in public/photos
  const photosDir = path.join(process.cwd(), 'public/photos');
  let photoUrls = [];
  try {
    const files = fs.readdirSync(photosDir);
    const host = req.headers.host;             // e.g. "qr-director.vercel.app"
    photoUrls = files
      .filter(f => /\.(jpe?g|png|gif)$/i.test(f))
      .map(f => `https://${host}/photos/${f}`);
  } catch (e) {
    // no photos or folder missing → skip
  }

  // 2. Combine external + photo URLs
  const all = urlsData.externalUrls.concat(photoUrls);

  // 3. Pick one at random and redirect
  const choice = all[Math.floor(Math.random() * all.length)];
  res.writeHead(302, { Location: choice });
  res.end();
}
