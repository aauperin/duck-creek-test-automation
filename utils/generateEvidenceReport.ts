import * as fs from 'fs';
import * as path from 'path';

/**
 * Génère un rapport HTML avec toutes les preuves d'exécution des tests
 */
export function generateEvidenceReport() {
  const testResultsDir = 'test-results';
  const reportPath = 'test-results/evidence-report.html';

  if (!fs.existsSync(testResultsDir)) {
    console.log('❌ Aucun résultat de test trouvé. Exécutez d\'abord les tests.');
    return;
  }

  // Lire results.json si disponible
  let testResults: any = null;
  const resultsFile = path.join(testResultsDir, 'results.json');
  if (fs.existsSync(resultsFile)) {
    testResults = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));
  }

  // Scanner les dossiers de résultats
  const testDirs = fs.readdirSync(testResultsDir)
    .filter(item => {
      const itemPath = path.join(testResultsDir, item);
      return fs.statSync(itemPath).isDirectory();
    });

  let html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rapport de Preuves - Tests Duck Creek</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
    }
    .test-card {
      background: white;
      margin: 20px 0;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .test-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .test-title {
      font-size: 18px;
      font-weight: 600;
      color: #2c3e50;
    }
    .badge {
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-success {
      background: #27ae60;
      color: white;
    }
    .badge-failure {
      background: #e74c3c;
      color: white;
    }
    .badge-skipped {
      background: #95a5a6;
      color: white;
    }
    .evidence-section {
      margin: 15px 0;
    }
    .evidence-title {
      font-weight: 600;
      color: #34495e;
      margin-bottom: 10px;
    }
    .screenshot {
      max-width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin: 10px 0;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .screenshot:hover {
      transform: scale(1.02);
    }
    .video-container {
      margin: 10px 0;
    }
    video {
      max-width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .trace-link {
      display: inline-block;
      padding: 10px 20px;
      background: #3498db;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin: 10px 0;
    }
    .trace-link:hover {
      background: #2980b9;
    }
    .summary {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    .stat {
      text-align: center;
    }
    .stat-value {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 5px;
    }
    .stat-label {
      color: #7f8c8d;
      font-size: 14px;
    }
    .timestamp {
      color: #7f8c8d;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h1>📊 Rapport de Preuves d'Exécution - Duck Creek Tests</h1>
  <div class="timestamp">Généré le: ${new Date().toLocaleString('fr-FR')}</div>

  <div class="summary">
    <div class="stat">
      <div class="stat-value" style="color: #3498db;">${testDirs.length}</div>
      <div class="stat-label">Tests Exécutés</div>
    </div>
  </div>
`;

  // Pour chaque test
  testDirs.forEach(testDir => {
    const testPath = path.join(testResultsDir, testDir);
    const files = fs.readdirSync(testPath);

    // Trouver les fichiers de preuve
    const screenshots = files.filter(f => f.endsWith('.png'));
    const videos = files.filter(f => f.endsWith('.webm'));
    const traces = files.filter(f => f.endsWith('.zip') || f === 'trace');

    html += `
  <div class="test-card">
    <div class="test-header">
      <div class="test-title">${testDir}</div>
    </div>
`;

    // Screenshots
    if (screenshots.length > 0) {
      html += `
    <div class="evidence-section">
      <div class="evidence-title">📸 Screenshots (${screenshots.length})</div>
`;
      screenshots.forEach(screenshot => {
        const relativePath = path.join(testDir, screenshot);
        html += `      <img src="${relativePath}" alt="${screenshot}" class="screenshot" title="${screenshot}" />\n`;
      });
      html += `    </div>\n`;
    }

    // Vidéos
    if (videos.length > 0) {
      html += `
    <div class="evidence-section">
      <div class="evidence-title">🎥 Vidéo d'Exécution</div>
`;
      videos.forEach(video => {
        const relativePath = path.join(testDir, video);
        html += `
      <div class="video-container">
        <video controls>
          <source src="${relativePath}" type="video/webm">
          Votre navigateur ne supporte pas la vidéo.
        </video>
      </div>
`;
      });
      html += `    </div>\n`;
    }

    // Traces
    if (traces.length > 0) {
      html += `
    <div class="evidence-section">
      <div class="evidence-title">🔍 Traces Playwright</div>
      <p style="color: #7f8c8d; font-size: 14px;">
        Utilisez: <code>npx playwright show-trace ${path.join(testResultsDir, testDir, traces[0])}</code>
      </p>
    </div>
`;
    }

    html += `  </div>\n`;
  });

  html += `
  <div style="text-align: center; margin-top: 40px; color: #7f8c8d;">
    <p>🦆 Duck Creek Test Automation Framework</p>
  </div>
</body>
</html>
`;

  fs.writeFileSync(reportPath, html);
  console.log(`\n✅ Rapport de preuves généré: ${reportPath}`);
  console.log(`📂 Ouvrez le fichier dans votre navigateur pour voir toutes les preuves\n`);
}

// Exécution directe
if (require.main === module) {
  generateEvidenceReport();
}
