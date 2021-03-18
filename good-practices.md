# Good design principles

Following the principles will lead to SOLID and design patterns;

## DRY

We saw that! Don't Repeat Yourself!

## KISS

We saw that! Keep It Simple!

## Encapsulate what varies

Related with same grain code;

Promotes abstractions;

Promotes polymorphism;

Minimize bug from future changes;

## Code for contracts (interfaces, abstract types, traits) not implementations

Abstractions enables substitution and polymorphism;

Abstractions enables keep changes isolated;

Abstraction needs encapsulation;

## Composition over inheritance

Potentialize reuse;

Reduce coupled connections;

Related with single responsability principle;

# SOLID

## SRP - single responsability principle:

An artifact does one and only one thing;

Related with decoupling artifacts;

Related with abstraction;

Related with keep what changes isolated;

The bad!

```
class AreaCalculator {
    areaBy (shape) {
        if (shape instanceof Square)) {
            return Math.pow(shape.length, 2);
        }
        if (shape instanceof Circle)) {
            return pi() * Math.pow(shape.radius, 2);
        }
    }

    sum (shapes = []) {
        return shapes.map(shape => this.areaBy(shape))
            .reduce((last, actual) => last + actual)
    }
}
```

A bit better!

```
class AreaCalculator {
    sum (shapes = []) {
        return shapes.map(shape => shape.area()))
            .reduce((last, actual) => last + actual)
    }
}
```

## Open closed Principle:

Open to extension, but closed to changes;

Of course, is open to bug fix, but it's close to change behavior already used for some artifact; (avoid IFs inside already existent code!)

New features should extend the previous one, not change that one!

Related witn SRP;

Related with encapsulation;

Related with abstraction;

The bad, again!

```
class AreaCalculator {
    areaBy (shape) {
        if (shape instanceof Square)) {
            return Math.pow(shape.length, 2);
        }
        if (shape instanceof Circle)) {
            return pi() * Math.pow(shape.radius, 2);
        }
    }

    sum (shapes = []) {
        return shapes.map(shape => this.areaBy(shape))
            .reduce((last, actual) => last + actual)
    }
}
```

what if you want to add a shape `line`, `triangle`, `pentagon`?

Still the same, cause we add more shape elements and extend them, not the calculator

```
class AreaCalculator {
    sum (shapes = []) {
        return shapes.map(shape => shape.area()))
            .reduce((last, actual) => last + actual)
    }
}
```

## Liskov Substitution Principle:

Strong typed languages check that by default, but that's about keep the contract when abstracting something;

Honor the contract, honor the abstraction rules!
Exceptions, outputs, inputs, signature, keep them consistent!

```
class AreaCalculator {
    sum (shapes = []) {
        return shapes.map(shape => shape.area())) <---- area() always return a float
            .reduce((last, actual) => last + actual)
    }
}
```

Keep the contract!

## ISP - Interface Segregation Principle:

Related with SRP, an interface should be specific for something;

The bad!

```
public class MouseEventDemo implements MouseListener {

    public void mousePressed(MouseEvent e) {
       //nothing here
    }

    public void mouseReleased(MouseEvent e) {
       //nothing here
    }

    public void mouseEntered(MouseEvent e) {
       //nothing here
    }

    public void mouseExited(MouseEvent e) {
       //nothing here
    }

    public void mouseClicked(MouseEvent e) {
       saveMyRecord();
    }

}
```

Bit better

```
public class MouseClickDemo implements MouseClickListener {

    public void mouseClicked(MouseEvent e) {
       saveMyRecord();
    }

}
```

```
public class MouseMoveDemo implements MouseMoveListener {

    public void mouseEntered(MouseEvent e) {
       show();
    }

    public void mouseExited(MouseEvent e) {
       fade();
    }

}
```

## Dependency Inversion Principle:

Related with encapsulation and abstractions;

Related with fine/coarse grained functions;

Related with SRP;

```
class DbConnection {

    static getInstance() {
        return new DbConnection()
    }

    ...
}
```

```
class UserController {

    save (user) {
        DbConnection.getInstance().save(user)
    }

}

class ProductController {

    save (product) {
        DbConnection.getInstance().save(product)
    }

}
```

or

```
class ProductController {

    constructor(dbConnection) {
        this.dbConnection = dbConnection
    }

    save (product) {
        dbConnection.save(product)
    }

}

```

## Anemic Model

non anemic

```
class User {

    constructor(id, name, password) {
        this.id = id
        this.name = name
        this.password = password
    }

    save () {
        DbConnection.getInstance().save(this)
    }

}
```

anemic

```
class User {

    constructor(id, name, password) {
        this.id = id
        this.name = name
        this.password = password
    }
}

class UserController {

    save (user) {
        DbConnection.getInstance().save(this)
    }

}
```
