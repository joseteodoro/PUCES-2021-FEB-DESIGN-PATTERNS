# Design Patterns

## Creational Patterns / Factory method

- Keep going with contracts and types (when possible)

- enables extension (creating new types and reusing the same contract without
other changes)

- centralize object creation / logic / dependencies

```java
public class ShapeFactory {

   public Shape byType(String shapeType){
      if(shapeType == null){
         return null;
      }
      if(shapeType.equalsIgnoreCase("CIRCLE")){
         return new Circle();

      } else if(shapeType.equalsIgnoreCase("RECTANGLE")){
         return new Rectangle();         
      }       
      return null;
   }
}

// usage
new ShapeFactory().byType("CIRCLE");
```

Did you find a bad practice here?

With lambdas

```java
public class ShapeFactory {

  final static Map<String, Supplier<Shape>> map = new HashMap<>();
  
  static {
    map.put("CIRCLE", Circle::new);
    map.put("RECTANGLE", Rectangle::new);
  }

  public Shape byType(String shapeType){
     Supplier<Shape> shape = map.get(shapeType.toUpperCase());
     return shape != null
        ? shape.get();
        : throw new IllegalArgumentException("No such shape " + shapeType);
  }
}

// usage
new ShapeFactory().byType("CIRCLE");
```

Did you find an NPE issue?

### Usage

- use the Factory Method to hide types and dependencies of the objects your code should work with (keep the contract!) - Factory + Dependency Inversion

- use to remove switch cases clauses or multiple if statements

```java
public class OutputFactory {

   @Autowired
   private Queue myGreatQueue;

   @Autowired("output_file_name")
   private String myFileName;

   public Output byType(String type){
      if(type == null){
         return null;
      }
      if("FILE".equalsIgnoreCase(type)){
         return new FileOutput(this.myFileName);
      }
      if("QUEUE".equalsIgnoreCase(type)){
         return new QueueOutput(this.myGreatQueue);
      }
      return null;
   }
}

// usage
String content = "{ \"message\": \"my secret message\"}";

new OutputFactory().byType("file").write(content);
```

Did you find the bad practice?

### Cons

- CONS: The code may become more complicated since you need to introduce
a lot of new subclasses to implement the pattern

- some coupled code between factory and the concrete classes

## Creational Patterns / Singleton

- let's code statically

- lets you ensure that a class has only one instance,
while providing a global access point to this instance

- abstract factories, builders, prototypes and pools can all be
implemented as singletons

- what about concurrence?

#### Usage

- use the Singleton pattern when a class in your program should have
just a single instance available to all clients; for example, a
single database object shared by different parts of the program

- use the Singleton pattern when you need stricter control over global
variables

```java
public class DbConnetion {
  private static DbConnetion instance;
  
  private DbConnetion() { }
  
  synchronized public static DbConnetion getInstance() {
    if (instance == null) {
      instance = new DbConnetion();
    }
    return instance;
  }
}
```

- non synchronized version

```java
public class DbConnetion {
  private static DbConnetion instance;
  
  private DbConnetion() { }
  
  public static DbConnetion getInstance() {
    if (instance == null) {
      instance = new DbConnetion();
    }
    return instance;
  }
}
```

- eager version

```java
public class DbConnetion {
  public static DbConnetion instance;
  
  private DbConnetion() { }

  static {
    instance = new DbConnetion();
  }
}
```

#### Cons

- violates the Single Responsibility Principle. The pattern
solves two problems at the time

- the Singleton pattern can mask bad design, for instance, when
the components of the program know too much about each other

- it may be difficult to unit test the client code

- if not synchronized, can lead to race conditions

