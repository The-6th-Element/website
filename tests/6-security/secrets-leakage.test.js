import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('FEATURE-75 (SEC-01): Secret Leakage & Bundle Integrity Scanner', () => {
  const rootDir = process.cwd();
  const srcDir = path.resolve(rootDir, 'src');

  // Helper to recursively collect files
  function getFiles(dir, extensions = ['.js', '.jsx', '.json', '.html']) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.resolve(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(fullPath, extensions));
      } else {
        const ext = path.extname(file);
        if (extensions.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
    return results;
  }

  describe('1. Static Code Secret Scans', () => {
    it('ensures no high-risk private tokens, AWS keys, or private keys are hardcoded in src/', () => {
      const files = getFiles(srcDir);
      expect(files.length).toBeGreaterThan(0);

      const secretPatterns = [
        { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
        { name: 'GitHub Personal Access Token', regex: /ghp_[a-zA-Z0-9]{36}/ },
        { name: 'Private Key PEM Block', regex: /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/ },
        { name: 'Supabase Service Role JWT', regex: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+service_role/ }
      ];

      for (const filePath of files) {
        const content = fs.readFileSync(filePath, 'utf-8');
        for (const pattern of secretPatterns) {
          const match = content.match(pattern.regex);
          if (match) {
            const relPath = path.relative(rootDir, filePath);
            throw new Error(`[Security Alert] Found ${pattern.name} in file: ${relPath}`);
          }
        }
      }
    });
  });

  describe('2. Git Ignore Security Boundary', () => {
    it('verifies .gitignore strictly blocks environment secrets and internal docs', () => {
      const gitignorePath = path.resolve(rootDir, '.gitignore');
      expect(fs.existsSync(gitignorePath)).toBe(true);

      const content = fs.readFileSync(gitignorePath, 'utf-8');
      expect(content).toMatch(/\.env/);
      expect(content).toMatch(/\.env\.local/);
      expect(content).toMatch(/docs\/backlog\.html/);
    });
  });
});
