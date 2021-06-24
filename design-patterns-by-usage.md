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

- 

### Template method using FP on modern languages

```java
public abstract class Request<T> {

   public abstract T fn();

    public ResponseEntity<T> process(Integer page, Integer limit) {
        if (limit == null || limit <= 0)) {
            log.error("Limit should be at least 1.");
            return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
        }

        if (page == null || page < 0) {
            log.error("Page should be at least 0.");
            return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
        }

        try {
            return ResponseEntity.ok(fn());
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } finally {
            log.info("request finished.");
        }
    }
}


public class ListOrderRequest extends Request<List<Orders>> {

   public ListOrderRequest(Integer page,Integer limit) {
      this.page = page;
      this.limit = limit;
   }

   @Override
   public List<Orders> fn() {
      return orderService.list(this.page, this.limit);
   }

}

public class PostOrderRequest extends Request<Void> {

   private List<Orders> orders;

   public PostOrderRequest(List<Orders> orders) {
      this.orders = orders;
   }

   @Override
   public Void fn() {
      return orderService.persist(this.orders);
   }

}

// my controllers
public class OrderController {

    @GetMapping(produces = "application/json")
    public ResponseEntity list(Integer page,Integer limit) {
        return new ListOrderRequest().process(page, limit);
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity post(@RequestBody List<Orders> orders) {
        return new PostOrderRequest().process(orders);
    }
}
```

- using FP

```java
public class Request {

    public static <T> ResponseEntity<T> process(Integer page, Integer limit, Supplier<T> fn) {
        if (limit == null || limit <= 0)) {
            log.error("Limit should be at least 1.");
            return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
        }

        if (page == null || page < 0) {
            log.error("Page should be at least 0.");
            return ResponseEntity.status(HttpStatus.PRECONDITION_FAILED).build();
        }

        try {
            return ResponseEntity.ok(fn.get());
        } catch (Exception exception) {
            log.error(exception.getMessage(), exception);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } finally {
            log.info("request finished.");
        }
    }

    public static <T> ResponseEntity<T> process(Supplier<T> fn) {
        return Request.process(0, 10, fn);
    }
}

// my controllers
public class OrderController {

    @GetMapping(produces = "application/json")
    public ResponseEntity list(Integer page,Integer limit) {
        return Request.process(page, limit, () -> orderService.list(page, limit));
    }

    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity post(@RequestBody List<Orders> orders) {
        return Request.process(() -> orderService.persist(orders));
    }
}
```

## Structural Patterns / Adapter (Wrapper)

- Allows objects with incompatible interfaces to collaborate

- The adapter implements the interface of one object and wraps the other one

- Promotes abstractions and promotes polymorphism;

- Promotes interface seggregation;

### Usage

- Use the Adapter class when you want to use some existing class, but its interface isn’t compatible with the rest of your code;

- Reuse existent code for a new feature

```java

public interface Exporter<T> {

   public T export();

}

public class OrderReport implements Exporter<XMLContent> {

   public OrderExporter(Date start, Date end) {
      this.start = start;
      this.end = end;
   }

   public XMLContent export() {
      List<Order> orders = this.listOrdersBetween(start, end);
      Template template = this.loadReportTemplate();
      return this.xmlEngine.createReport(template, orders);
   }

}

public class JsonOrderReport implements Exporter<JSONContent> {

   private final OrderExporter exporter;

   public JsonOrderReport(Date start, Date end) {
      this.exporter = new OrderExporter(start, end);
   }

   public JSONContent export() {
      return JSONConverter.convert(this.exporter.export());
   }

}
```

- Reuse to change the contract for new or old code

- Migrations and design refactoring (short lived code)!

```java

public interface ExporterV1<T> {

   public T export();

}

public interface ExporterV2<T> {

   public T export(Date start, Date end);

}

public class OrderReportV1 implements ExporterV1<XMLContent> {

   public OrderReportV1(Date start, Date end) {
      this.start = start;
      this.end = end;
   }

   public XMLContent export() {
      List<Order> orders = this.listOrdersBetween(start, end);
      return this.xmlEngine.createReport(orders);
   }

}

// new signature using old existent code without change on the old code
public class OrderReportV2 implements ExporterV2<XMLContent> {

   public XMLContent export(Date start, Date end) {
      return new OrderReportV1(start, end).export();
   }

}

// new content using old interface to pass our new code for old libraries / old code
public class OrderReportAdapter implements ExporterV1<XMLContent>, ExporterV2<XMLContent> {

   public OrderExporter(Date start, Date end) {
      this.start = start;
      this.end = end;
   }

   public XMLContent export() {
      return this.export(this.start, this.end);
   }

   public XMLContent export(Date start, Date end) {
      return new OrderReportV1(start, end).export();
   }

}
```

- to pass existent code / instances for third party library

```java

// third party connection configuration
public interface DataSourceProvider {
   public DataSource datasource();
}

public class DataSourceAdapter implements DataSourceProvider {

   private EntityManager em;

   public DataSourceAdapter(DataSourceAdapter em) {
      this.em = em;
   }

   public DataSource datasource() {
      EntityManagerFactoryInfo info = (EntityManagerFactoryInfo) em.getEntityManagerFactory();
      return info.getDataSource();
   }

}

// passing our connection to old third library
EntityManager myEntityManagerInstance = get from somewhere;
new OldLibrary(new DataSourceAdapter(myEntityManagerInstance)).doSomething();
```

### Cons

- The overall complexity of the code increases because you need to introduce a set of new interfaces and classes. Sometimes it’s simpler just to change the service class so that it matches the rest of your code;

- The code is not elegant, ugly and can lead to errors;

- should be short lived (short lived code and short lived tests);

## Structural Patterns / Proxy

