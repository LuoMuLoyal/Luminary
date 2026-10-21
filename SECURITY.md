# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue.

Send a private report to **luomuloyal@outlook.com** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- Affected version / commit

We aim to acknowledge reports within **48 hours** and deliver a fix or
mitigation within **7 days** for high-severity issues.

## Scope

This repository builds and serves the product site, the personal site, and the
desktop client. The following are in scope:

- Cross-site scripting (XSS) in rendered docs/markdown content
- Path traversal in the Rust layer (`apps/lumine/src-tauri/`)
- Credential or token leakage in client bundles or logs
- Insecure deep-link / protocol-handler parameter handling
- Supply-chain issues in build scripts or release artifacts
- Broken access control in the Tauri-side auth relay

The following are **out of scope** for this repository:

- Vulnerabilities in the Lucent backend or the Luminous mobile client — report
  those to their own repositories
- Self-hosted misconfiguration of the CDN unless it stems from a defect here
- Social engineering, physical attacks
- DoS without a demonstrated code-level vector

## Supported Versions

Only the current `main` branch is supported. There are no versioned maintenance
branches for the site and personal apps; the desktop client follows its own
release tags.

| Target | Supported |
| ------ | --------- |
| `main` | ✅        |
| older commits | ❌ |

## Automated Security Checks

This repository runs the following automated checks. They are documented here so
that a failing check is understood rather than silenced.

| Check | Workflow | What it covers | Blocking |
| ----- | -------- | -------------- | -------- |
| CodeQL | `.github/workflows/codeql.yml` | Semantic data-flow analysis for the TS apps and the Rust layer: injection, path traversal, unsafe deserialization, credential leakage | Reports to Security tab |
| OSV-Scanner | `.github/workflows/osv-scanner.yml` | Known vulnerabilities in `pnpm-lock.yaml` and `Cargo.lock`, including transitive dependencies | PR scan reports new findings only; full scan is report-only |
| Scorecard | `.github/workflows/scorecard.yml` | Supply-chain hygiene: branch protection, pinned actions, dependency updates, review requirements | Reports to Security tab |
| Dependabot | `.github/dependabot.yml` | Monthly grouped dependency updates for npm, cargo, and GitHub Actions | Opens PRs |

### Why scans are report-only at first

The dependency scans and CodeQL do not block merges yet. The reason is the same
for all three: a first-time scan surfaces the entire accumulated backlog, and a
check that fails on day one gets ignored rather than fixed. The intent is to
observe for a period, fix or consciously waive what is found, and only then turn
the check into a gate — following the same "observe then tighten" pattern used
for the architecture baseline in the sibling repositories.

## Security Features

- Static-only output: no Node server runs in production; the site and personal
  apps are statically exported, and the desktop client is a Tauri SPA
- Authentication and request relaying for the desktop client live in the Rust
  layer, not in the webview
- No secrets in the repository; the WeChat/desktop signing material is supplied
  through CI secrets
- Dependency updates are tracked by Dependabot with monthly grouped PRs
