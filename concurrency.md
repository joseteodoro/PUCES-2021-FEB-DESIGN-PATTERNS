## Concurrency and paralellism

- Many CPUs due physic limitations


[cpu-transistors]: https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/raw/main/images/transistor-count.jpeg "transistors"


- more than one CPU for each processor: 2002, Intel released a Pentium 4 with hyper-threading, the first modern desktop processor to implement simultaneous multithreading (SMT).

- concurrency and paralellism due many CPUs / HT

- concurrency vs paralellism


[concurrency]: https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/raw/main/images/concurrent-vs-parallel.jpeg "concurrency vs parallelism"


- deadlocks


[dead-lock]: https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/raw/main/images/deadlock-car.jpeg "cars deadlock"


- race conditions


[race-condition]: https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/raw/main/images/race-condition.png "race condition"


- shared state increase complexity and errors

- immutable (less shared state) > mutable (more shared state)

- stateless (less shared state) > stateful (more shared state)

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
(read only singleton and prototype patterns)

- shared state (with writing) is complex
(mutable singleton and Object Pool patterns)

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

- imperative -> think linearly

- concurrent -> think reactively


[What's next](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/good-practices.md)
