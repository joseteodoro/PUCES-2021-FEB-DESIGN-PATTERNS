## Concurrency and paralellism

- concurrency vs paralellism

[concurrency]: https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/raw/main/images/concurrent-vs-parallel.jpeg "concurrency vs parallelism"

- Many CPUs due physic limitations

    - more than one CPU for each processor

    - hyper threads using same CPU

- concurrency and paralellism due many CPUs / HT

- deadlocks

[dead-lock]: https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/raw/main/images/deadlock-car.jpeg "cars deadlock"

- race conditions

[race-condition]: https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/raw/main/images/race-condition.png "race condition"

- shared state increase complexity and errors:

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
