# Types for fast coding with React

## Install

```
npm i @infinityloop.labs/types -D
```

```
yarn add @infinityloop.labs/types -D
```
## Create .d.ts file in src folder and import types
```
/// <reference types="@infinityloop.labs/types/global" />
```

```
/// <reference types="@infinityloop.labs/types/frontend" />
```

```
/// <reference types="@infinityloop.labs/types/backend" />
```

### Global Types:
```typescript
type Nullable<T> = T | null | undefined

type Callback<Value = void | unknown, ReturnType = void> = (
  value: Value
) => ReturnType

type UnknownCallback = (...args: any[]) => any
```

### Frontend Types:
```typescript
// Function Component
type FC<T = {}> = FunctionComponent<T & ChildrenType>

// Container Component
type CC<T = {}> = () => T

// Service Component
type SC = () => void

type ImportedMF<T = {}> = FC<T & MFPropsType>
```
