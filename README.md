# Carch.TS

Scalable Node.js Rest API using Express and TypeScript. It follows clean architecture principles and includes development tools like commands, stubs, database management (migrations, seeders), and testing utilities to maintain code quality and streamline the development process.

```
src
├── domain
│   ├── interfaces
│   │   ├── repositories
│   │   │   └── categories-repository.ts
│   │   └── use-case
│   │       └── categories-use-case.ts
│   ├── models
│   │   ├── authentication.ts
│   │   └── categories.ts
│   ├── repositories
│   │   └── categories-repository.ts
│   └── use-case
│       └── categories-use-case.ts
├── errors
│   ├── exceptions
│   │   ├── conflict-unique-data.ts
│   │   ├── database-query-failed.ts
│   │   ├── data-not-found.ts
│   │   ├── forbidden.ts
│   │   ├── invalid-request.ts
│   │   ├── router-nor-implemented.ts
│   │   └── unauthenticated.ts
│   └── handler
│       ├── exceptions-render.ts
│       ├── wrap-async-handler.ts
│       └── wrap-repository-exception.ts
├── infrastructure
│   ├── data-sources
│   │   └── pg
│   │       └── pg-category-data-source.ts
│   ├── interfaces
│   │   ├── database
│   │   │   ├── pg-database-config.ts
│   │   │   └── sql-database-wrapper.ts
│   │   ├── data-sources
│   │   │   └── categories-data-sources.ts
│   │   └── security
│   │       ├── jwt-token.ts
│   │       └── password-hashing.ts
│   ├── security
│   │   ├── bcrypt-adapter.ts
│   │   └── jwt-adapter.ts
│   └── utils
│       ├── async-hendler.ts
│       ├── build-future-date.ts
│       ├── build-pagination.ts
│       ├── build-response-api.ts
│       ├── generate-uuid-v4.ts
│       └── string-checker.ts
├── main.ts
├── presentation
│   ├── controllers
│   │   └── categories-controller.ts
│   ├── enums
│   │   ├── api-simple-sort-enum.ts
│   │   └── api-status-enum.ts
│   ├── lang
│   │   ├── en.json
│   │   └── id.json
│   ├── middleware
│   │   ├── authentication-middleware.ts
│   │   ├── build-response-middleware.ts
│   │   ├── check-router-implemented-middleware.ts
│   │   ├── request-id-middleware.ts
│   │   └── validate-request-middleware.ts
│   ├── routers
│   │   ├── all-router-bundle-v1.ts
│   │   └── categories-router.ts
│   └── type
│       ├── api-meta.ts
│       ├── api-pagination.ts
│       ├── api-response-error.ts
│       ├── api-response.ts
│       └── api-simple-filter.ts
└── server.ts
```
