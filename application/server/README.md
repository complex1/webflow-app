# Webflow App Server-Side Rendered Landing Page

This repository contains the implementation of a server-side rendered landing page for the Webflow app, while maintaining the rest of the application as client-side rendered.

## Features

- **Server-Side Rendered Landing Page**: Faster initial load times and better SEO
- **Hybrid Rendering Approach**: SSR landing page + CSR application
- **Responsive Design**: Optimized for all device sizes
- **Performance Optimizations**: Minimized resources, preloading, and deferred loading
- **SEO Optimizations**: Meta tags, sitemap.xml, robots.txt, and semantic HTML

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/webflow-app.git
   cd webflow-app/application/server
   ```

2. Install dependencies
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. The server will be running at http://localhost:3000

## Project Structure

```
application/
  server/                     # Server application
    src/
      controllers/            # Request handlers
        landing.controller.ts # Landing page controller
      routes/
        landing.routes.ts     # Landing page routes
      views/
        landing.ejs           # Landing page template
      public/                 # Static assets
        css/
        js/
        images/
      middleware/             # Custom middleware
    scripts/                  # Utility scripts
    docs/                     # Documentation
  ui/                         # Client application (Vue.js)
```

## Development

### Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot reload
- `npm run build`: Build the application for production
- `npm run optimize-images`: Optimize SVG and other images
- `npm run test-endpoints`: Test server endpoints

### Adding New Components to the Landing Page

1. Modify the EJS template at `src/views/landing.ejs`
2. Add any necessary styles to `src/public/css/landing.css`
3. Add any necessary JavaScript to `src/public/js/landing.js`
4. Add any necessary images to `src/public/images/`

## SEO Optimization

The landing page includes various SEO optimizations:

1. Server-side rendering for faster initial page load
2. Meta tags (description, keywords)
3. OpenGraph and Twitter card tags
4. robots.txt file
5. sitemap.xml file

## Performance Considerations

1. CSS is preloaded for critical rendering path optimization
2. JavaScript is deferred to not block rendering
3. SVG images are optimized for size

## Testing

Run `npm run test-endpoints` to test that all endpoints are working correctly.

## Documentation

For detailed information about the implementation, see the [SSR Landing Page Documentation](docs/ssr-landing-page.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.
