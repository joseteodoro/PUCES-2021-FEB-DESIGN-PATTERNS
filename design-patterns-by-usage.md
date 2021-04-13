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
public class ShapeFactory {

   public Shape byType(String shapeType){
      if(shapeType == null){
         return null;
      }
      if(shapeType.equalsIgnoreCase("CIRCLE")){
         return new Circle();
      }
      if(shapeType.equalsIgnoreCase("RECTANGLE")){
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

  private String valueOrDefault(value, default) {
     return shapeType == null 
         ? shapeType
         : default;
      }
  }

  public Shape byType(String shapeType){
     //Optional, Maybe, Nullable
      if (shapeType == null) {
         return null;
      }
     Supplier<Shape> shape = map.get(shapeType.toUpperCase());
     return shape != null
        ? shape.get();
        : throw new IllegalArgumentException("No such shape " + shapeType);
  }
}

// usage
new ShapeFactory().byType(null);
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
      // if(type == null){
      //    return null;
      // }
      if(type.equalsIgnoreCase("FILE")){
         return new FileOutput(this.myFileName);
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

### Usage

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

DbConnetion connection = DbConnetion.getInstance();
```

- non synchronized version

on demand versions

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

MockDbConnection().connect()

print >> conectei!

```

### Cons

- violates the Single Responsibility Principle. The pattern
solves two problems at the time

- the Singleton pattern can mask bad design, for instance, when
the components of the program know too much about each other

- it may be difficult to unit test the client code

- if not synchronized, can lead to race conditions

## Behavioral Patterns / Strategy

- Lets you define a family of algorithms, put each of them into a separate class,
and make their objects interchangeable.

### Usage

- Use the Strategy pattern when you want to use different variants
of an algorithm within an object and be able to switch from one algorithm
to another during runtime.

- Use the Strategy when you have a lot of similar classes that
only differ in the way they execute some behavior.

- Use the pattern to isolate the business logic of a class from the implementation
details of algorithms that may not be as important in the context of that logic.


```java
public enum ReportType { PDF, HTML }

class Report {

   private ReportEngine engine;

   public HttpResponse generateFrom(CompanyInfo info, List<Order> orders, ReportType type) {
      try (
         Header header = engine.buildHeader(info);
         Items items = engine.buildItems(orders);
         Sumup sumup = engine.buildSummary(orders);
         Content content = new EmptyContent();
         if (ReportType.PDF.equals(type)) {
            PDFWriter writer = new PDFWriter();
            writer.add(header, items, sumup);
            content.append(writer.export());
         } else {
            HTMLWriter writer = new PDFWriter();
            writer.add(header, items, sumup);
            content.append(writer.export());
         }
         return HttpResponse.withStatus(200).withContent(content);
      ) catch (RuntimeException ex) {
         return HttpResponse.withStatus(500).withContent(ex.getMessage());
      }
   }
}

//...
public HttpResponse doRequest(Resquest req) {
   CompanyInfo info = infoDao.load();
   List<Order> orders = orderDao.load();
   ReportType type = typeFromRequest(type);
   return new Report(engine).generateFrom(info, orders, type);
}

```

What if we have to build an png version? What if we need to build a new txt version?

First of all, lets isolate some code

```java

class PDFBuilder {}

class HTMLBuilder {}

class Report {

   private ReportEngine engine;

   public HttpResponse generateFrom(CompanyInfo info, List<Order> orders, ReportType type) {
      try (
         Header header = engine.buildHeader(info);
         Items items = engine.buildItems(orders);
         Sumup sumup = engine.buildSummary(orders);
         Content content = ReportType.PDF.equals(type)
            ? PDFBuilder.from(header, sitems, sumup)
            : HTMLBuilder.from(header, sitems, sumup);
         return HttpResponse.withStatus(200).withContent(content);
      ) catch (RuntimeException ex) {
         return HttpResponse.withStatus(500).withContent(ex.getMessage());
      }
   }
}
```

Now, lets use a strategy

```java
class Report {

   private ReportEngine engine;

   private ReportBuilder builder;

   public HttpResponse generateFrom(CompanyInfo info, List<Order> orders) {
      try (
         Header header = engine.buildHeader(info);
         Items items = engine.buildItems(orders);
         Sumup sumup = engine.buildSummary(orders);
         // Content content = ReportType.PDF.equals(type)
         //    ? PDFBuilder.from(header, sitems, sumup)
         //    : HTMLBuilder.from(header, sitems, sumup);
         Content content = builder.from(header, sitems, sumup)
         return HttpResponse.withStatus(200).withContent(content);
      ) catch (RuntimeException ex) {
         return HttpResponse.withStatus(500).withContent(ex.getMessage());
      }
   }
}

```

Without factory

```java
//...
public HttpResponse doRequest(Resquest req) {
   ReportType type = typeFromRequest(type);
   ReportBuilder builder = ReportType.PDF.equals(type)
      ? new PDFBuilder()
      : new HTMLBuilder();
   
   ReportBuilder builder = ReportBuilderFactory.create(type);
   CompanyInfo info = infoDao.load(req.body.clientId);
   List<Order> orders = orderDao.load(req.body.clientId);
   return new Report(engine, builder).generateFrom(info, orders);
}
```

With factory

```java
//...
public HttpResponse doRequest(Resquest req) {
   ReportType type = typeFromRequest(type);
   ReportBuilder builder = ReportBuilderFactory.create(type);
   CompanyInfo info = infoDao.load(req.body.clientId);
   List<Order> orders = orderDao.load(req.body.clientId);
   return new Report(engine, builder).generateFrom(info, orders);
}
```


If we need to implement more report types we isolate the changes into ReportBuilderFactory; 

Grouping data to improve granularity

```java
class ReportData {
   CompanyInfo info;
   List<Order> orders;
}

class ReportRepository {

   ReportData find(int clientId) {
      CompanyInfo info = infoDao.load(req.body.clientId);
      List<Order> orders = orderDao.load(req.body.clientId);
      return new ReportData(info, orders);
   }

}

//...

   public HttpResponse generateFrom(ReportData data) {
      try (
         Header header = engine.buildHeader(data.info);
         Items items = engine.buildItems(data.orders);
         Sumup sumup = engine.buildSummary(data.orders);
         // Content content = ReportType.PDF.equals(type)
         //    ? PDFBuilder.from(header, sitems, sumup)
         //    : HTMLBuilder.from(header, sitems, sumup);
         Content content = builder.from(header, sitems, sumup)
         return HttpResponse.withStatus(200).withContent(content);
      ) catch (RuntimeException ex) {
         return HttpResponse.withStatus(500).withContent(ex.getMessage());
      }
   }
//...


//...
public HttpResponse doRequest(Resquest req) {
   ReportType type = typeFromRequest(type);
   ReportBuilder builder = ReportBuilderFactory.create(type);
   ReportData data = new ReportRepository().find(req.body.clientId)
   return new Report(engine, builder).generateFrom(data);
}
```

### Cons

- Clients must be aware of the differences between strategies to be
able to select a proper one if you dont use a factory;

### Improvements on modern languages

- A lot of modern programming languages have functional type support that
lets you implement different versions of an algorithm inside a set of
anonymous functions. Then you could use these functions exactly as you’d have
used the strategy objects, but without bloating your code with extra classes
and interfaces.

```java

   public interface Client {};

   public class Partner implements Client {};

   public class Costumer implements Client {};

   public Response checkOutOrder(Client client, List<Items> items) {
      if (!client.isActive()) {
         return Response.clientNotActive();
      }
      try {
         Account account = Account.from(client);
         account.buyItems(items);
         if (!client.isPartner()) {
            account.tax(items);
            account.billTransportation(items);
         }
         Transportation.for(client).dispath(items);
         return Response.created();
      } catch (RuntimeException ex) {
         return Response.serverError(ex.getMessage());
      }

   }

```

using a costumer / partner strategy

```java
   public Response checkOutOrder(Strategy strategy, Client client, List<Items> items) {
      if (!client.isActive()) {
         return Response.clientNotActive();
      }
      try {
         Account account = Account.from(client);
         account.buyItems(items);
         strategy.apply(account, items);
         Transportation.for(client).dispath(items);
         return Response.created();
      } catch (RuntimeException ex) {
         return Response.serverError(ex.getMessage());
      }

   }

// without classes using FP

Strategy clientStrategy = (Account account, List<Items> items) -> {
   account.tax(items);
   account.billTransportation(items);
}

Strategy partnerStrategy = (Account account, List<Items> items) -> {};

// using that

//...
checkOutOrder(partnerStrategy, partner, items);

//...
checkOutOrder(clientStrategy, client, items);


//... with a better name
checkOutOrder(taxFreeStrategy, partner, items);
checkOutOrder(taxStrategy, client, items);

```

## Behavioral Patterns / Template Method

- Defines the skeleton of an algorithm in the superclass but lets subclasses
override specific steps of the algorithm without changing its structure.

### Usage

- Use the Template Method pattern when you want to let clients extend only
particular steps of an algorithm, but not the whole algorithm or its structure.

- Template Method is based on inheritance: it lets you alter parts of an
algorithm by extending those parts in subclasses. Strate- gy is based on
composition: you can alter parts of the object’s behavior by supplying it
with different strategies that corre- spond to that behavior. Template
Method works at the class level, so it’s static. Strategy works on the
object level, letting you switch behaviors at runtime.

- Use the pattern when you have several classes that contain almost identical
algorithms with some minor differences. As a result, you might need to
modify all classes when the algorithm changes.

```java

   public interface Client {};

   public class Partner implements Client {};

   public class Costumer implements Client {};

   public Response checkOutOrder(Client client, List<Items> items) {
      if (!client.isActive()) {
         return Response.clientNotActive();
      }
      try {
         Account account = Account.from(client);
         account.buyItems(items);
         if (!client.isPartner()) {
            account.tax(items);
            account.billTransportation(items);
         }
         Transportation.for(client).dispath(items);
         return Response.created();
      } catch (RuntimeException ex) {
         return Response.serverError(ex.getMessage());
      }

   }

```

using a template

```java
public abstract class Cart {

   public abstract void tax(Account account, List<Items> items);

   public Response checkOutOrder(Client client, List<Items> items) {
      if (!client.isActive()) {
         return Response.clientNotActive();
      }
      try {
         Account account = Account.from(client);
         account.buyItems(items);
         this.tax(account, items);
         Transportation.for(client).dispath(items);
         return Response.created();
      } catch (RuntimeException ex) {
         return Response.serverError(ex.getMessage());
      }

   }
}

public class ClientCart extends Cart {
   public abstract void tax(Account account, List<Items> items) {
      if (!client.isPartner()) {
         account.tax(items);
         account.billTransportation(items);
      }
   }
}

public class PartnerCart extends Cart {
   public abstract void tax(Account account, List<Items> items) {}
}

//....
Cart taxFreeCart = new PartnerCart();
taxFreeCart.checkOutOrder(partner, items);

Cart taxCart = new ClientCart();
taxCart.checkOutOrder(client, items);
```

### Cons

- Template methods tend to be harder to maintain the more steps they have.

- Try strategy first because its uses composition instead of inheritance.


## Progressive rollout Patterns / Feature Flag (Toggle)

- Enables change between old and new behavior / feature with a click.

FF on -> use new behavior
FF off -> use previous behavior

### Usage

- Use FF when you want to add new behavior / feature while testing agains a set of users before delivery it for all users;

- Use FF when you want to delivery continuously even before the whole feature is done. After feature done you can turn it on for some users;

- Use FF for the A/B tests;

- Use FF for canary releases;

- FF is temporary! Always!

### Pros

- You can deploy unready features on production without downtime;

- You can test beta features using the same production code;

- You can rollout new feature progressively;

- Some guys say that FF is bad, it is if only if you are using it wrong!

[Feature Toggles are one of the Worst kinds of Technical Debt](https://dzone.com/articles/feature-toggles-are-one-worst#)

### Cons

- Old and new code must live together, it make code harder to understand and maintain. So, keep it for a short time!

- You need some unit / integration test for every chunk of feature flag switch, and yes its a temporary test (you will delete that test after remove the feature flag) 

### FF by random sample

- You enable the flag for X% of all users (test you feature randomly);

- Not all users like to be early adopters;

### FF by white list (user identifier)

- You enable the flag for users in the list (test you feature is not random);

- Can be not a fair test because the user behavior are different;

### FF by black list (user identifier)

- You disable the flag for users in the list (test you feature is not random);

- Can be not a fair test because the user behavior are different;

- You FF user set can become too large leading for performance issues;

### FF by alpha / beta users

- You enable the flag for alpha / beta users (test you feature is not random);

- Can be not a fair test because the user behavior are different;

### All those together!

- What about start with alpha / beta users?

- After that go to white list;

- After that starts rolling out by sample.

- Ensure a good rollout for new behaviors with no downtime, but can be hard to develop and maintain;

### P.O.s or devs control the FF? (do you have a FF frontend?)

Some tools like tooglz can be useful

[Using Togglz](https://www.togglz.org/quickstart.html)

You can even integrate some of them with Springboot!

[Feature Flags with Spring](https://www.baeldung.com/spring-feature-flags)

### Doing it by hand

If you decide to do it by hand, there are some ways of think

#### FF on backend using API version

```
http://backend:3000/v1/users
http://backend:3000/v2/users

http://backend:3000/v1/orders
http://backend:3000/v2/orders
http://backend:3000/v3/orders
```

```javascript
const userWhiteList = (userId)  => {
   return `http://backend:3000/${ff.routes.version.orders(userId)}/orders`
}

const url = urlFromFFWhiteList(userId)
req.get(url)
```

#### FF on backend using code

```javascript
const order = (req, res) => {}

const newOrder = (req, res) => {}

const ffNewOrder = 10;

const orders = (req, res) => {
   // random() = [0..100]
   const ff = random() <= ffNewOrder;
   return ff
      ? order(req, res)
      : newOrder(req, res);
}
```

```java
public interface OrderProcessor {
   Result process(Order order);
}

public class OrderProcessorV1 implements OrderProcessor {
   Result process(Order order) { 
      // lot of code
   }
}

public class OrderProcessorV2 implements OrderProcessor {
   Result process(Order order) { 
      // lot of code
   }
}
```

Using adapter pattern

```java
public class OrderProcessorFF implements OrderProcessor {

   private OrderProcessorV1 v1;

   private OrderProcessorV2 v2;

   private int ffNewOrder = 10;

   Result process(Order order) { 
      // random() = [0..100]
      return random() <= ffNewOrder
         ? v2.process(req, res)
         : v1.process(req, res);
   }
}
```

Using factory pattern

```java
public class OrderProcessorFactory {

   private int ffNewOrder = 10;

   OrderProcessor create() { 
      // random() = [0..100]
      return random() <= ffNewOrder
         ? new OrderProcessorV2()
         : new OrderProcessorV1();
   }
}
```

##### Load on demand

Using load when needed

```java
public class OrderProcessorFactory {

   private FFProvider provider;

   OrderProcessor create() { 
      return provider.loadFromServer().isEnabled("USE_NEW_ORDER")
         ? new OrderProcessorV2()
         : new OrderProcessorV1();
   }
}
```

##### Load on login

Load on login / startup and keep that on singleton / cache

```java
public class OrderProcessorFactory {

   OrderProcessor create() {
      return FFProvider.getInstance().isEnabled("USE_NEW_ORDER")
         ? new OrderProcessorV2()
         : new OrderProcessorV1();
   }
}
```

#### FF on frontend using code

- Load on demand

- Load on login or startup
