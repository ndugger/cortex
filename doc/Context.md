[<- Back](../readme.md)

### Context
Cortex components may hook into data stores in the form of context. This context is local to the branch in which it resides.

```typescript
interface App {
    name: string
}

class AppContext extends Cortex.Context<App> {
    value = {
        name: 'default_value'
    }
}
```

```typescript
class Page extends Cortex.Component {

    public name?: string;

    public render(): Cortex.Element[] {
        const app = this.getContext(AppContext)

        return [
            <HTMLElement tag='strong'>
                hello { this?.name }
            </HTMLElement>,
            <HTMLElement tag='em'>
                welcome to { app?.name }
            </HTMLElement>
        ]
    }
}
```

```typescript
class Root extends Cortex.Component {

    public render(): Cortex.Element[] {
        const app = { 
            name: 'demo' 
        }

        return [
            <AppContext value={ app }>
                <Page/>
            </AppContext>
        ]
    }
}
```