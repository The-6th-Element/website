#!/usr/bin/env node
// scripts/traceability-reporter.js
// Defect & Traceability Reporter for The Sixth Element (Feature: BK-14 & BK-29)
// Cross-references test failures against git commits and FEATURE_BACKLOG.md

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const REPORT_PATH = path.resolve(process.cwd(), 'test-report.json');
const BACKLOG_PATH = path.resolve(process.cwd(), 'FEATURE_BACKLOG.md');

function runCmd(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

// 1. Parse FEATURE_BACKLOG.md to extract known backlog items
function parseBacklog() {
  const map = new Map();
  if (!fs.existsSync(BACKLOG_PATH)) return map;

  const content = fs.readFileSync(BACKLOG_PATH, 'utf-8');
  const lines = content.split('\n');

  for (const line of lines) {
    // Matches markdown table rows like: | **BK-29** | **Title** | Desc | ... |
    const match = line.match(/\|\s*\*\*([A-Z]+-\d+)\*\*\s*\|\s*\*\*([^*]+)\*\*\s*\|\s*([^|]+)\|/);
    if (match) {
      const id = match[1].trim();
      const title = match[2].trim();
      const desc = match[3].trim();
      map.set(id, { id, title, desc });
    }
  }
  return map;
}

// 2. Extract git commit metadata
function getGitMeta() {
  const branch = runCmd('git rev-parse --abbrev-ref HEAD') || 'unknown-branch';
  const hash = runCmd('git rev-parse --short HEAD') || 'unknown-commit';
  const commitMsg = runCmd('git log -1 --pretty=format:"%s"') || '';
  const author = runCmd('git log -1 --pretty=format:"%an"') || '';

  // Extract Backlog ID from commit message e.g. "feat(BK-29): ..."
  const commitIdMatch = commitMsg.match(/\b([A-Z]+-\d+)\b/);
  const commitBacklogId = commitIdMatch ? commitIdMatch[1] : null;

  return { branch, hash, commitMsg, author, commitBacklogId };
}

// 3. Process test results and generate defect report
function main() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.log('⚠️ [Traceability] No test-report.json found. Skipping traceability analysis.');
    process.exit(0);
  }

  const raw = fs.readFileSync(REPORT_PATH, 'utf-8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error('⚠️ [Traceability] Failed to parse test-report.json:', err.message);
    process.exit(0);
  }

  const backlogMap = parseBacklog();
  const gitMeta = getGitMeta();

  const failedTests = [];
  for (const fileResult of data.testResults || []) {
    for (const test of fileResult.assertionResults || []) {
      if (test.status === 'failed') {
        const fullTitle = `${(test.ancestorTitles || []).join(' > ')} > ${test.title}`;
        // Extract backlog ID from test name
        const idMatch = fullTitle.match(/\b([A-Z]+-\d+)\b/);
        const backlogId = idMatch ? idMatch[1] : gitMeta.commitBacklogId;

        failedTests.push({
          title: fullTitle,
          backlogId: backlogId || 'UNASSIGNED',
          file: fileResult.name ? path.basename(fileResult.name) : 'unknown',
          messages: test.failureMessages || [],
        });
      }
    }
  }

  // If no tests failed, output clean success
  if (failedTests.length === 0) {
    console.log(`\n✅ [BK-14 Traceability] All ${data.numTotalTests || 0} regression tests passed!`);
    console.log(`🛡️ Branch: ${gitMeta.branch} (${gitMeta.hash}) · Live deployment gate cleared.\n`);

    const summaryMd = `### 🟢 BK-14 Automated Regression Suite: PASSED
- **Total Tests Verified**: ${data.numTotalTests || 0}
- **Branch**: \`${gitMeta.branch}\` (\`${gitMeta.hash}\`)
- **Commit**: \`${gitMeta.commitMsg}\` by ${gitMeta.author}
- **Status**: Deployment gate cleared. Zero regressions detected across the website.
`;
    if (process.env.GITHUB_STEP_SUMMARY) {
      try {
        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summaryMd, 'utf-8');
      } catch {}
    }
    process.exit(0);
  }

  // If tests failed, build high-visibility markdown defect & traceability report
  let reportMd = `# 🚨 BK-14 Quality Gate: Regression Failure Detected

> **DEPLOYMENT ABORTED**: One or more automated regression tests failed. Production deployment on \`${gitMeta.branch}\` has been blocked to protect live site stability.

---

### 🛡️ Defect Traceability Summary

| Attribute | Details |
|---|---|
| **Triggering Commit** | \`${gitMeta.hash}\` — *${gitMeta.commitMsg}* |
| **Author** | ${gitMeta.author} |
| **Active Branch** | \`${gitMeta.branch}\` |
| **Suspected Originating Backlog ID** | **${failedTests[0]?.backlogId || gitMeta.commitBacklogId || 'UNASSIGNED'}** |
| **Total Failures** | **${failedTests.length}** failing test(s) |

---

### 📋 Failed Tests & Backlog Feature Mapping

`;

  for (let i = 0; i < failedTests.length; i++) {
    const f = failedTests[i];
    const item = backlogMap.get(f.backlogId);
    reportMd += `#### ${i + 1}. \`${f.title}\`\n`;
    reportMd += `- **Test File**: \`${f.file}\`\n`;
    reportMd += `- **Linked Backlog Item**: **${f.backlogId}** ${item ? `— *${item.title}*` : '*(No exact entry in FEATURE_BACKLOG.md)*'}\n`;
    if (item) {
      reportMd += `- **Feature Scope**: ${item.desc}\n`;
    }
    if (f.messages.length > 0) {
      reportMd += `\n\`\`\`text\n${f.messages.join('\n').slice(0, 1000)}\n\`\`\`\n\n`;
    }
  }

  reportMd += `---
### 🛠️ Next Steps for Resolution:
1. Review the assertion failure above in conjunction with the linked Backlog Item.
2. If this is a regression, repair the broken code in **\`dev\`**.
3. If this was an intentional behavioral update, update the corresponding test in **\`tests/\`** to reflect the new feature requirements.
4. Verify locally using \`npm run test:run\` before re-attempting deployment.
`;

  // Output to console
  console.error('\n' + '='.repeat(70));
  console.error('🚨 DEPLOYMENT BLOCKED — DEFECT TRACEABILITY REPORT');
  console.error('='.repeat(70));
  console.error(reportMd);
  console.error('='.repeat(70) + '\n');

  // Write to GitHub Step Summary if running in GitHub Actions
  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, reportMd, 'utf-8');
    } catch {}
  }

  // Exit with failure code
  process.exit(1);
}

main();
