# Carch.TS

Scalable Node.js Rest API using Express and TypeScript. It follows clean architecture principles and includes development tools like commands, stubs, database management (migrations, seeders), and testing utilities to maintain code quality and streamline the development process.

```
src
├── data
│   ├── api
│   │   ├── enums
│   │   │   ├── api-simple-sort-enum.ts
│   │   │   └── api-status-enum.ts
│   │   └── type
│   │       ├── api-meta.ts
│   │       ├── api-pagination.ts
│   │       ├── api-response-error.ts
│   │       ├── api-response.ts
│   │       └── api-simple-filter.ts
│   ├── data-sources
│   │   └── pg
│   │       └── pg-category-data-source.ts
│   └── interfaces
│       ├── database
│       │   ├── pg-database-config.ts
│       │   └── sql-database-wrapper.ts
│       └── data-sources
│           └── categories-data-sources.ts
├── domain
│   ├── interfaces
│   │   ├── repositories
│   │   │   └── categories-repository.ts
│   │   └── use-case
│   │       └── categories-use-case.ts
│   ├── models
│   │   └── categories.ts
│   ├── repositories
│   │   └── categories-repository.ts
│   └── use-case
│       └── categories-use-case.ts
├── errors
│   ├── exceptions
│   │   ├── conflict-unique-data.ts
│   │   ├── data-not-found.ts
│   │   ├── forbidden-exception.ts
│   │   ├── invalid-request.ts
│   │   ├── query-exception.ts
│   │   └── router-nor-implemented.ts
│   └── handler
│       ├── exceptions-render.ts
│       └── handle-query-exception.ts
├── infrastructure
│   ├── commands
│   │   ├── bundle.js
│   │   ├── generators
│   │   │   ├── make-model.js
│   │   │   ├── make-pg-migration.js
│   │   │   ├── make-pg-seeder.js
│   │   │   └── make-router.js
│   │   └── jobs
│   │       ├── migrate-refresh.ts
│   │       ├── migrate-rollback.ts
│   │       ├── migrate.ts
│   │       └── seeder.ts
│   ├── database
│   │   └── pg
│   │       ├── core
│   │       │   ├── blueprint.ts
│   │       │   └── migration.ts
│   │       ├── migrations
│   │       │   ├── 2024-08-23-173924-create-categories-table.ts
│   │       │   ├── 2024-08-23-173936-create-products-table.ts
│   │       │   └── 2024-08-25-081535-create-users-table.ts
│   │       └── seeder
│   │           ├── categories-seeder.ts
│   │           ├── database-seeder.ts
│   │           └── products-seeder.ts
│   └── stubs
│       ├── controller.ts.stub
│       ├── model.ts.stub
│       ├── pg-migration.ts.stub
│       ├── router.ts.stub
│       └── seeder.ts.stub
├── main.ts
├── presentation
│   ├── controllers
│   │   └── categories-controller.ts
│   ├── lang
│   │   ├── en.json
│   │   └── id.json
│   ├── middleware
│   │   ├── async-hendler.ts
│   │   ├── build-response-middleware.ts
│   │   ├── check-router-implemented.ts
│   │   ├── request-id-middleware.ts
│   │   └── validate-request.ts
│   └── routers
│       ├── all-router-bundle-v1.ts
│       └── categories-router.ts
├── server.ts
└── utils
    ├── build-pagination.ts
    ├── build-response-api.ts
    ├── generate-uuid-v4.ts
    └── string-checker.ts
```