- lets you provide a substitute or placeholder for another object. A proxy controls
  access to the original object, allowing you to perform something either before or
  after the request gets through to the original object

- Lazy evaluation

- cache multi level

#### Usage

- Expensive resource dont need to be loaded before they're really needed

- Dont eager what you are not sure if will be used

```java
interface ExpensiveResource {
   public byte [] get();
}

class ConcreteExpensiveResource implements ExpensiveResource {
   public byte [] get() {
      // my huge array
   } 
}

class ProxyExpensiveResource implements ExpensiveResource {
   public byte [] get() {
      // load only when needed
      return ConcreteExpensiveResoure.loadFromSomewhere();
   } 
}

```

- Access control (protection proxy). This is when you want only specific clients
to be able to use the service object; for instance, when your objects are crucial
parts of an operating system and clients are various launched applications (including
malicious ones).

- Local execution of a remote service (remote proxy). This is when the service object
is located on a remote server.

- Caching request results (caching proxy). This is when you need to cache results of
client requests and manage the life cycle of this cache, especially if results are quite
large.

```java
interface HttpService {
   public Response get(URI uri, Headers headers);
}

class RestHttpService implements HttpService {
   public Response get(URI uri, Headers headers) {
      // a lot of code here ....
      return httpClient.get(uri, headers);
   } 
}

class ProxyHttpService implements HttpService {
   public Response get(URI uri, Headers headers) {
      Response response = cache.get(uri, headers);
      if (response == null) {
         response = new RestHttpService().get(uri, headers);
         cache.put(uri, headers, response);
      }
      return response;
   } 
}

// what about

class MultiLevelCache {

   public static Response get(URI uri, Headers headers, Supplier<Response> fallback) {
      Response response = cacheInMemory.get(cacheInMemory.createkey(uri, headers));
      if (response == null) {
         // dont have in memory
         response = cacheRedis.get(cacheRedis.createkey(uri, headers));
         if (response == null) {
            // dont have in redis
            response = fallback();
            cacheRedis.put(cacheRedis.put(uri, headers), response);
         }
         cacheInMemory.put(cacheInMemory.createkey(uri, headers), response);
      }
      // so can have a lot of levels here
      return response;
   } 
}

// old version

class RestHttpService implements HttpService {
   public Response get(URI uri, Headers headers) {
      // a lot of code here ....
      return httpClient.get(uri, headers);
   } 
}

// new version using existent cache

class RestHttpService implements HttpService {
   public Response get(URI uri, Headers headers) {
      return MultiLevelCache.get(uri, headers, () -> {
         // a lot of code here ....
         return httpClient.get(uri, headers);
      })      
   }
}

// if supplier is oneliner

class RestHttpService implements HttpService {
   public Response get(URI uri, Headers headers) {
      return MultiLevelCache.get(uri, headers, () -> httpClient.get(uri, headers));
   }
}
```

#### Cons

- The code may become more complicated since you need to introduce a lot of new classes.

- The response from the service might get delayed.


## Behavioral Patterns / Observer

- Lets you define a subscription mechanism to notify multiple objects 
about any events that happen to the object they're observing.

- some examples, pubsub, topics, event listeners, pipes;

#### Usage

- Use the Observer pattern when changes to the state of one object may
require changing other objects, and the actual set of objects is unknown
beforehand or changes dynamically.

- Use the pattern when some objects in your app must observe others,
but keep coupling low.

- sounds like reactive programming?

```java
public interface ObservationAware<T> {
   public onData(T t);
}

public interface Observable<K extends ObservationAware<T>> {
   public registry(K k);
}


public class Message {

   public String eventType() {}

   public String body() {}

}

public class MessageLogger implements ObservationAware<Message> {
   public onData(Message message) {
      System.out.println(message.body());
   }
}

public class MessageBus implements Observable<K extends ObservationAware<Message>> {

   private List<K> listeners = new LinkedList<>();

   public registry(K listener) {
      this.listeners.add(listener);
   }

   public void emit(Message message) {
      this.listeners.forEach(l -> l.onData(message));
   }

}

// usage

MessageBus bus = new MessageBus();
bus.registry(new MessageLogger());
bus.registry(new AutoForwardMessage(newDestination));

public class Page  implements ObservationAware<Message> {
   //.....
   public onData(Message message) {
      this.messagePanel.add(message);
      this.sendBrowserNotification(message);
   }
   //.....
}

Page homepage = new Page();
bus.registry(homepage);

```

What about an event bus for the entire system? We could decouple components using messages.

```java
public class MessageBus implements Observable<K extends ObservationAware<Message>> {

   private static MessageBus instance = new MessageBus();

   public static MessageBus getInstance() {
      return instance;
   }

   private MessageBus() { super(); }

   private Map<K, List<ObservationAware<Message>>> listeners = new HashMap<>();

   public static void registry(K listener, String event) {
      if (instance.listeners.get(event) == null) {
         instance.listeners.put(event, new LinkedList<>());
      }
      instance.listeners
         .get(event)
         .add(listener);
   }

   public static void emit(Message message) {
      instance.listeners
         .get(message.eventType())
         .forEach(l -> l.onData(message));
   }

}

// push notifications anywhere
Page userPage = new UserPage();
MessageBus.registry(userPage, "create:user");

// send messages from anywhere
Message userUpdates = new Message();
MessageBus.emit(userUpdates);

// everytime we create a user, userpage will be notified

// everyone listening message bus can receive them
```

#### Cons

- hard to debug! Subscribers can be notified in random order. 
(and can be more complex if you are using in concurrent environment).

- increase system's complexity

## Structural Patterns / Decorator (for behavior)

- lets you attach new behaviors to objects by placing these objects inside special wrapper objects that contain the behaviors;

- additional behavior to extend some existent behavior (even your code or third party libraries);

- compose behavior from smaller pieces;

