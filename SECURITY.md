# Security Guidelines

## 🔒 Credentials Management

### ✅ Current Security Status

All credentials and configuration are now properly secured:
- ✅ Credentials stored only in `.env` file (gitignored)
- ✅ No hardcoded credentials in source code
- ✅ No hardcoded URLs in tests (uses `process.env.DC_BASE_URL`)
- ✅ All tests use `process.env.DC_USERNAME` and `process.env.DC_PASSWORD`
- ✅ Scenario generator uses environment variable placeholders
- ✅ Playwright config uses `process.env.DC_BASE_URL`

### 🔍 How to Verify

Check for any hardcoded credentials:
```bash
grep -r "Orange\|YOUR_USERNAME" --include="*.ts" --include="*.js" --include="*.json" . | grep -v node_modules | grep -v ".git" | grep -v "process.env"
```

Should return empty (no results).

### 📋 .gitignore Configuration

The following files are excluded from Git:
```
.env
.env.local
.env.*.local
```

**Never commit these files!**

### 🛡️ Best Practices

1. **Environment Variables Only**
   - Always use `process.env.DC_USERNAME` and `process.env.DC_PASSWORD`
   - Never hardcode credentials, even for examples

2. **Validation**
   - All tests should validate credentials exist before running
   - Example:
   ```typescript
   if (!process.env.DC_USERNAME || !process.env.DC_PASSWORD) {
     throw new Error('Missing credentials in .env file');
   }
   ```

3. **Generated Code**
   - The scenario generator creates code with `process.env.*` references
   - Generated tests automatically include `dotenv.config()`

4. **Sharing Code**
   - Provide `.env.example` file with dummy values
   - Document required environment variables in README
   - Never share actual `.env` file

## 🚨 What to Do if Credentials Were Exposed

If credentials were accidentally committed to Git:

1. **Change the password immediately** in Duck Creek
2. **Update `.env` file** with new credentials
3. **Remove from Git history** (if already pushed):
   ```bash
   # Use git filter-branch or BFG Repo-Cleaner
   # See: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
   ```

## 📝 .env.example Template

Create a `.env.example` file for sharing:
```bash
# Duck Creek Credentials (replace with your actual credentials)
DC_BASE_URL=https://your-instance.duckcreekondemand.com/policy/
DC_USERNAME=YOUR_USERNAME_HERE
DC_PASSWORD="YOUR_PASSWORD_HERE"
```

## ✅ Pre-commit Checklist

Before committing code:
- [ ] No credentials in `.ts`, `.js`, or `.json` files
- [ ] `.env` file is gitignored
- [ ] All tests use `process.env.*` for credentials
- [ ] Run security check: `grep -r "Orange" . | grep -v node_modules | grep -v .git`

## 🔧 For Future Development

### Adding New Tests

When creating new tests:
```typescript
import * as dotenv from 'dotenv';
dotenv.config();

// ✅ Correct
await loginPage.login(process.env.DC_USERNAME, process.env.DC_PASSWORD);

// ❌ Never do this
await loginPage.login('YOUR_USERNAME', 'YOUR_PASSWORD');
```

### Modifying Scenario Generator

If you modify `utils/scenarioGenerator.ts`:
- Use placeholder strings: `'${process.env.DC_USERNAME}'`
- Generate code that references environment variables
- Include `import * as dotenv from 'dotenv'` and `dotenv.config()` in generated tests

### Testing Locally

Always use your `.env` file:
```bash
# Create .env if it doesn't exist
cp .env.example .env

# Edit with your credentials
nano .env

# Run tests
npm test
```

## 📊 Security Audit Log

| Date | Issue | Action Taken | Status |
|------|-------|--------------|--------|
| 2025-10-07 | Hardcoded credentials in 30+ test files | Regenerated all tests with env vars | ✅ Fixed |
| 2025-10-07 | Credentials in scenario JSON files | Deleted scenario JSON files | ✅ Fixed |
| 2025-10-07 | Scenario generator hardcoding credentials | Modified to use env var placeholders | ✅ Fixed |
| 2025-10-07 | Fallback credentials in login.spec.ts | Replaced with validation error | ✅ Fixed |
