# Troubleshooting Guide

Ce document liste les problèmes rencontrés et leurs solutions lors de la mise en place du framework.

## ✅ Problèmes Résolus

### 🔴 CRITIQUE: Credentials hardcodés dans le code source
**Symptôme**: Username et password présents en clair dans les fichiers TypeScript et JSON
**Cause**: Le générateur de scénarios injectait directement les credentials dans le code généré
**Risque**: Exposition des credentials sur GitHub/Git
**Solution**:
1. Modifier `utils/scenarioGenerator.ts` pour utiliser des placeholders `${process.env.DC_USERNAME}`
2. Générer le code avec `process.env.DC_USERNAME` et `process.env.DC_PASSWORD`
3. Ajouter `dotenv.config()` dans tous les tests générés
4. Supprimer et régénérer tous les tests existants
5. Supprimer les JSON de scénarios qui contenaient les credentials

**Fichiers modifiés**:
- `utils/scenarioGenerator.ts` - Générateur corrigé
- `tests/login.spec.ts` - Ajout de validation des credentials
- `tests/req-*.spec.ts` - Tous régénérés sans credentials hardcodés
- `scenarios/req-*-scenarios.json` - Supprimés (non nécessaires)

**Commande de régénération**:
```bash
rm tests/req-*.spec.ts
npm run cli generate scenarios/example-requirements.json
```

### 1. Login échoue - Password incorrect
**Symptôme**: Le test passe mais l'URL reste sur la page de login
**Cause**: Le caractère `#` dans le password était interprété comme un commentaire dans `.env`
**Solution**:
```bash
# ❌ Incorrect
DC_PASSWORD=YOUR_PASSWORD

# ✅ Correct
DC_PASSWORD="YOUR_PASSWORD"
```
**Fichier modifié**: `.env`

### 2. Test passe même si le login échoue
**Symptôme**: Test marqué comme "passed" alors que la fonctionnalité ne marche pas
**Cause**: Pas d'assertions - seulement des `console.log()`
**Solution**: Ajouter des assertions avec `expect()`:
```typescript
// ❌ Pas d'assertion
const currentUrl = page.url();
console.log('Current URL:', currentUrl);

// ✅ Avec assertion
const currentUrl = page.url();
expect(currentUrl).not.toBe('https://your-instance.duckcreekondemand.com/policy/');
expect(currentUrl).toContain('defaultViewmodel');
```
**Fichier modifié**: `tests/login.spec.ts`

### 3. Timeout sur le bouton de login
**Symptôme**: `TimeoutError: locator.click: Timeout 15000ms exceeded`
**Cause**: La page Duck Creek n'a pas de bouton submit visible - c'est un formulaire qui se soumet via JavaScript
**Solution**: Utiliser `Enter` sur le champ password au lieu de cliquer un bouton
```typescript
// ❌ Incorrect - bouton n'existe pas
await this.loginButton.click();

// ✅ Correct - soumettre avec Enter
await this.passwordInput.press('Enter');
```
**Fichier modifié**: `pages/LoginPage.ts`

### 4. Browser fails to launch - Missing X server
**Symptôme**: `Missing X server or $DISPLAY` error
**Cause**: Scripts tentaient de lancer un navigateur en mode "headed" (avec GUI) sur un serveur SSH sans interface graphique
**Solution**: Passer en mode `headless: true` dans tous les scripts
```typescript
// ❌ Incorrect - nécessite GUI
const browser = await chromium.launch({ headless: false });

// ✅ Correct - fonctionne sans GUI
const browser = await chromium.launch({ headless: true });
```
**Fichiers modifiés**:
- `utils/pageExplorer.ts`
- `utils/inspectLoginPage.ts`

### 5. Sélecteurs incorrects pour les champs de login
**Symptôme**: Les champs ne sont pas trouvés ou multiples éléments correspondent
**Cause**: Sélecteurs génériques qui ne correspondent pas à la structure réelle de Duck Creek
**Solution**: Explorer la page avec `pageExplorer` et utiliser les IDs exacts:
```typescript
// ❌ Sélecteurs génériques
this.usernameInput = page.locator('input[type="text"]').first();
this.passwordInput = page.locator('input[type="password"]').first();

// ✅ IDs spécifiques Duck Creek
this.usernameInput = page.locator('#username-inputEl');
this.passwordInput = page.locator('#password-inputEl');
```
**Fichier modifié**: `pages/LoginPage.ts`