- opposite to `Structural Patterns / Composite`, the signature does not need to build a hierarchy!

#### Usage

- You can't change a third-party code but need to append behaviors

- You need to combine various behaviors having basic ones

```java
//third party class
class UserService {

   public User save(User user) {};

   public User load(Long id) {};

   public Set<User> find(Query query) {};
}

// now we need to cache values, log load calls to improve debug and notify user changes

// my decorator class to cache (proxy feelings!)
class CacheableUserService extends UserService {

   private Cache<User> cache = new Cache<>();

   private UserService delegate;

   public CacheableUserService (UserService delegate) {
      this.delegate = delegate;
   }

   public User save(User user) {
      User saved = this.delegate.save(user);
      this.cache.clearCacheFor(user);
      return saved;
   }

   public User load(Long id) {
      return cache.hasOne(id)
         ? cache.getOne(id)
         : cache.putOneAndReturn(id, this.delegate.load(id));
   }

   public Set<User> find(Query query) {
      return cache.hasMany(id)
         ? cache.getMany(id)
         : cache.putManyAndReturn(query, this.delegate.find(query));
   }
}

// my interface to notify (Observer feelings!)

interface Observable<T> {

   void registry(EventListener<T> listener) {};

   void notify(T event) {};

}

// my decorator class to notify
class NofifierUserService extends UserService implements Observable<User> {

   private UserService delegate;

   private Observable<User> observer;

   public NofifierUserService (UserService delegate, Observable<User> observer) {
      this.delegate = delegate;
      this.observer = observer;
   }

   // observer feelings!
   void registry(EventListener<User> listener) {
      this.observer.registry(listener);
   };

   void notify(User event) {
      this.observer.notify(event);
   };

   // decorator feelings!
   public User save(User user) {
      User saved = this.delegate.save(user);
      this.notify(saved);
      return saved;
   }

}

// my decorator class to log
class LoggerUserService extends UserService {

   private UserService delegate;

   private Logger log = new Logger();

   public LoggerUserService (UserService delegate) {
      this.delegate = delegate;
   }

   public User save(User user) {
      logger.info("saving", user);
      return this.delegate.save(user);
   }

   public User load(Long id) {
      logger.info("loading user id", id);
      return this.delegate.load(query);
   }

   public Set<User> find(Query query) {
      logger.info("looking for users", query);
      return this.delegate.find(query);
   }

}

// usage

//use raw behavior
UserService store = new UserService();

store.save(myUser); // saves only
User userById = store.load(userId); // load only


//use composed behaviors (does order matter?)
Observer<User> userObserver = SingletonObserver.for(User.class);
UserService store = new LoggerUserService( 
   new NofifierUserService( new CacheableUserService ( new UserService() ), userObserver) 
);

store.save(myUser); // log, save, invalidate cache and send a user change event!
User userById = store.load(userId); // log, load if cache misses otherwise only get from cache!
```

About above ordering:

- log, save, invalidate cache?

- save, invalidate cache, log?

- invalidate cache, save, log?

- Sometimes the ordering matters.

Can you suggest improvements on the code above?

#### Cons

- It’s hard to implement a decorator in such a way that its behavior
doesn’t depend on the order in the decorators stack.

- The initial configuration code of layers might look pretty ugly.

## Structural Patterns / Composite (for data and behavior)

- lets you compose objects into tree structures and then work with these
  structures as if they were individual objects

### Usage

- Using the Composite pattern makes sense only when the core model of your app can be represented as a tree.

- Use the pattern when you want the client code to treat both simple and complex elements uniformly (data and not only behavior).

- Usually the order does not matter (with some exceptions).

```java
interface Element {
   String evaluate();
}

class P implements Element {
   
   private String content;

   public P (String content) {
      this.content = content;
   }

   public String evaluate() {
      return String.join('', '<p>', this.content, '</p>');
   }
}

class I implements Element {
   
   private Element content;

   public I (Element content) {
      this.content = content;
   }

   public String evaluate() {
      return String.join('', '<i>', this.content.evaluate(), '</i>');
   }
}

class B implements Element {
   
   private Element content;

   public B (Element content) {
      this.content = content;
   }

   public String evaluate() {
      return String.join('', '<b>', this.content.evaluate(), '</b>');
   }
}

class EM implements Element {
   
   private Element content;

   public EM (Element content) {
      this.content = content;
   }

   public String evaluate() {
      return String.join('', '<em>', this.content.evaluate(), '</em>');
   }
}

// usage

Element complex = new EM(new B(new I( new P("my paragraph"))));
complex.evaluate().equals("<em><b><i><p>my paragraph</p></i></b></em>");

Element simple = new P("my paragraph");
e.evaluate().equals("<p>my paragraph</p>");

```

with DRY


```java
interface Element {
   String evaluate();
}

class P implements Element {
   
   private String content;

   public P (String content) {
      this.content = content;
   }

   public String evaluate() {
      return String.join('',
         '<p>',
         this.content,
         '</p>');
   }
}

class ParentElement implements Element {

   private String tag;

   private Element content;

   public ParentElement (String tag, Element content) {
      this.tag = tag;
      this.content = content;
   }

   public String evaluate() {
      return String.join("",
         "<" , this.tag, ">",
         this.content.evaluate(),
         "</" , this.tag, ">");
   }

}

// usage

Element complex = new ParentElement(
   "em", new ParentElement(
      "b", new ParentElement(
         "i",
         new P("my paragraph")
      )
   )
);
complex.evaluate().equals("<em><b><i><p>my paragraph</p></i></b></em>");

complex = new ParentElement(
   "em", new ParentElement(
      "b",
      new P("my paragraph")
      )
   )
);

complex.evaluate().equals("<em><b><p>my paragraph</p></b></em>");

Element simple = new P("my paragraph");
e.evaluate().equals("<p>my paragraph</p>");

```

