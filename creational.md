## Creational Patterns

### Factory method

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#creational-patterns--factory-method)

### Abstract Factory

- same as above

#### Usage

- Use the Abstract Factory when your code needs to work with various
families of related products, but you don’t want it to depend on the
concrete classes of those products

- Consider implementing the Abstract Factory when you have a class with
a set of Factory Methods that blur its primary responsibility

#### Cons

- CONS: The code may become more complicated than it should be, since a lot of
new interfaces and classes are introduced along with the pattern

### Builder

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#creational-patterns--builder)

### Object Pool

- reuse what is scarce

- what about the queue size?

- what we do when there is no more resources?
Throw error or enqueue?

- db connection pool
    - startup 4 connections (ready)
    - +1 connection
    - max 10 connections

### Prototype

- reuse what is expensive to load

- what about concurrence?

- lets you copy existing objects without making your code dependent
on their classes (let's clone)

- you can clone objects without coupling to their concrete
classes

#### Usage

- use the Prototype pattern when your code shouldn’t depend on the
concrete classes of objects that you need to copy

#### Cons

- cloning complex objects that have circular references might be very tricky

- be careful about concurrence

#### Prototype Registry

- provides an easy way to access frequently-used prototypes.
It stores a set of pre-built objects that are ready to be copied.
The simplest prototype registry is a name → prototype hash map.
However, if you need better search criteria than a simple name,
you can build a much more robust version of the registry

### Dependency injection

- the caller class should depends on the abstraction, 
and we can change the behavior changing the setup

- we can use builders to change those dependencies

- we can use factories or config files to setup those classes

#### Cons

- what about fill what is really needed and keep optional what is nice to have?

### Singleton

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#creational-patterns--singleton)

