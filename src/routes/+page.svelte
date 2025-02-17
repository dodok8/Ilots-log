<script lang="ts">
	import { scores } from '$lib/states/score.svelte';
</script>

<div class="search-container">
	<h1>Avg.: {scores.best30Average}</h1>
</div>