### Cons

- It might be difficult to provide a common interface for classes whose functionality differs too much;

- In certain scenarios, you’d need to overgeneralize the component interface, making it harder to comprehend;

- can mess your type hierarchy;

- The code of layers might look pretty ugly;

What if...

```java
class Element implements Supplier<String> {
   
   String tag;
   Supplier<String> element;

   private Element(String tag, Supplier<String> element) {
      this.tag = tag;
      this.element = element;
   }

   public String get() {
      return String.join("",
         "<" , element.tag, ">", element.get(), "</" , element.tag, ">"
      );
   }

   public static from(String tag, Supplier<String> element) {
      return new Element(tag, element)
   }
}

// usage

String content = "my paragraph";

Supplier<String> complex = () -> Element.from(
   "em",
   () -> Element.from(
      "b",
      () -> Element.from(
         "i", 
         () -> Element.from(
            "p",
            () -> content
         )
      )
   )
)

complex.get().equals("<em><b><i><p>my paragraph</p></i></b></em>");

Element simple = Element.from("p", () -> content);
e.get().equals("<p>my paragraph</p>");

// or

Supplier<String> complex = Arrays.asList("em", "b", "i", "p").stream()
   .reducing(() -> content, (sup, tag) -> Element.from(tag, sup));

complex.get().equals("<p><i><b><em>my paragraph</em></b></i></p>");

// what's wrong? became reversed cause we reduce from left to right!

List<String> tags = Arrays.asList("em", "b", "i", "p");
Supplier<String> complex = Collections.reverse(tags)
   .stream()
   .reducing(() -> content, (sup, tag) -> Element.from(tag, sup));

complex.get().equals("<em><b><i><p>my paragraph</p></i></b></em>");

List<String> tags = Arrays.asList("em", "b", "i", "strong", "potato", "banana", "custom", "p");
Supplier<String> complex = Collections.reverse(tags)
   .stream()
   .reducing(() -> content, (sup, tag) -> Element.from(tag, sup));

// does make sense code the list already reversed?
// ["p" , "custom", "banana", "potato", "strong", "i", "b", "em"]

```

## Adapter vs Decorator vs Composite

- Adapter: adapts code to **mimic** other code using the same signature:
   - short lived (refactoring, reuse existent bad code, version adaptation before rebuild, glue third party libs)

- Decorator: **adds behavior** for existent code with no changes on that.
   - long lived (compose behavior, add features / requirements on third party libs)

- Composite: **organize data / behavior** like a tree.
   - long lived

## Creational Patterns / Builder

- lets you construct complex objects step by step. The pattern allows
you to produce different types and representations of an object using
the same construction code

- who know how to build is NOT the caller

- there are optional items you can put on the object

- fluent call when creating something

- hides creation complexity / default values

```java
public class XMLExporter {

   private Encode encoding = new DefaultEncoding();

   private Marshaller marshaller = new DefaultMarshaller();

   public XMLExporter(Encode encoding, Marshaller marshaller) {
      this.encoding = encoding;
      this.marshaller = marshaller;
   }

   public void setMarshaller(Marshaller marshaller) {
      this.marshaller = marshaller;
   }

   public void setEncoding(Encode encoding) {
      this.encoding = encoding;
   }

   public InputStream export(InputStream source) {
      Document doc = marshaller.newDocument(encoding);
      return new DocumentStream(doc.encode(source));
   }

}

new XMLExporter(
   new CustomEncoding(),
   new CustomMarshaller()
).export(myObjects);

```

what if

```java
public class XMLExporterBuilder {

   private Encode encoding = new DefaultEncoding();

   private Marshaller marshaller = new DefaultMarshaller();

   public XMLExporterBuilder withEncoding(Encode encoding) {
      this.encoding = encoding;
      return this;
   }

   public XMLExporterBuilder withMarshaller(Marshaller marshaller) {
      this.marshaller = marshaller;
      return this;
   }

   public XMLExporter build() {
      // any complexity on creation should be here!
      return new XMLExporter(encoding, marshaller);
   }

}

public class XMLExporter {

   private Encode encoding = new DefaultEncoding();

   private Marshaller marshaller = new DefaultMarshaller();

   public XMLExporter(Encode encoding, Marshaller marshaller) {
      this.encoding = encoding;
      this.marshaller = marshaller;
   }

   public InputStream export(InputStream source) {
      Document doc = marshaller.newDocument(encoding);
      return new DocumentStream(doc.encode(source));
   }

   public static XMLExporterBuilder builder() {
      return new XMLExporterBuilder();
   }

}

// usage
XMLExporter exporter = XMLExporter.builder()
   .withEncoding(new CustomEncoding())
   .withMarshaller(new CustomMarshaller())
   .build()
   .export(myObjects);

```

#### Usage

- use the Builder pattern to get rid of a “telescopic constructor”

- use the Builder pattern when you want your code to be able to create
different representations of some product with some default values

#### Cons

- The overall complexity of the code increases since the pattern
requires know about all the creation details;

- builder becomes huge with many dependencies

- builder and its classes have strong coupling

## Builder vs Factory Method

- Factory method routes which implementation will be called (polymorphism);

```java
// can be a xml, a json, a html. Can choose between types
Exporter exporter = ExporterFactoryByType("xml");
exporter.export(myObjects);

```

- Builder hides creation details for one object only;

```java
// always a concrete exporter
XMLExporter exporter = XMLExporter.builder()
   .withEncoding(new CustomEncoding())
   .withMarshaller(new CustomMarshaller())
   .build()
   .export(myObjects);

```

## Behavioral Patterns / Chain of Responsibility (CoR)

- Lets you pass requests along a chain of handlers. Upon receiving a request,
each handler decides either to process the request or to pass it to the next
handler in the chain.

