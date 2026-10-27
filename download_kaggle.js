import https from 'https';
import fs from 'fs';
import path from 'path';

const TOKEN = 'KGAT_c02dba6ddd5dc6ac5d04d398e97ffd81';

export function downloadDataset(datasetRef, destPath) {
  return new Promise((resolve, reject) => {
    const url = `https://www.kaggle.com/api/v1/datasets/download/${datasetRef}`;
    console.log(`Starting download from ${url}...`);

    function makeRequest(currentUrl) {
      const u = new URL(currentUrl);
      const options = {
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'User-Agent': 'Mozilla/5.0'
        }
      };

      https.get(options, (res) => {
        // Handle redirect
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          console.log(`Redirecting to: ${res.headers.location.slice(0, 100)}...`);
          return makeRequest(res.headers.location);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Download failed with status ${res.statusCode}: ${res.statusMessage}`));
        }

        const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
        let downloadedBytes = 0;
        let lastReport = 0;

        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        const fileStream = fs.createWriteStream(destPath);

        res.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          const now = Date.now();
          if (now - lastReport > 2000) {
            const mb = (downloadedBytes / (1024 * 1024)).toFixed(1);
            const totalMb = totalBytes ? (totalBytes / (1024 * 1024)).toFixed(1) + ' MB' : 'unknown';
            console.log(`Downloaded: ${mb} MB / ${totalMb}`);
            lastReport = now;
          }
        });

        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Download complete: ${destPath} (${(downloadedBytes / (1024 * 1024)).toFixed(1)} MB)`);
          resolve(destPath);
        });

        fileStream.on('error', (err) => {
          fs.unlink(destPath, () => {});
          reject(err);
        });
      }).on('error', reject);
    }

    makeRequest(url);
  });
}

const args = process.argv.slice(2);
const dataset = args[0] || 'gpiosenka/tree-nuts-image-classification';
const dest = args[1] || `downloads/${dataset.replace('/', '_')}.zip`;

downloadDataset(dataset, dest)
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Download error:', err);
    process.exit(1);
  });
