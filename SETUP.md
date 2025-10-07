# 🔧 Setup Instructions

## Prerequisites

- Node.js v16 or higher
- npm or yarn
- Linux/Mac/Windows

## Installation Steps

### 1. Install Node Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install chromium
```

### 3. Install Browser Dependencies (Linux Only)

If you're on Linux and get browser launch errors, install system dependencies:

```bash
# Option 1: Automatic (recommended)
sudo npx playwright install-deps

# Option 2: Manual
sudo apt-get install -y \
  libnspr4 \
  libnss3 \
  libatk1.0-0t64 \
  libatk-bridge2.0-0t64 \
  libcups2t64 \
  libatspi2.0-0t64 \
  libxdamage1 \
  libpango-1.0-0 \
  libasound2t64
```

**Note**: If you don't have sudo access, you can still:
- Run tests in CI/CD environments (GitHub Actions, etc.)
- Use Docker containers with pre-installed dependencies
- Work with the framework (generate scenarios, tests, etc.) without running them

### 4. Configure Environment

The `.env` file contains Duck Creek credentials:

```bash
DC_BASE_URL=https://your-instance.duckcreekondemand.com/policy/
DC_USERNAME=YOUR_USERNAME
DC_PASSWORD=YOUR_PASSWORD
```

**⚠️ Security Note**: Never commit `.env` to version control!

## Verification

### Test Installation

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Should output no errors
```

### Test Framework (without browser)

```bash
# Generate scenarios
npm run cli generate scenarios/example-requirements.json

# List scenarios
npm run cli list-scenarios

# Generate test data
npm run generate:testdata
```

### Test with Browser (requires system dependencies)

```bash
# Run headless
npm test

# Run with visible browser
npm run test:headed
```

## Troubleshooting

### Error: "Host system is missing dependencies"

**Solution**: Install browser dependencies (see step 3 above)

### Error: "Cannot find module"

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Permission denied"

**Solution**: Don't use sudo with npm install, only with playwright install-deps

### Tests fail with timeout

**Solutions**:
- Increase timeout in `playwright.config.ts`
- Check network connection to Duck Creek sandbox
- Verify credentials in `.env`

### TypeScript errors

**Solution**:
```bash
# Recompile
npx tsc --noEmit

# Should show no errors
```

## Docker Setup (Alternative)

If you can't install system dependencies, use Docker:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.56.0-jammy

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

CMD ["npm", "test"]
```

```bash
docker build -t duck-creek-tests .
docker run duck-creek-tests
```

## IDE Setup

### VS Code (Recommended)

Install extensions:
- Playwright Test for VSCode
- ESLint
- TypeScript

### Configuration

`.vscode/settings.json`:
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true
}
```

## Next Steps

After setup is complete:

1. ✅ Read [QUICKSTART.md](QUICKSTART.md)
2. ✅ Generate your first tests
3. ✅ Run tests
4. ✅ View reports

## Support

- Documentation: See [README.md](README.md)
- Issues: Check generated test files for TODO markers
- Playwright Docs: https://playwright.dev
