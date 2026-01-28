# 🥒 Playwright TS BDD Automation Framework (POC)

This repository contains a professional **Proof of Concept (POC)** for an automated testing framework using **Playwright**, **TypeScript**, and **Gherkin**. It leverages `playwright-bdd` to bridge the gap between business requirements and technical execution.

---

## 📂 Project Structure

The project follows a Behavior-Driven Development (BDD) architecture, ensuring a clean separation between features, steps, and technical utilities:

```text
pw_ts_bdd/
├── src/
│   ├── features/             # Gherkin .feature files (Business logic)
│   │   ├── api/              # API specific scenarios
│   │   └── ui/               # UI specific scenarios
│   ├── steps/                # Step Definitions (Glue code)
│   │   ├── api/              # API steps logic
│   │   ├── db/               # Database validation steps
│   │   └── ui/               # UI interaction steps
│   ├── fixtures/             # Custom fixtures and test extensions
│   ├── resources/
│   │   ├── pages/            # Page Object Model (POM) classes
│   │   ├── mocks/            # Mock data for API interception
│   │   ├── schemas/          # Joi validation schemas
│   │   ├── services/         # Service-layer definitions
│   │   ├── temp/             # Cache storage (e.g., api_token_cache.json)
│   │   └── visual_baselines/ # Baseline images for visual regression
│   └── utils/                # Core technical utilities
│       ├── apiClient.ts        # API client wrapper
│       ├── apiSessionManager.ts # Session persistence handler
│       ├── commands.ts         # File system and global helpers
│       ├── mongoClient.ts      # MongoDB connection handler
│       └── postgresClient.ts   # PostgreSQL connection handler
├── .features-gen/          # Auto-generated Playwright tests (Git ignored)
├── .env                    # Global environment variables
├── .env.dev                # Environment-specific variables (dev)
├── playwright.config.ts    # Global Playwright & BDD configuration
└── package.json            # Scripts and dependencies
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js: Version 18.x or higher.
- VS Code Extension: Cucumber (Gherkin) for syntax highlighting.

### Setup

Clone the repository

```text
Bash
git clone
cd pw_ts_bdd
**** Install dependencies
npm install
npx playwright install --with-deps
```

## 🚀 Running Tests

This framework requires generating Playwright tests from Gherkin files using bddgen.

```text
Command,Description
npm run debug:deep,Generates tests and runs a single worker in PWDEBUG mode (@debug).
npm run debug,Generates tests and runs Chrome execution (@debugUi).
npm run apiDebug,Runs specific API tests with the @onlyThis tag.
npm run watch,Runs bddgen and Playwright UI mode in watch mode (Nodemon).
npm run report,Serves the static Cucumber HTML report.
-- allure
npm run allure:clean	Removes previous Allure results and reports
npm run allure:serve	Generates and serves the Allure Report locally

```

## ⚙️ Environment Management

The framework uses a dual-layer .env strategy:

- Global (.env): Technical settings like PAUSE_APP_ON_DEBUG, TEST_ENVIRONMENT, and API_DEBUG and DB Connection Strings (Mongo/Postgres)..

- Environment-Specific (.env.dev): Infrastructure data including URLs

## 🐳 Docker Integration

🐳 Dockerización
Para garantizar un entorno consistente, puedes ejecutar el framework en un contenedor:

Dockerfile:

```text
Dockerfile

FROM mcr.microsoft.com/playwright:v1.57.0-focal

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "playwright", "test"]
```

### Comandos Docker:

Bash

- docker build -t playwright-poc .
- docker run --env-file .env playwright-poc

## ☸️ CI/CD: GitHub Actions & Kubernetes (K8s)

Pipeline de GitHub Actions (.github/workflows/main.yml)

```text
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - name: Install dependencies
        run: npm install
      - name: Run Playwright tests
        run: npx playwright test
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Kubernetes Scalability

Sharding: Distribute .feature files across multiple pods using Playwright's native sharding.
Secrets: DB credentials from .env are injected via K8s Secrets.
Persistence: Shared session tokens allow multiple pods to bypass login steps.
