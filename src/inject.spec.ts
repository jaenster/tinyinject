import {Ti, Wrapped} from "./index";

describe('inject spec', function () {

    test('singular test', function () {

        const flow = [];

        class Bar {

            constructor() {
                flow.push('constructed Bar');
            }

            barMethod() {
                flow.push('called barMethod');
                return 'string';
            }


        }

        class Foo {
            @Ti()
            bar: Bar;

            constructor() {
                flow.push('constructed Foo')
            }

            fooMethod() {
                flow.push('called fooMethod');
                return this.bar.barMethod()
            }

        }


        const string = (new Foo()).fooMethod();
        expect(string).toBeDefined();
        expect(string).toHaveProperty('length');
        expect(string).toHaveLength(6);
        expect(string).toBe('string');

        expect(flow).toHaveLength(4);
        expect(flow[0]).toBe('constructed Foo');
        expect(flow[1]).toBe('called fooMethod');
        expect(flow[2]).toBe('constructed Bar');
        expect(flow[3]).toBe('called barMethod');
    });

    test('recursive test', function () {

        const flow = [];

        class Bar {

            // Upon transpiling the
            @Ti({type: () => Foo})
            foo: Wrapped<Foo>;

            constructor() {
                flow.push('constructed Bar');
            }

            barMethod() {
                flow.push('called barMethod');
                return this.foo.fooString();
            }

        }

        class Foo {
            @Ti()
            bar: Bar;

            constructor() {
                flow.push('constructed Foo')
            }

            fooMethod() {
                flow.push('called fooMethod');
                return this.bar.barMethod()
            }

            fooString() {
                flow.push('called fooString');
                return 'string';
            }
        }


        const string = (new Foo()).fooMethod();
        expect(string).toBeDefined();
        expect(string).toHaveProperty('length');
        expect(string).toHaveLength(6);
        expect(string).toBe('string');

        expect(flow).toHaveLength(5);
        expect(flow[0]).toBe('constructed Foo');
        expect(flow[1]).toBe('called fooMethod');
        expect(flow[2]).toBe('constructed Bar');
        expect(flow[3]).toBe('called barMethod');
        expect(flow[4]).toBe('called fooString');
    });

    it('abstraction test', function () {

        const flow = [];

        class Bar {

            // Upon transpiling the
            @Ti({type: () => Foo})
            foo: Wrapped<Foo>;

            constructor() {
                flow.push('constructed Bar');
            }

            barMethod() {
                flow.push('called barMethod');
                return this.foo.fooString();
            }

        }

        abstract class Foo2 {
            constructor() {
                flow.push('constructed Foo2')
            }

            @Ti()
            bar2: Bar;
        }

        class Foo extends Foo2 {

            constructor() {
                super()
                flow.push('constructed Foo');
            }


            @Ti()
            bar: Bar;

            fooMethod() {
                flow.push('called fooMethod');
                return this.bar2.barMethod() && this.bar.barMethod();
            }

            fooString() {
                flow.push('called fooString');
                return 'string';
            }
        }

        const foo = new Foo();
        const string = (foo).fooMethod();
        expect(foo.bar).toBe(foo.bar2);
        expect(foo.bar.foo).toBe(foo.bar2.foo);
        const actualFoo = foo.bar.foo;
        expect(actualFoo === foo).toBeTruthy();


        expect(string).toBeDefined();
        expect(string).toHaveProperty('length');
        expect(string).toHaveLength(6);
        expect(string).toBe('string');

        expect(flow).toHaveLength(8);
        expect(flow[0]).toBe('constructed Foo2');
        expect(flow[1]).toBe('constructed Foo');
        expect(flow[2]).toBe('called fooMethod');
        expect(flow[3]).toBe('constructed Bar');
        expect(flow[4]).toBe('called barMethod');
        expect(flow[5]).toBe('called fooString');
        expect(flow[6]).toBe('called barMethod');
        expect(flow[7]).toBe('called fooString');
    })
});