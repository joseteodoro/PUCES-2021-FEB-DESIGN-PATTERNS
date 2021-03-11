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

## Open closed Principle:

Open to extension, but closed to changes;

Of course, is open to bug fix, but it's close to change behavior already used for some artifact; (avoid IFs inside already existent code!)

New features should extend the previous one, not change that one!

Related witn SRP;

Related with encapsulation;

Related with abstraction;

## Liskov Substitution Principle:

Strong typed languages check that by default, but that's about keep the contract when abstracting something;

Honor the contract, honor the abstraction rules!
Exceptions, outputs, inputs, signature, keep them consistent!

## ISP - Interface Segregation Principle:

Related with SRP, an interface should be specific for something;

## Dependency Inversion Principle:

Related with encapsulation and abstractions;

Related with fine/coarse grained functions;

Related with SRP;


