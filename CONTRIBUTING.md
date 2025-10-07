# Contributing to Duck Creek Test Automation

First off, thanks for taking the time to contribute! 🎉

## How Can I Contribute?

### 🐛 Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node version, etc.)

### 💡 Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **Clear use case**
- **Expected behavior**
- **Why this would be useful**
- **Possible implementation approach**

### 🔧 Pull Requests

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/duck-creek-test-automation.git

# Install dependencies
npm install

# Install browsers
npx playwright install chromium

# Run tests
npm test
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Follow existing code style
- Add JSDoc comments for public methods
- Use meaningful variable names

### Tests

- Write tests for new features
- Ensure all tests pass before submitting PR
- Update documentation if needed

### Commits

- Use clear, descriptive commit messages
- Reference issues when applicable
- Keep commits focused and atomic

## Project Structure

```
pages/       - Page Object Models
tests/       - Playwright test files
utils/       - Utility scripts
scenarios/   - Test scenarios (JSON)
test-data/   - Test data files
```

## Areas to Contribute

### 🎯 High Priority

- [ ] Add page objects for Claims module
- [ ] Add page objects for Billing module
- [ ] Improve scenario generation logic
- [ ] Add more test data generators
- [ ] Enhance CLI with more commands

### 🧪 Testing

- [ ] Add unit tests for utilities
- [ ] Increase test coverage
- [ ] Add integration tests
- [ ] Performance testing

### 📝 Documentation

- [ ] Add video tutorials
- [ ] Create more examples
- [ ] Translate documentation
- [ ] Improve inline comments

### 🔧 Infrastructure

- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker support
- [ ] Test result dashboard
- [ ] Automated releases

## Testing Your Changes

Before submitting a PR:

```bash
# Verify TypeScript compilation
npx tsc --noEmit

# Run all tests
npm test

# Test scenario generation
npm run cli generate scenarios/example-requirements.json

# Generate test data
npm run generate:testdata
```

## Documentation

Update relevant documentation:

- README.md - For major features
- QUICKSTART.md - For user-facing changes
- ARCHITECTURE.md - For structural changes
- Inline comments - For code clarity

## Code Review Process

1. Automated checks must pass
2. At least one maintainer approval required
3. All conversations must be resolved
4. Documentation must be updated

## Community

- Be respectful and inclusive
- Help others in issues/discussions
- Share your use cases and feedback

## Questions?

Feel free to open an issue with the label `question`.

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

---

Thank you for contributing! 🙏
