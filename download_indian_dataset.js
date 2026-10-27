import https from 'https';
import fs from 'fs';
import path from 'path';

// Read Kaggle credentials from C:\Users\bashe\.kaggle\kaggle.json or fallback
let USERNAME = 'ahmedmbasheer';
let KEY = '814a3a17f580667cf49b88f0fbbecd5b';

try {
  const kPath = 'C:\\Users\\bashe\\.kaggle\\kaggle.json';
  if (fs.existsSync(kPath)) {
    const k = JSON.parse(fs.readFileSync(kPath, 'utf8'));
    if (k.username && k.key) {
      USERNAME = k.username;
      KEY = k.key;
    }
  }
} catch (e) {}

const AUTH_HEADER = 'Basic ' + Buffer.from(`${USERNAME}:${KEY}`).toString('base64');

export function downloadDataset(datasetRef, destPath) {
  return new Promise((resolve, reject) => {
    const url = `https://www.kaggle.com/api/v1/datasets/download/${datasetRef}`;
    console.log(`📡 Connecting to Kaggle API for ${datasetRef}...`);

    function makeRequest(currentUrl, isRedirect = false) {
      const u = new URL(currentUrl);
      const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      };

      // Kaggle API requires Basic Auth, but signed AWS/GCS redirect URLs will fail if Authorization header is sent
      if (!isRedirect && u.hostname.includes('kaggle.com')) {
        headers['Authorization'] = AUTH_HEADER;
      }

      const options = {
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers: headers
      };

      https.get(options, (res) => {
        // Handle redirect to Cloud Storage (302/303)
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          console.log(`↪ Redirecting to secure download mirror...`);
          return makeRequest(res.headers.location, true);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Download failed with HTTP ${res.statusCode}: ${res.statusMessage}`));
        }

        const totalBytes = parseInt(res.headers['content-length'] || '0', 10);
        let downloadedBytes = 0;
        let lastReport = 0;

        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        const fileStream = fs.createWriteStream(destPath);

        res.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          const now = Date.now();
          if (now - lastReport > 3000) {
            const mb = (downloadedBytes / (1024 * 1024)).toFixed(1);
            const totalMb = totalBytes ? (totalBytes / (1024 * 1024)).toFixed(1) + ' MB' : 'unknown';
            const pct = totalBytes ? ((downloadedBytes / totalBytes) * 100).toFixed(1) + '%' : '';
            console.log(`⬇ Progress: ${mb} MB / ${totalMb} (${pct})`);
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

const datasetRef = 'warcoder/indian-medicinal-leaf-image-dataset';
const destPath = 'C:\\Users\\bashe\\.gemini\\antigravity\\scratch\\Mead-leaf\\downloads\\indian_medicinal_leaf.zip';

downloadDataset(datasetRef, destPath)
  .then(() => {
    console.log('🎉 Indian Medicinal Leaf Image Dataset downloaded successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Download failed:', err.message);
    process.exit(1);
  });
