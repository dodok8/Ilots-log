<script lang="ts">
	let { children } = $props();
	import { page } from '$app/state';
	import 'normalize.css';
	import '../app.css';
</script>

<nav>
	<ul>
		<li aria-current={page.url.pathname === '/' ? 'page' : undefined}>
			<a href="/">Home</a>
		</li>
		<li aria-current={page.url.pathname === '/best' ? 'page' : undefined}>
			<a href="/best">Best</a>
		</li>
		<li aria-current={page.url.pathname.startsWith('/log') ? 'page' : undefined}>
			<a href="/scores">Scores</a>
		</li>
	</ul>
</nav>

<main>
	{@render children()}
</main>
