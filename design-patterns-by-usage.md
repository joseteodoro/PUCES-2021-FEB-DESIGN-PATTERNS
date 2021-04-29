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

## Structural Patterns / Decorator

- lets you attach new behaviors to objects by placing these objects inside special wrapper objects that contain the behaviors.

- additional behavior to extend some existent behavior (even your code or third party libraries)

- compose behavior from smaller pieces

#### Usage

- You can't change a third-party code but need to append behaviors

- You need to combine various behaviors having basic ones

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
      return String.join('', '<p>', this.content, '</p>');
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


#### Cons

- It’s hard to implement a decorator in such a way that its behavior
doesn’t depend on the order in the decorators stack.

- The initial configuration code of layers might look pretty ugly.

What if...

```java
class Element implements Supplier<T> {
   
   String tag;
   Supplier<String> element;

   private Element(String tag, Supplier<String> element) {
      this.tag = tag;
      this.element = element;
   }

   public static from(String tag, Supplier<String> element) {
      return new Element(tag, element)
   }
}

@FunctionalInterface
class abstract ParentElement implements Supplier<T> {

   public String get() {
      Element element = this.evaluate();
      return String.join("",
         "<" , element.tag, ">", element.get(), "</" , element.tag, ">"
      );
   }

   public abstract Element evaluate();
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

complex.evaluate().equals("<em><b><i><p>my paragraph</p></i></b></em>");

Element simple = Element.from("p", () -> content);
e.evaluate().equals("<p>my paragraph</p>");

// or

Supplier<String> complex = Arrays.asList("em", "b", "i", "p").stream()
   .reducing(() -> content, (sup, tag) -> Element.from(tag, sup));

complex.evaluate().equals("<p><i><b><em>my paragraph</em></b></i></p>");

// what's wrong? became reversed cause we reduce from left to right!

List<String> tags = Arrays.asList("em", "b", "i", "p");
Supplier<String> complex = Collections.reverse(tags)
   .stream()
   .reducing(() -> content, (sup, tag) -> Element.from(tag, sup));

complex.evaluate().equals("<em><b><i><p>my paragraph</p></i></b></em>");

List<String> tags = Arrays.asList("em", "b", "i", "strong", "potato", "banana", "custom", "p");
Supplier<String> complex = Collections.reverse(tags)
   .stream()
   .reducing(() -> content, (sup, tag) -> Element.from(tag, sup));

// does make sense code the list already reversed?
// ["p" , "custom", "banana", "potato", "strong", "i", "b", "em"]

```

## Behavioral Patterns / Observer

- Lets you define a subscription mechanism to notify multiple objects 
about any events that happen to the object they're observing.

- some examples, pubsub, queues, event listeners, pipes;

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

What about a event bus for the entire system? We could decouple components using messages.

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
