# Frequently used hooks for React

## Install

```
npm i @trp.alfa/utils
```

```
yarn add @trp.alfa/utils
```

## useDebounce (with lodash)

```javascript
import { useDebounce } from 'libs/utils/dist/index'
```

```javascript
const log = useDebounce((params) => console.log(params), 1000);

log("123")
```

## useThrottle (with lodash)

```javascript
import { useThrottle } from '@trp.alfa/utils'
```

```javascript
const log = useThrottle((params) => console.log(params), 1000);

log("123")
```

## usePortraitDetect

```javascript
import { usePortraitDetect } from '@trp.alfa/utils'
```

```javascript
const isPortrait = usePortraitDetect()
```

## useOnlineDetect

```javascript
import { useOnlineDetect } from '@trp.alfa/utils'
```

```javascript
const isOnline = useOnlineDetect()
```

## useSizeDetect

```javascript
import { useSizeDetect } from '@trp.alfa/utils'
```

```javascript
const {
  clientHeight,
  clientWidth,
  innerHeight,
  innerWidth
} = useSizeDetect()
```

## useKeyPressDetect

```javascript
import { useKeyPressDetect } from '@trp.alfa/utils'
```

```javascript
const isKeyFPressed = useKeyPressDetect("f")
```

## useClickOutside

```javascript
import { useClickOutside } from '@trp.alfa/utils'
```

```javascript
const ref = useRef()
useClickOutside(ref, () => {
})
```

## useOnKeyPress

```javascript
import { useOnKeyPress } from '@trp.alfa/utils'
```

```javascript
const callback = useCallback(() => {
  // i use toLowerCase() in code, so it doesn't matter, if you use 'Enter' or 'enter'
  console.log('npm.piece')
}, [])

useOnKeyPress(callback, 'Enter')
```

## useInterval

```javascript
import { useInterval } from '@trp.alfa/utils'
```

```javascript
useInterval(() => {
}, 1000);
```

## useTimeout

```javascript
import { useTimeout } from '@trp.alfa/utils'
```

```javascript
useTimeout(() => {
}, 1000);
```

## useFocus

```javascript
import { useFocus } from '@trp.alfa/utils'
```

```jsx
const checkViewPortRef = useRef < HTMLDivElement > (null);
const setFocus = useFocus(ref)

useEffect(() => {
  setFocus()
}, [])

return <input ref={htmlElRef} />
```

## useIsVisibleElement

```javascript
import { useIsVisibleElement } from '@trp.alfa/utils'
```

```jsx
const checkViewPortRef = useRef < HTMLDivElement > (null);
const isInViewPort = useIntersection(checkViewPortRef);

return <div ref={checkViewPortRef} />
```

## useEffectWithoutFirstCall

```javascript
import { useEffectWithoutFirstCall } from '@trp.alfa/utils'
```

```javascript
useEffectWithoutFirstCall(() => {
}, []);
```

## CustomServiceInjector

#### The Service Injector component is designed to inject custom hooks containing useEffect, to your application without calling re-render of child components.

```javascript
import { ServiceInjector } from '@trp.alfa/utils'
```

```tsx
<ServiceInjector
  services={[condition.service, mobile.service]}
/>
```

## ErrorBoundary

```javascript
import { ErrorBoundary } from '@trp.alfa/utils'
```

```tsx
<ErrorBoundary errorComponent={<h1>error</h1>}>
    <div/>
</ErrorBoundary>
```

## ArrayRender

#### This component is a generic component for displaying an array of elements. Instead of just using map to convert an array of elements into JSX elements, the ArrayRender component takes an array of items and a renderItem function and processes them internally. The main purpose of this component is to simplify repetitive code when displaying a list of items and keep the code clean and modular.

```javascript
import { ArrayRender } from '@trp.alfa/utils'
```

```tsx
<ArrayRender items={items} renderItem={(item) => <itemTemplate key />} />
```

## deepClone

```javascript
import { deepClone } from '@trp.alfa/utils'
```

```javascript
const newObj = deepClone({ name: 'npm.piece' })
```

## MergeObjects

```javascript
import { mergeObjects } from '@trp.alfa/utils'
```

```javascript
const a = {
  name: 'npm.piece',
  location: {
    city: 'City 17'
  }
}

const b = {
  age: 18,
  location: {
    flat: 'H15'
  }
}

const c = {
  price: 100
}


const d = mergeObjects(a, b, c)
// d will be:
const d = {
  name: 'npm.piece',
  age: 18,
  price: 100,
  location: {
    city: 'City 17',
    flat: 'H15'
  }
}
```

## setToSessionStorage / setToLocalStorage / getFromSessionStorage / getFromLocalStorage

```javascript
import {
  setToSessionStorage,
  setToLocalStorage,
  getFromSessionStorage,
  getFromLocalStorage
} from '@trp.alfa/utils'
```

```javascript
  setToSessionStorage('token', { age: 100 })
  setToLocalStorage('token', { age: 100 }),
  getFromSessionStorage('token'),
  getFromLocalStorage('token')
```

## Micro-Frontend Events

<a href="https://www.npmjs.com/package/@trp.alfa/event-bus">moved to event-bus</a>

## IndexedDB (with idb)

```javascript
import { IndexedDB } from '@trp.alfa/utils'
```

```tsx
useEffect(() => {
  const runIndexDb = async () => {
    const idb = new IndexedDB('test')
    //if you need to delete database, add new version number for second argument
    await idb.createObjectStore(['languages', 'students'], 1)
    await idb.putValue('languages', { name: 'JavaScript' })
    await idb.putBulkValue('languages', [
      { name: 'TypeScript' },
      { name: 'C#' }
    ])
    await idb.getValue('languages', 1)
    await idb.getAllValue('languages')
    await idb.deleteValue('languages', 1)
  }
  runIndexDb()
}, [])
```

## createQueryParams

```javascript
import { createQueryParams } from '@trp.alfa/utils'
```

```tsx
createQueryParams({ page: 1, size:10 })
```

## useQueryParams

```javascript
import { useQueryParams } from '@trp.alfa/utils'
```

```tsx
const params = useQueryParams()
```

## useAppNavigate

```javascript
import { useAppNavigate } from '@trp.alfa/utils'
```

```tsx
const navigate = useAppNavigate()
```
