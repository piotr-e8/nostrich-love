# Contributing Guide

Thank you for your interest in contributing to the Nostr Client Simulators! This guide will help you get started.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Code Review](#code-review)
- [Community](#community)

## Getting Started

### Ways to Contribute

You can contribute in many ways:

- **Code**: Add features, fix bugs, improve performance
- **Documentation**: Write guides, improve READMEs, add examples
- **Design**: Improve UI/UX, create mockups, add themes
- **Testing**: Report bugs, write tests, perform QA
- **Translation**: Localize content for different languages
- **Community**: Answer questions, help newcomers

### Before You Start

1. **Read this guide** completely
2. **Check existing issues** to avoid duplicates
3. **Join discussions** to align with maintainers
4. **Start small** - documentation fixes, small bugs

## Development Setup

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ or **yarn** or **pnpm**
- **Git**
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense

### Installation

1. **Fork the repository** on GitHub

2. **Clone your fork**:
```bash
git clone https://github.com/YOUR_USERNAME/nostr-beginner-guide.git
cd nostr-beginner-guide
```

3. **Install dependencies**:
```bash
npm install
```

4. **Set up pre-commit hooks**:
```bash
npx simple-git-hooks
```

5. **Start development server**:
```bash
npm run dev
```

6. **Open browser**: http://localhost:4321

### Development Workflow

1. **Create a branch**:
```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/bug-description
```

2. **Make changes** following [coding standards](#coding-standards)

3. **Test your changes**:
```bash
npm run test        # Run tests
npm run typecheck   # Type checking
npm run lint        # Linting
```

4. **Commit changes**:
```bash
git add .
git commit -m "feat: add new feature"
```

5. **Push to your fork**:
```bash
git push origin feature/my-feature
```

6. **Create Pull Request** on GitHub

## Project Structure

```
/
├── docs/                       # Documentation
│   └── simulators/            # Simulator docs (you are here!)
├── src/
│   ├── simulators/            # Simulator code
│   │   ├── shared/           # Shared foundation
│   │   ├── damus/            # Damus simulator
│   │   ├── amethyst/         # Amethyst simulator
│   │   └── ...               # Other simulators
│   ├── data/
│   │   └── mock/             # Mock data
│   ├── pages/                # Astro pages
│   └── components/           # Shared components
├── public/                    # Static assets
└── tests/                     # Test files
```

## How to Contribute

### Reporting Bugs

Before reporting:
1. Search existing issues
2. Try the latest version
3. Test in different browsers

When reporting:
1. Use bug report template
2. Include:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/GIFs
   - Browser/OS info
   - Console errors

### Suggesting Features

Before suggesting:
1. Check if feature exists in real client
2. Review existing feature requests
3. Consider scope and complexity

When suggesting:
1. Use feature request template
2. Explain use case
3. Describe expected behavior
4. Provide mockups if possible
5. Consider alternatives

### Adding New Simulators

See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed guide.

Quick checklist:
- [ ] Create directory structure
- [ ] Define configuration
- [ ] Implement screens
- [ ] Add theme CSS
- [ ] Create tests
- [ ] Write documentation
- [ ] Update gallery page

### Improving Existing Simulators

Areas for contribution:
- Missing features from real client
- UI/UX improvements
- Performance optimizations
- Bug fixes
- Accessibility improvements
- Better mock data
- Animations and transitions

### Documentation Contributions

Documentation is crucial! Help with:
- README improvements
- API documentation
- Usage examples
- Troubleshooting guides
- Feature explanations
- Translation

## Coding Standards

See [STYLE_GUIDE.md](./STYLE_GUIDE.md) for detailed standards.

Quick reference:

### TypeScript

```typescript
// Use strict types
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Prefer interfaces over types for objects
interface User {
  id: string;
  name: string;
}

// Use enums for fixed values
enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
```

### React

```typescript
// Functional components with named exports
export function MyComponent() {
  return <div>Hello</div>;
}

// Destructure props
interface Props {
  title: string;
  onClick: () => void;
}

export function Button({ title, onClick }: Props) {
  return <button onClick={onClick}>{title}</button>;
}

// Use hooks at top level
export function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Effect logic
  }, []);
  
  return <div>{count}</div>;
}
```

### CSS/Tailwind

```typescript
// Use Tailwind utilities
<div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow">

// Custom CSS for platform themes
// In damus.theme.css
.ios-simulator .button {
  @apply rounded-full bg-purple-500 text-white;
}
```

### File Organization

```typescript
// One component per file
// PascalCase for component files
// MyComponent.tsx

// Group related exports in index.ts
export { MyComponent } from './MyComponent';
export { useMyHook } from './useMyHook';
```

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- NoteCard.test.tsx

# Run in watch mode
npm run test -- --watch

# Run with coverage
npm run test -- --coverage
```

### Writing Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { SimulatorProvider } from '@/simulators/shared';
import { damusConfig } from '@/simulators/shared/configs';
import { NoteCard } from './NoteCard';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SimulatorProvider config={damusConfig}>
    {children}
  </SimulatorProvider>
);

describe('NoteCard', () => {
  it('renders note content', () => {
    render(<NoteCard item={mockItem} />, { wrapper });
    expect(screen.getByText(mockItem.note.content)).toBeInTheDocument();
  });
  
  it('calls onLike when clicked', () => {
    const onLike = jest.fn();
    render(<NoteCard item={mockItem} onLike={onLike} />, { wrapper });
    
    fireEvent.click(screen.getByLabelText('Like'));
    expect(onLike).toHaveBeenCalled();
  });
});
```

### Testing Guidelines

- Test component rendering
- Test user interactions
- Test state changes
- Mock external dependencies
- Aim for >80% coverage

## Documentation

### Code Documentation

```typescript
/**
 * Brief description of what the component does
 * 
 * @param props - Component props
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * <MyComponent title="Hello" onClick={handleClick} />
 * ```
 */
export function MyComponent(props: Props) {
  // Implementation
}
```

### README Updates

When adding features:
1. Update relevant README.md
2. Add examples
3. Update feature lists
4. Check links work

### Documentation Style

- Clear and concise
- Include examples
- Use proper markdown
- Add screenshots for UI changes
- Keep formatting consistent

## Pull Request Process

### Before Submitting

- [ ] Code follows style guide
- [ ] Tests pass
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Commit messages clear
- [ ] Branch up to date with main

### PR Title Format

```
type(scope): description

Examples:
feat(damus): add DM screen
fix(amethyst): correct theme colors
docs: update API reference
test: add NoteCard tests
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

### PR Description

Include:
1. **What**: What changed
2. **Why**: Why it changed
3. **How**: How it was implemented
4. **Testing**: How it was tested
5. **Screenshots**: If UI-related
6. **Issues**: Related issue numbers

Template:
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring

## Testing
How you tested the changes

## Screenshots
If applicable

## Checklist
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No linting errors
```

### After Submitting

1. **CI checks** must pass
2. **Maintainer review** (1-2 reviewers)
3. **Address feedback**
4. **Approval** and merge

## Code Review

### As a Reviewer

- Be constructive and kind
- Explain reasoning
- Suggest alternatives
- Approve when ready

### As an Author

- Respond to all comments
- Make requested changes
- Ask questions if unclear
- Be open to feedback

### Review Checklist

- [ ] Code works as intended
- [ ] Follows style guide
- [ ] Properly tested
- [ ] Documentation updated
- [ ] No security issues
- [ ] Performance considered

## Community

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, ideas
- **Pull Requests**: Code reviews
- **Nostr**: Follow project npub for updates

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints
- No harassment or discrimination

### Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## Questions?

- Check [FAQ.md](./FAQ.md)
- Review [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Ask in GitHub Discussions
- Join Nostr community chats

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to Nostr education!**

Your help makes it easier for people to learn about and adopt Nostr.
