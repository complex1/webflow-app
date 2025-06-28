# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- OpenAPI documentation integration with API cards display
- Modal component with slot support for reusable UI
- API card component for displaying extracted API information
- Loading and error states for OpenAPI docs component
- Comprehensive button disabled states
- Dashboard form with OpenAPI configuration fields
- User management dummy controller APIs (registration, login, validation, user details)

### Changed
- Updated dashboard component to include OpenAPI documentation configuration
- Enhanced CSS variables with modal and tooltip z-index values
- Improved button component styling with better disabled state handling

### Fixed
- Corrected CSS formatting issues in dashboard component
- Fixed ExtractedAPI interface exports for better component integration

## [1.0.0] - 2024-01-01

### Added
- Initial project structure with Vue.js frontend
- Dashboard component with webflow management
- Webflow creation and editing functionality
- Tag-based filtering and search capabilities
- Import/export functionality for webflows
- Dark theme support with CSS variables
- Responsive design with mobile-friendly layouts
- Toast notification system
- Component library with reusable UI elements
- Session caching for improved performance

### Security
- Token-based authentication system
- Session management with automatic logout on token expiration

---

## Types of Changes

- `Added` for new features
- `Changed` for changes in existing functionality  
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes

## Release Process

1. Update version numbers in package.json
2. Update this CHANGELOG.md with new release notes
3. Create a new git tag with the version number
4. Push changes and tags to repository
5. Create release notes on GitHub/GitLab

## Links

- [Repository](https://github.com/your-org/webflow-app)
- [Issues](https://github.com/your-org/webflow-app/issues)
- [Releases](https://github.com/your-org/webflow-app/releases)