### Usage

- Use the pattern when it’s essential to execute several handlers in a particular order.

- Use the CoR pattern when the set of handlers and their order are supposed to
change at runtime.

```javascript

const auth = (request, response, next) => {
   return isValidUser(request.headers.Authorization)
      ? next()
      : response.write(401, "Unauthorized!");
}

const saveOrder = (request, response, next) => {
   return Order.save(request.body)
      .then(
         (order) => response.write(201, order)
      );
}

const endpoint = router.get(auth, saveOrder);
```

```javascript
const messages = [
   {
      command: "create-user", 
      payload: {name: 'user-01', email: '01@email.com'}
   },
   {
      command: "disable-user",
      payload: {name: 'user-99'}
   },
   {
      command: "enable-user",
      payload: {name: 'user-1001'}
   },
   {
      command: "delete-user",
      payload: {name: 'user-100'}
   },
]

const drop = ({command, payload}, next) => {
   if (command !== "delete-user") return next();
   return UserModel.delete(payload.name);
}

const create = ({command, payload}, next) => {
   if (command !== "create-user") return next();
   return UserModel.save(payload);
}

const enable = ({command, payload}, next) => {
   if (command !== "enable-user") return next();
   return UserModel.enable(payload.name);
}

const disable = ({command, payload}, next) => {
   if (command !== "disable-user") return next();
   return UserModel.disable(payload.name);
}

const process = (message) => {
   return stack(
      drop,
      create,
      enable,
      disable
   );
}
// send each message to be processed
messages.map(msg => process(msg));
```

what about reuse filters?

```javascript
const processPay = (message) => {
   return stack(
      userExists,
      hasBalance,
      pay
   );
}

const processWithdraw = (message) => {
   return stack(
      userExists,
      hasBalance,
      withdraw
   );
}
```

### Cons

- Depends on the way you configure the chain, can be hard to debug / understand
who changed what in the request;

- Some requests may end up unhandled;

- sometimes you need to go into debug to know the stack's sequence;

- code kept simple but the relation become complex;

## Behavioral Patterns / Command

- Turns a request into a stand-alone object that contains all information
about the request. This transformation lets you parameterize methods with
different requests, delay or queue a request's execution, and support
undoable operations;

```javascript
// using code as usual
orderService.newOrder({
   clientId: 1001,
   items: [
      {id: 1, quantity: 1, price: 1.1},
      {id: 2, quantity: 1, price: 1.2},
      {id: 25, quantity: 10, price: 1.2},
      {id: 1023, quantity: 10, price: 0.3}
   ]
})

// using commands
const message = {
   command: 'new-order',
   params: {
      clientId: 1001,
      items: [
         {id: 1, quantity: 1, price: 1.1},
         {id: 2, quantity: 1, price: 1.2},
         {id: 25, quantity: 10, price: 1.2},
         {id: 1023, quantity: 10, price: 0.3}
      ]
   }
}

newOrderQueue.send(message);
```

### Usage

- Use the Command pattern when you want to parametrize
objects with operations;

- Use the Command pattern when you want to queue operations,
schedule their execution, or execute them remotely;

- Use the Command pattern when you want to implement reversible operations.
Like a sequence of events and you final state is also a compilation
of all those commands;

```javascript
const operations = [
   {user: 1, action: 'deposit', value: 100.0, createdA: 1622139300108},
   {user: 34, action: 'deposit', value: 10000.0, createdA: 1622139300108},
   {user: 63, action: 'deposit', value: 120.0, createdA: 1622139300108},
   {user: 34, action: 'withdraw', value: 130.0, createdA: 1622139300108},
   {user: 85, action: 'deposit', value: 101.0, createdA: 1622139300108},
   {user: 3, action: 'deposit', value: 110.0, createdA: 1622139300108},
   {user: 2, action: 'deposit', value: 20.0, createdA: 1622139300108},
   {user: 1, action: 'deposit', value: 100.0, createdA: 1622139300108},
   {user: 60, action: 'deposit', value: 5.0, createdA: 1622139300108},
   {user: 34, action: 'deposit', value: 12.0, createdA: 1622139300108},
   {user: 1, action: 'withdraw', value: 150.0, createdA: 1622139300108}
]

// we try to process and got an error!
operations.push({user: 1, action: 'withdraw', value: 20.0, createdA: 1622139300108})

//so, we add a compensation to fix the value
operations.push({user: 1, action: 'deposit', value: 20.0, createdA: 1622139300108})

// and then, 
const operations = [
   {user: 1, action: 'deposit', value: 100.0, createdA: 1622139300108},
   {user: 34, action: 'deposit', value: 10000.0, createdA: 1622139300108},
   {user: 63, action: 'deposit', value: 120.0, createdA: 1622139300108},
   {user: 34, action: 'withdraw', value: 130.0, createdA: 1622139300108},
   {user: 85, action: 'deposit', value: 101.0, createdA: 1622139300108},
   {user: 3, action: 'deposit', value: 110.0, createdA: 1622139300108},
   {user: 2, action: 'deposit', value: 20.0, createdA: 1622139300108},
   {user: 1, action: 'deposit', value: 100.0, createdA: 1622139300108},
   {user: 60, action: 'deposit', value: 5.0, createdA: 1622139300108},
   {user: 34, action: 'deposit', value: 12.0, createdA: 1622139300108},
   {user: 1, action: 'withdraw', value: 150.0, createdA: 1622139300108},
   {user: 1, action: 'withdraw', value: 17.46, createdA: 1622139300108}, //<-- error
   {user: 1, action: 'deposit', value: 17.46, createdA: 1622139300108} //<--- compensation
]
// seems to be a document oriented nosql?
```

- use when you need to otimize writing! you need to reprocess all entries to read the current state!

