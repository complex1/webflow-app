<template>
  <section id="trust" class="trust container" aria-label="Project">
    <p class="trust-line">
      Open source under MIT—inspect the code, self-host, or use our hosted app when you are ready.
    </p>
    <div class="trust-links">
      <a
        href="https://github.com/complex1/webflow-app"
        target="_blank"
        rel="noopener noreferrer"
        class="trust-link"
      >
        GitHub
      </a>
      <span class="sep" aria-hidden="true">·</span>
      <router-link to="/docs-open" class="trust-link">Documentation</router-link>
    </div>
  </section>
</template>

<style scoped>
.trust {
  padding: 24px 20px 40px;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

.trust-line {
  margin: 0;
  font-size: var(--text-md);
  color: var(--text-muted);
  line-height: 1.6;
}

.trust-links {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.trust-link {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  color: var(--accent-blue);
  font-weight: 600;
  font-size: var(--text-md);
  text-decoration: none;
  border-radius: var(--radius-md);
}

.trust-link:hover {
  text-decoration: underline;
}

.trust-link:focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}

.sep {
  color: var(--text-muted);
}
</style>
