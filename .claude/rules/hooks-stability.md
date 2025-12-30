# React Hooks Stability Patterns

## Preventing Infinite Re-renders

Infinite re-render loops occur when useCallback/useEffect dependencies have unstable references.

### Problem Patterns

```typescript
// BAD: Inline objects cause infinite loops
useEffect(() => {
  loadData(config)
}, [config]) // config recreated each render

// BAD: Unstable context values
const toast = useToast()
const loadData = useCallback(async () => {
  toast.error('Failed')
}, [toast]) // toast changes identity
```

### Solutions

#### 1. Stabilize Objects with useMemo

```typescript
const stableConfig = useMemo(
  () => ({ page, perPage }),
  [page, perPage]
)

useEffect(() => {
  loadData(stableConfig)
}, [stableConfig])
```

#### 2. Destructure Context Functions

```typescript
// GOOD: Individual functions should be stable
const { success: toastSuccess } = useToast()
const handleSubmit = useCallback(() => {
  toastSuccess('Done')
}, [toastSuccess])
```

#### 3. useRef for Non-Reactive Values

```typescript
const onSuccessRef = useRef(onSuccess)
onSuccessRef.current = onSuccess

useEffect(() => {
  api.fetch().then(() => onSuccessRef.current?.())
}, []) // Empty deps
```

### Safe Patterns

```typescript
// Primitive values - always safe
useEffect(() => { ... }, [isLoading, count, name])

// useState setters - always stable
const [data, setData] = useState([])
useEffect(() => { setData(newData) }, [setData])
```
