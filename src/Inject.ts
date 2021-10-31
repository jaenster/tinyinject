import 'reflect-metadata'

const classInstances = new WeakMap();
const weakSet = new WeakSet();

export function TinyInject({type}: { type: any | undefined } = {type: undefined}) {
    return function (target: any, propertyKey: string) {
        type ||= Reflect.getMetadata("design:type", target, propertyKey);

        let cache: any;
        Object.defineProperty(target, propertyKey, {
            get() {
                const clazz = Object.getPrototypeOf(this).constructor;
                if (!weakSet.has(clazz)) weakSet.add(clazz) && classInstances.set(clazz, this);
                if (cache) return cache;
                const isClass = typeof type === 'function' && type?.prototype?.constructor === type;
                const ctor = isClass ? type : type();
                if (weakSet.has(ctor)) return cache = classInstances.get(ctor);
                weakSet.add(ctor)
                classInstances.set(ctor, cache = new ctor);
                return cache;
            },
            set(v) {
                this[propertyKey] = v;
            },
        });
    };
}

export type Wrapped<T> = T