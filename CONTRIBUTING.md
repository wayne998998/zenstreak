# Contributing to ZenStreak

First off, thank you for considering contributing to ZenStreak! It's people like you that make ZenStreak such a great tool for building mindfulness habits.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the JavaScript/React styleguides
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript Styleguide

* Use ES6+ features where appropriate
* Prefer const over let, and never use var
* Use meaningful variable names
* Add comments for complex logic
* Keep functions small and focused

### React Styleguide

* Use functional components with hooks
* Keep components small and focused
* Use meaningful component names
* Organize components logically
* Use prop-types or TypeScript for type checking

### CSS/Tailwind Styleguide

* Use Tailwind utility classes where possible
* Create custom CSS only when necessary
* Keep styles organized and maintainable
* Use semantic class names when creating custom styles

## Project Structure

```
src/
├── components/     # React components
├── data/          # Static data and constants
├── hooks/         # Custom React hooks
├── services/      # API and external services
└── utils/         # Utility functions
```

## Setting Up Development Environment

1. Clone your fork
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Make your changes
5. Run tests: `npm test` (if available)
6. Run linter: `npm run lint`

## Questions?

Feel free to open an issue with your question or reach out to the maintainers directly.

Thank you for contributing! 🧘