```javascript

const balance = operations.filter(({user}) => user === 1)
   .map(({ action, value }) => action === 'deposit' ? value : value * -1 )
   .sum()

```

- audit-logs system;

```javascript
[
   {user: 1, action: 'create-order', createdA: 1622139300108, 
      action: "{user: 1, action: 'deposit', value: 100.0}"},
   {user: 101, action: 'delete-user', createdA: 1622139300108, 
      action: "{userId: 1000}"},
   {user: 153, action: 'create-user', createdA: 1622139300108, 
      action: "{userId: 100, name: 'banana', email: 'b1@pijamas.org'}"},
   //...
   //...
   {user: 2, action: 'truncate-user', createdA: 1622139300108, 
      action: "trunce users;"},
   //...
   //...
]
```

- does sound like messaging systems, kafka and HyperLogLog?

- do you know flux / redux model?

```javascript
const action = {
   type: "update-user-preference",
   preferences: {
      bgcolor: "#FFF"
      fgcolor: "#000"
      font: {
         size: 12,
         family: "Arial"
      }
   }
}

const reducer = (state, action) => {
   switch (action.type) {
      case "load-user":
         return { ...state, preferences: defaultPreferences }
   // ....
      case "update-user-preference":
         return { ...state, preferences: action.preferences }
   // ...
}
```

### Cons

- The code may become more complicated since you’re introducing a whole new
layer between senders and receivers;

- sender and receiver have to talk using the same contract!

- The code become quite flexibe with all the flexibility's problems;

## Behavioral Patterns / Iterator | what about Generator? |

- Lets you traverse elements of a collection without exposing its underlying
representation (list, stack, tree, etc.);

** Almost all modern languages has `foreach` and that loop already solve the
same problemas that iterator does;

## Usage (Iterator)

- Use the pattern to reduce duplication of the traversal code across your app;

```java
   // old fashion C like for
   List<FileContent> files = listFiles(); 
   for (int i = 0; i < list.size(); i++) {
      FileContent content = files.get(i);
      pushToFTPServer(content);
   }

   // using iterator
   List<FileContent> files = listFiles();
   Iterator<FileContent> it = files.iterator();
   while (it.hasNext()) {
      FileContent content = it.next();
      pushToFTPServer(content);
   }

   // using foreach
   List<FileContent> files = listFiles(); 
   for (FileContent content : files) {
      pushToFTPServer(content);
   }

   // using streams
   listFiles()
      .stream()
      .map(pushToFTPServer); 

```

## Usage (Generator)

- provide values on demand without load everything on memory;

using `yield` if you language supports that!

```javascript
   function* generator() {
      yield 1; // first call stops here
      yield 2; // second call stops here
      yield 3; // third call stops here
      // end of generator (no more items)
   }

   const gen = generator(); // "Generator { }"

   console.log(gen.next().value); // 1
   console.log(gen.next().value); // 2
   console.log(gen.next().value); // 3
``` 

```javascript
   function* infinite() {
      let index = 0;

      while (true) {
         yield index++; // each call stops here and return the index value before its increment!
      }
   }

   const generator = infinite(); // "Generator { }"

   console.log(generator.next().value); // 0
   console.log(generator.next().value); // 1
   console.log(generator.next().value); // 2
```

so what?

```javascript
   function* listAllUsers(limit = 100) {
      const { userCount } = db.findOne('select count(1) as userCount from users;');
      const page = 0;
      const maxPage = userCount / limit;

      while (page < maxPage) {
         yield db.findMany(`select * as userCount from users limit ${limit} offset ${page*limit};`); // stops here
         page++; // run only on next iteration
      }
   }

   const gen = listAllUsers(1); // "Generator { }"

   console.log(gen.next().value); // {id: 1, name: 'b1', email: 'b1@pijamas.com'}
   console.log(gen.next().value); // {id: 2, name: 'b2', email: 'b2@pijamas.com'}
   console.log(gen.next().value); // {id: 3, name: 'batata', email: 'b1@potatoes.com'}
   // you can call until the end of the items or use it on a forEach
```

what about when there are no `yield` operator, like java?

```java
// note that every jdbc implementation is blocking
private Supplier<List<User>> generator(int limit) {
   int page = 0;
   // each call from stream will fire a request for the query
   return () -> {
      ResultSet rs = conn.execute(String.join(" ",
         "select count(1) as userCount from users",
         "limit",
         String.valueOf(limit),
         "page"
         String.valueOf(page++),
         ";"
      );
      return User.from(rs);
   }
}

public Stream<List<User>> listAllUsers(int limit) {
   Integer userCount = conn.execute('select count(1) as userCount from users;').next().get(0);
   // Integer[] possibleCalls = new Integer[userCount / limit];
   return Stream.generate(generator(limit));
}

// usage
listAllUsers(10)
   .map(users -> users.size())
   .forEach(System.out::println);
```

## Creational Patterns / Dependency injection

- the caller class should depends on the abstraction, 
and we can change the behavior changing the setup

- we can use builders to change those dependencies

- we can use factories or config files to setup those classes

- Related with encapsulation and abstractions

- Related with fine/coarse grained functions

- Related with SRP

```java
@Controller
public class UserController {

   @Autowired
   private UserService service;

   //...
}

@Service
public class UserService {

   @Autowired
   private UserRepository repository;

   //...
}

@Repository
public interface UserRepository interface CrudRepository<T, ID extends Serializable>  {

   //...
}
```

- context manager controls and initialize everything! Springboot boot, .net core dependency injection;

- DI scopes (.net | Spring): (transient | prototype), (scoped | request) and singleton;

### Cons

- what about fill what is really needed and keep optional what is nice to have?

```java
@Controller
public class UserController {

   public UserController(@Autowired UserService service) {}

   //...
}

@Service
public class UserService {

   public UserService(@Autowired UserRepository repository) {}

   //...
}
```

