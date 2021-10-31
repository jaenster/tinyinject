# Injection

There are a lot of dependency injection libs around, but they all require to have classes with constructors.

But why? Some injection can be done with a single decorator and is good for allot use cases

# Example

```typescript
import {Ti} from "tinyinject";
class Bar {
    barMethod() {
        // (...)
    }
}
class Foo {
    @Ti()
    bar: Bar;
    
    fooMethod() {
        return this.bar.barMethod()
    }
}

const foo = new Foo();
foo.bar.barMethod();
```

- Fully sync
- No `@Injectable` or something alike needed
- No constructor
- Abstract classes possible
- Work in any class you desire it e.g. in models

# Abstract classes
In other libs all injection is done within the constructor. This prevents the user to add later on in development to add a decency, as all child's super calls need to change.

```typescript

type Ctor<T=any> = (new(...[])=>T);

abstract class Model<T> {
    abstract service: Service<T>;
}

abstract class Service<T> {
    protected abstract model: Ctor<T>
    getNew(): T {
        return new this.model();
    }
}

class FooService extends Service<Foo> {
    protected model = Foo;
}

class Foo extends Model<Foo> {
    @Ti() service: FooService;
}
```

Now it's so easy to just add a dependency in a super class without needing to change any of the children 