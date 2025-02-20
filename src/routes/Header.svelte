<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="header">
	<h1><a href="/">ilot's Log</a></h1>
	<ul>
		<li aria-current={page.url.pathname === '/best' ? 'page' : undefined}>
			<a href="/best">Best</a>
		</li>
		<li aria-current={page.url.pathname === '/report' ? 'page' : undefined}>
			<a href="/report">Report</a>
		</li>
		<li aria-current={page.url.pathname === '/scores' ? 'page' : undefined}>
			<a href="/scores">Scores</a>
		</li>
	</ul>
	<a
		href="/backup"
		class="cloud-btn"
		aria-label="cloud save button"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
			/>
		</svg>
	</a>
</div>

<style>
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 2rem;
		height: 4rem;
		background-color: #ffffff;
		box-shadow:
			0 2px 4px rgba(0, 162, 255, 0.1),
			0 4px 12px rgba(0, 162, 255, 0.05);
	}

	h1 {
		margin: 0;
		flex-shrink: 1; /* 추가: 필요시 축소 허용 */
		min-width: 0; /* 추가: 오버플로우 방지 */
	}

	h1 a {
		font-size: clamp(1.125rem, 4vw, 1.5rem); /* 수정: 반응형 폰트 크기 */
		color: #2c3e50;
		text-decoration: none;
		white-space: nowrap; /* 추가: 줄바꿈 방지 */
		overflow: hidden; /* 추가: 오버플로우 숨김 */
		text-overflow: ellipsis; /* 추가: 말줄임표 표시 */
		display: block; /* 추가: 블록 레벨 요소로 변경 */
	}

	ul {
		display: flex;
		gap: 2rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li a {
		text-decoration: none;
		color: #4a5568;
		font-weight: 500;
		transition: all 0.2s ease;
		padding-bottom: 0.25rem;
		position: relative;
	}

	li a:hover {
		color: #2c3e50;
	}

	li a:hover::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(90deg, rgba(0, 162, 255, 0.2), rgba(0, 162, 255, 0.6));
	}

	li[aria-current='page'] a {
		color: #2c3e50;
	}

	li[aria-current='page'] a::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(90deg, rgba(0, 162, 255, 0.4), rgba(0, 162, 255, 0.8));
	}

	.cloud-btn {
		color: #4a5568;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 8px;
	}

	.cloud-btn:hover {
		color: #2c3e50;
		background: linear-gradient(135deg, rgba(0, 162, 255, 0.05), rgba(0, 162, 255, 0.1));
	}

	.size-6 {
		width: 24px;
		height: 24px;
	}

	@media (max-width: 640px) {
		.header {
			padding: 0 1rem; /* 추가: 모바일에서 패딩 축소 */
		}

		ul {
			gap: 1rem; /* 추가: 모바일에서 메뉴 간격 축소 */
		}
	}
</style>