- who has the control? Can be hard to understand bugs;

## Structural Patterns / Bridge

- Specification Program Interface e Application Program Interface;

- lets you split a large class or a set of closely related classes into two separate hierarchies—abstraction and implementation which can be developed independently of each other;

- Related with encapsulation and abstractions;

- Related with polymorphism;

### Usage

- Use the Bridge pattern when you want to divide and organize a monolithic class that has several variants of some functionality (for example, if the class can work with various database servers)

- Use the Bridge if you need to be able to switch implementations at runtime

- Defines a specification (set of interfaces / basic implementations) to be implemented for some providers

- Works great with DI

```
            -> Postgres
JDBC SPI :  -> MySQL
            -> Oracle

```


```java
// SPI
public interface Connection {
   ResultSet execute(String sql, Map<String, Object> params);
}

public interface Driver {
   Connection connect(String connectionString);
}

public abstract class ResultSet {
   
   public Boolean hasNext() {
      //...
   };

   public abstract Boolean Next();

   public abstract Boolean getString(Integer position);

   public abstract Boolean getString(String field);

   ///...
}

```

```java
// API oracle (another library / jar file)
public class OracleResultSet extends ResultSet {
   // ...
}

public class OracleConnection implements Connection {
   OracleResultSet execute(String sql, Map<String, Object> params) {}
}

public class OracleDriver implements Driver {
   OracleConnection connect(String connectionString) {}
}

```

```java
// API postgres (another library / jar file)
public class PostgreSQLResultSet extends ResultSet {
   // ...
}

public class PostgreSQLConnection implements Connection {
   PostgreSQLResultSet execute(String sql, Map<String, Object> params) {}
}

public class PostgreSQLDriver implements Driver {
   PostgreSQLConnection connect(String connectionString) {}
}
```

- Looks like template method, but it's  more than that!

- Related with polimorphism;

- Related with abstraction;

- Related with encapsulation;

- Related with SRP on library level;

### Cons

- You might make the code more complicated by applying the pattern to a highly cohesive class;

- high coupled artifacts (SPI and API);

- SPI and projects using it should release in sync;

## Structural Patterns / Facade

- hides complexity and internal structure;

- provides a simplified interface to a library, a framework, or any other complex set of classes;

- structures a subsystem into layers;

### Usage

- When you have a lot of classes / artifacts, but want to expose only few for the clients;

- When you want to provide a simpler interface than what an existing subsystem already provides;

- When you want to create a single point of contact with your callers;

```java
public class CreditFacade {

   public Boolean hasCredit(User user, BigDecimal value) {
      // hides a lot of calls and dependencies to manage a request
      // user services
      // risk management services
      // credit services
      // financial services
   }

}

// client calling the feature

User user = User.from(request.body);
BigDecimal value = Value.from(request.body);
Boolean canOrder = CreditFacade.getInstance().hasCredit(user, value);
```

- When you want to structure your system into layers. You can expose olny facade for any client (developer / external modules);

Directory structure for User module:

```
├── repositories
├── controllers
└── services
└── UserFacade.java
```

### Cons

- A facade can become a god object coupled to all classes of an app;

- Be careful to not give more responsabilities than needed (like business logic on facade);

## Creational Patterns / Object pool

- (also known as resource pools);

- reuses what is scarce;

- restricts the number of objects created;

- free (already used) resources can be managed by one coherent policy;

Database connection example (db connections are limited):

```yaml
db-connection:
   pool:
      min-connections: 4 #ready connections on startup
      max-connections: 10 #max opened connections
      idle-timeout: 30000 # 30 seconds to kill/invalidate an idle connection
```

- can we use resource pool to control a set of phisical devices (smart phones running tests for example)?

- can we use to hack api-key limit ratio?

- can we use to reach homogeneous sharding distribution?

- can we use to control remote agents (like jenkins agents for example)?

- what we do when there is no more resources? Throw error or enqueue?

## Pull (Load balancing vs Resource Pool) vs push model (messaging)

- client need do use a resource:
   - load balancing: client ask for resource and LB hides complexity (separation for concerns between applications);
   - resource pool: client ask for resource and resource pool hides complexity (all running inside your application);
   - messaging: client send a command inside a message;


## Creational Patterns / Prototype

- A fully initialized instance to be copied or cloned

- reuse what is expensive to load

- what about concurrence?

