## Concurrency and paralellism

- concurrency vs paralellism

- Many CPUs due physic limitations

- concurrency and paralellism due many CPUs

- deadlocks and race conditions

- immutable > mutable

- stateless > stateful

- we dont know when concurrency tasks will run, but we
can ensure the order

```javascript
const populateUser = (user) => {
    return save(user)
        .then(() => createProfile(user))
        .then(() => setupHome(user))
        .then(() => sendEmailWithLogin(user))
}
```

- shared state (readonly) is great
(prototype)

- shared state (with writing) is complex
(singleton, Object Pool)

- hard to find bugs and reproduce errors

- different approachs to craft an imperative or
concurrency code

imperative way
```java
    public List<User> validUsers(List<User> users) {
        List<Users> valid = new LinkedList<>();
        for (User u : users) {
            if (u.isActive()) {
                valid.add(u);
            }
        }
        return valid;
    }
```

concurrent way
```java
    public Integer validUsers(List<User> users) {
        return users.stream()
            .filter(u -> u.isActive())
            .collect(Collectors.asList());
    }
```
