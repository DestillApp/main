# MyAccountPage

## Exposed Methods

### `function()`
Handles window resize event to update tablet view state.

```ts
const handleResize = (): void => {
      isTabletView.value = window.innerWidth <= 1024;
    };
```
