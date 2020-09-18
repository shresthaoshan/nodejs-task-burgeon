# Configurations

---

## Following environment variables are required

```js
CRYPTO=
SERIALIZER=
RESERIALIZER=
MONGO_USER=
MONGO_PASSWORD=
MONGO_DATABASE=
```

`CRYPTO` is required to hash the password of the user.
`SERIALIZER` is used to generate tokens.
`RESERIALIZER` is meant to be used to refresh the tokens, but, currently, is not in use.
`MONGO_USER`, `MONGO_PASSWORD`, `MONGO_DATABASE` are for database connection.