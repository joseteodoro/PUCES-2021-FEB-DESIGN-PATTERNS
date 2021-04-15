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