## 🔧 Outils de Debug Créés

### Script d'inspection de page
`utils/inspectLoginPage.ts` - Inspecte une page et liste tous les inputs/boutons/formulaires avec leurs attributs

**Usage**:
```bash
npx ts-node utils/inspectLoginPage.ts
```
**Génère**:
- `screenshots/login-page-debug.png`
- `reports/login-page-html.html`
- Liste console de tous les éléments avec suggestions de sélecteurs

### Page explorer amélioré
`utils/pageExplorer.ts` - Peut maintenant explorer après login

**Usage**:
```bash
# Explorer la page de login
npm run explore

# Explorer après login
npx ts-node utils/pageExplorer.ts home
```
**Génère**:
- `reports/login-page-structure.json` ou `reports/home-page-structure.json`
- `screenshots/home-page.png`

### Générateur de rapport de preuves
`utils/generateEvidenceReport.ts` - Compile tous les screenshots/vidéos/traces dans un seul HTML

**Usage**:
```bash
npm run report:evidence
```
**Génère**: `test-results/evidence-report.html`

## 📊 Configuration Mise à Jour

### playwright.config.ts
Changements pour capturer toutes les preuves:
```typescript
use: {
  trace: 'on',        // Au lieu de 'on-first-retry'
  screenshot: 'on',   // Au lieu de 'only-on-failure'
  video: 'on',        // Au lieu de 'retain-on-failure'
}
```

### package.json
Nouvelle commande ajoutée:
```json
"report:evidence": "ts-node utils/generateEvidenceReport.ts"
```

## 📝 Sélecteurs Duck Creek Validés

### Page de Login
- URL: `https://your-instance.duckcreekondemand.com/policy/`
- Username: `#username-inputEl` (name="_username")
- Password: `#password-inputEl` (name="_password")
- Submit: Pas de bouton - utiliser `passwordField.press('Enter')`
- Redirection réussie: `*/defaultViewmodel`

### Page d'Accueil (après login)
- URL: `https://your-instance.duckcreekondemand.com/policy/me/express/defaultViewmodel`
- Recherche: `#dfcb_0` (placeholder: "Search for Policies, Quotes, Bill Accounts or Claims")
- 54 inputs trouvés
- 9 boutons trouvés
- 23+ liens de navigation

## 🚀 Workflow de Debug Recommandé

Pour trouver les sélecteurs de nouvelles pages:

1. **Explorer la page**:
   ```bash
   npx ts-node utils/pageExplorer.ts home
   ```

2. **Analyser les résultats**:
   - Ouvrir `reports/home-page-structure.json`
   - Copier `screenshots/home-page.png` sur Windows pour visualiser

3. **Identifier les sélecteurs uniques**:
   - Chercher des IDs uniques
   - Préférer les `id` aux `class` (plus stables)
   - Éviter les sélecteurs génériques comme `input[type="text"]`

4. **Créer/mettre à jour le Page Object**:
   ```typescript
   this.myField = page.locator('#specific-id');
   ```

5. **Tester avec un seul test**:
   ```bash
   npx playwright test tests/my-test.spec.ts --workers=1
   ```

6. **Vérifier les preuves en cas d'échec**:
   - Screenshot: `test-results/.../test-failed-1.png`
   - Vidéo: `test-results/.../video.webm`
   - Trace: `npx playwright show-trace test-results/.../trace.zip`

## 📚 Documentation Mise à Jour

- ✅ `CLAUDE.md` - Guide complet pour futures instances Claude
- ✅ `README.md` - Instructions de configuration corrigées
- ✅ `.env` - Password correctement quoté
- ✅ `pages/LoginPage.ts` - Sélecteurs corrects et méthode de soumission
- ✅ `tests/login.spec.ts` - Assertions ajoutées
- ✅ `utils/pageExplorer.ts` - Mode headless + exploration après login
- ✅ `playwright.config.ts` - Capture complète des preuves
