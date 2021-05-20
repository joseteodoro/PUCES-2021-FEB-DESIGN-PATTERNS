## Behavioral Patterns

- Already known solutions to solve some recurrent problems

### Strategy

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#behavioral-patterns--strategy)

### Template Method

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#behavioral-patterns--template-method)

### Observer

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#behavioral-patterns--observer)

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

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#behavioral-patterns--chain-of-responsibility-cor)

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

[Link](https://github.com/joseteodoro/PUCES-2021-FEB-DESIGN-PATTERNS/blob/main/design-patterns-by-usage.md#behavioral-patterns--visitor)
