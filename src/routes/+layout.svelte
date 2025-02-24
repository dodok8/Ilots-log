<script lang="ts">
	let { children } = $props();

	import 'normalize.css';
	import '../app.css';
	import Header from './Header.svelte';
	import { onMount } from 'svelte';
	import { DriveService } from '$lib/services/drive';

	onMount(async () => {
		try {
			const driveService = DriveService.getInstance();
			await driveService.initialize();
		} catch (error) {
			console.error('Failed to initialize Drive service:', error);
		}
	});
</script>

<nav>
	<Header />
</nav>

<main>
	{@render children()}
</main>

<style>
	nav {
		position: sticky;
		top: 0;
		z-index: 100;
	}

	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem; /* top/bottom padding 제거 */
	}
</style>
