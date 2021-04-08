## Structural Patterns

- Strategies to couple / glue your components

### Adapter

- allows objects with incompatible interfaces to collaborate

- the adapter implements the interface of one object and wraps the other one

#### Usage

- Use the Adapter class when you want to use some existing class, but its interface
  isn’t compatible with the rest of your code

- Migrations and design refactoring!

#### Cons

- The overall complexity of the code increases because you need to introduce a set of
  new interfaces and classes. Sometimes it’s simpler just to change the service class so
  that it matches the rest of your code.

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

- lets you compose objects into tree structures and then work with these
  structures as if they were individual objects

#### Usage

- Using the Composite pattern makes sense only when the core model of your app can be represented as a tree.

- Use the pattern when you want the client code to treat both simple and complex elements uniformly.

#### Cons

- It might be difficult to provide a common interface for classes whose functionality differs too much.
In certain scenarios, you’d need to overgeneralize the component interface, making it harder to comprehend.

### Decorator

- lets you attach new behaviors to objects by placing these objects inside
  special wrapper objects that contain the behaviors.

#### Usage

- You can't change a third-party code but need to append behaviors

- You need to combine various behaviors.

#### Cons

- It’s hard to implement a decorator in such a way that its behavior
doesn’t depend on the order in the decorators stack.

- The initial configuration code of layers might look pretty ugly.

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

- lets you provide a substitute or placeholder for another object. A proxy controls
  access to the original object, allowing you to perform something either before or
  after the request gets through to the original object

- Lazy evaluation

#### Usage

- Expensive resource dont need to be loaded before they're really needed

- Dont eager what you are not sure if will be used

- Access control (protection proxy). This is when you want only specific clients
to be able to use the service object; for instance, when your objects are crucial
parts of an operating system and clients are various launched applications (including
malicious ones).

- Local execution of a remote service (remote proxy). This is when the service object
is located on a remote server.

- Caching request results (caching proxy). This is when you need to cache results of
client requests and manage the life cycle of this cache, especially if results are quite
large.

#### Cons

- The code may become more complicated since you need to introduce a lot of new classes.

- The response from the service might get delayed.