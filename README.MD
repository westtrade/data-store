# DataStore for svelte

## Example

```js
const DataStore = require('@westtrade/data-store')

const someStore = new DataStore(() =>
	fetch('http://some-api.js/api.json').then(res => res.json())
)

someStore.sync()

module.exports = someStore
```

```svelte
<script>
	import someStore from './someStore'
</script>

{#if $someStore.loading}
<div>
	Loading...
</div>
{: else}
<pre>
    { JSON.stringify($someStore) }
</pre>
{/if}
```