- lets you copy existing objects without making your code dependent
on their classes (let's clone)

- you can clone objects without coupling to their concrete
classes

- deep copy vs shallow copy

### Usage

- use the Prototype pattern when your code shouldn’t depend on the
concrete classes of objects that you need to copy

```java

public class ExporterFactory {

   //..

   public Exporter create(String type) {
      if (type.equals("xml")) return new XMLExporter();
      if (type.equals("json")) return new JSONExporter();
      if (type.equals("txt")) return new TXTExporter();
      throw new RuntimeException("Couldnt find type " + type);
   }

}

// usage
Exporter exporter = ExporterFactory.create("xml");
exporter.export(orders);
//..

// dozen of lines later

// for some reason need to pass a new instance
new ReportEngine(ExporterFactory.create("xml")); // what about I dont know the concrete type

new ReportEngine(exporter.clone()); // work even I dont know the concrete type

```

- use when you have resources that can be expensive to load but cheap to clone or non safe for concurency

```java
public class ComposeableValidator {

   private List<Validator> nonThreadSafeValidators;

   public ComposeableValidator() {
      this.nonThreadSafeValidators = new LinkedList();
   }

   private ComposeableValidator(List<Validator> validators) {
      this.nonThreadSafeValidators = validators;
   }

   public void compose(Validator validator) {
      this.nonThreadSafeValidators.add(validator);
   }

   @Override
   // deep copy!
   public clone() {
      return new ComposeableValidator(
         this.nonThreadSafeValidators.stream()
            .map(p -> p.clone())
            .collect(Collectiors.asList())
      );
   }

   ///... lot of methods

}

```

### Cons

- cloning complex objects that have circular references might be very tricky

- be careful about concurrence

### Prototype Registry

- provides an easy way to access frequently-used prototypes.
It stores a set of pre-built objects that are ready to be copied.
The simplest prototype registry is a name → prototype hash map.
However, if you need better search criteria than a simple name,
you can build a much more robust version of the registry

```java
// using class to search
public class PrototypeRegistry {

   private static Map<Class<?>, Object> protos = new HashMap<>();

   public static <T> T registryProto(Class<T> type, Supplier<T> supplier) {
      Object proto = protos.get(type);
      if (Objects.isNull(proto)) {
         // not found? instantiate a new one using supplier
         protos.put(type, supplier.get());   
      }
      return type.cast(proto);
   }

   public static <T> T registryProto(Class<T> type, T value) {
      return registryProto(type, () -> value);
   }

   public static <T> T getProto(Class<T> type) {
      return type.cast(protos.get(type)).clone();
   }
}

// registry

UserController controller = new UserController(); // 0x1000000
UserService service = new UserService(); // 0x2000000
PrototypeRegistry.registryProto(UserController.class, controller);
PrototypeRegistry.registryProto(UserService.class, () -> service);

// consuming

UserService service = PrototypeRegistry.getProto(UserService.class); // 0x1000001
UserController controller = PrototypeRegistry.getProto(UserController.class); // 0x2000001

PrototypeRegistry.getProto(UserClient.class); // null

```

- what about compose registry with factories?

```java
UserApplicationFactory factory = UserApplicationFactory.getInstance();
PrototypeRegistry.registryProto(UserApplication.class, () -> factory.create('json'));
```

- what about compose builders with prototypes?

```java
public class DeviceControllerBuilder {

   //...

   public DeviceControllerBuilder withDeviceModel(BIOS bios) {
      this.bios = bios;
   }

   public DeviceControllerBuilder withDeviceModel(Model model) {
      this.model = model;
   }

   public DeviceController fillCustomizedFields(DeviceController controller) {
      DeviceController clone = controller.clone();
      if (Objects.nonNull(this.model)) controller.setModel(this.model);
      if (Objects.nonNull(this.BIOS)) controller.setBIOS(this.BIOS);
      //...
      return clone;
   }

   public DeviceController build() {
      DeviceController controller = PrototypeRegistry.getProto(DeviceController.class);
      return this.fillCustomizedFields(controller);
   }

}
```


## Structural Patterns / Flyweight

- lets you fit more objects into the available amount of RAM by sharing common
  parts of state between multiple objects instead of keeping all of the data in
  each object

- A fine-grained instance used for efficient sharing

### Usage

- Reuse / share expensive resources

- Be careful about mutations

```java
public class ApplicationConfig {
   
   // expensive to load or to keep in memory
   private DeviceDriver driver = DeviceDriver.newInstance();

   // expensive to load or to keep in memory
   private DBConnection connection = DBConnection.newInstance();

   public Statement newStatement() {
      return connection.preparedStatement();
   }

   public DeviceChannel newDeviceChannel() {
      return driver.createChannel();
   }

   ///... 

}

//usage 

DeviceChannel channel = ApplicationConfig.getInstance().newDeviceChannel();
channel.send("device command!");

```

### Cons

- Can lead to complexity to reuse the expensive objects

- Can lead to race conditions if the shared state are mutable

- Can increase the time to the expensive resource be garbage collected

## Prototype vs Flyweight

- In Flyweight, object is immutable;

- In Prototype, object is mutable;

- Flyweight is about saving memory by not creating new objects and reusing existing ones when possible;

- Prototype is about, reusing existing object in order to save cost of new object creation;

- Flyweight is used when creating multiple type of single object;

- Prototype is used when creating single type of single object.

## Object Pool vs Flyweight

- object pool keep a set of objects (same type) and rotate between them (for concurrency reasons, maybe);

- flyweight should keep a single instance for an object to perform better! (should be immutable and thread-safe);

## Behavioral Patterns / Visitor

- Lets you separate algorithms from the objects on which they operate;

- Or lets coordenate some calls for an object;

- Or lets add behavior on a final or third-library class;

### Usage

- Use the Visitor when you need to perform an operation on all elements
of a complex object structure (for example, an object tree).

- use when need to extend classes, but you can't change the source code.

### Cons

- Visitors might lack the necessary access to the private fields and methods
of the elements that they’re supposed to work with.

## Behavioral Patterns / Mediator

- Lets you reduce chaotic dependencies between objects. The pattern restricts
direct communications between the objects and forces them to collaborate only
via a mediator object.

- mediator or orchestration?

### Usage

- Use the pattern when you can’t reuse a component in a differ- ent program
because it’s too dependent on other components.

### Cons

- Complexity! Giant methods / functions, god classes, a lot of coupling.

## Behavioral Patterns / Memento

- Lets you save and restore the previous state of an object without revealing
the details of its implementation.

### Usage

- Use the Memento pattern when you want to produce snapshots of the object’s
state to be able to restore a previous state of the object.

- what about keep track only over the diff intead of the entire object?

### Cons

- The app might consume lots of RAM if clients create mementos too often.

## Behavioral Patterns / State

- Lets an object alter its behavior when its internal state changes. It appears
as if the object changed its class

- Finite-State Machine

### Usage

- Use the pattern when you have a class polluted with massive conditionals
that alter how the class behaves according to the current values of the class’s fields

### Cons

- Applying the pattern can be overkill if a state machine has only a few states
or rarely changes
