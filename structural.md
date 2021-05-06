## Structural Patterns

- Strategies to couple / glue your components

### Adapter

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#behavioral-patterns--template-method)

### Bridge

- Specification Program Interface e Application Program Interface

- lets you split a large class or a set of closely related classes into
  two separate hierarchies—abstraction and implementation
  which can be developed independently of each other

#### Usage

- Use the Bridge pattern when you want to divide and organize a monolithic class that has several variants of some function- ality (for example, if the class can work with various database servers)

- Use the Bridge if you need to be able to switch implementa- tions at runtime.

#### Cons

- You might make the code more complicated by applying the pattern to a highly cohesive class.

- high coupled artifacts (SPI and API)

### Composite

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#structural-patterns--composite-for-data-and-behavior)

### Decorator

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#structural-patterns--composite-for-data-and-behavior)

### Facade

- hides complexity and internal structure

- provides a simplified interface to a library, a framework, or any other complex set of classes

#### Usage

- When you have a lot of classes / artifacts, but want to expose only
few for the clients.

- When you want to create a single point of contact with your callers

#### Cons

- A facade can become a god object coupled to all classes of an app.

- Be careful to not give more responsabilities than needed (like business logic on facade).

### Flyweight

- lets you fit more objects into the available amount of RAM by sharing common
  parts of state between multiple objects instead of keeping all of the data in
  each object

#### Usage

- Reuse / share expensive resources

- Be careful about mutations

#### Cons

- Can lead to complexity to reuse the expensive objects

- Can lead to race conditions if the shared state are mutable

- Can increase the time to the expensive resource be garbage collected

### Proxy

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#structural-patterns--proxy)
