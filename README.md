# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
```sh
docker run --name postgres-demo -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=transaction-demo -p 5432:5432 -d postgres
```
3. Run `npm start` command


# References

- [TypeORM transactions](https://orkhan.gitbook.io/typeorm/docs/transactions)
- [TypeORM select-query-builder#set-locking](https://orkhan.gitbook.io/typeorm/docs/select-query-builder#set-locking)
- [Postgres transaction](https://www.postgresql.org/docs/current/sql-set-transaction.html)
- [Postgres select for update](https://www.postgresql.org/docs/current/sql-select.html)
- [Postgres table lock](https://www.postgresql.org/docs/current/sql-lock.html)

