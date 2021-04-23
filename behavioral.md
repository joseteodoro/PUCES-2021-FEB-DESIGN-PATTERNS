## Behavioral Patterns

- Already known solutions to solve some recurrent problems

### Strategy

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#behavioral-patterns--strategy)

### Template Method

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#behavioral-patterns--template-method)

### Observer

- Lets you define a subscription mechanism to notify multiple objects 
about any events that happen to the object they're observing.

#### Usage

- Use the Observer pattern when changes to the state of one object may
require changing other objects, and the actual set of objects is unknown
beforehand or changes dynamically.

- Use the pattern when some objects in your app must observe others,
but keep coupling low.

#### Cons

- hard to debug! Subscribers can be notified in random order. 
(and can be more complex if you are using in concurrent environment).

### Command

- Turns a request into a stand-alone object that contains all information
about the request. This transformation lets you parameterize methods with
different requests, delay or queue a request's execution, and support
undoable operations.

#### Usage

- Use the Command pattern when you want to parametrize
objects with operations.

- Use the Command pattern when you want to queue operations,
schedule their execution, or execute them remotely.

- *Use the Command pattern when you want to implement reversible operations.
Like a sequence of events and you final state is also a compilation
of all those commands.

#### Cons

- The code may become more complicated since you’re introducing a whole new
layer between senders and receivers.

- The code become quite flexibe with all the flexibility's problems.

### Chain of Responsibility (CoR)

- Lets you pass requests along a chain of handlers. Upon receiving a request,
each handler decides either to process the request or to pass it to the next
handler in the chain.

#### Usage

- Use the pattern when it’s essential to execute several handlers in a particular order.

- Use the CoR pattern when the set of handlers and their order are supposed to
change at runtime.

#### Cons

- Depends on the way you configure the chain, can be hard to debug / understand
who changed what in the request.

- Some requests may end up unhandled.

### Iterator

- Lets you traverse elements of a collection without exposing its underlying
representation (list, stack, tree, etc.).

** Almost all modern languages has `foreach` and that loop already solve the
same problemas that iterator does.

#### Usage

- Use the pattern to reduce duplication of the traversal code across your app.

### Mediator

- Lets you reduce chaotic dependencies between objects. The pattern restricts
direct communications between the objects and forces them to collaborate only
via a mediator object.

- mediator or orchestration?

#### Usage

- Use the pattern when you can’t reuse a component in a differ- ent program
because it’s too dependent on other components.

#### Cons

- Complexity! Giant methods / functions, god classes, a lot of coupling.

### Memento

- Lets you save and restore the previous state of an object without revealing
the details of its implementation.

#### Usage

- Use the Memento pattern when you want to produce snapshots of the object’s
state to be able to restore a previous state of the object.

- what about keep track only over the diff intead of the entire object?

#### Cons

- The app might consume lots of RAM if clients create mementos too often.

### State

- Lets an object alter its behavior when its internal state changes. It appears
as if the object changed its class.

- Finite-State Machine.

#### Usage

- Use the pattern when you have a class polluted with massive conditionals
that alter how the class behaves according to the current values of the class’s fields.

#### Cons

- Applying the pattern can be overkill if a state machine has only a few states
or rarely changes.

### Visitor

- Lets you separate algorithms from the objects on which they operate.

#### Usage

- Use the Visitor when you need to perform an operation on all elements
of a complex object structure (for example, an object tree).

#### Cons

- Visitors might lack the necessary access to the private fields and methods
of the elements that they’re supposed to work with.
