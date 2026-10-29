<script lang="ts">
	import type { UpsertReignView } from '../interfaces/reigns.interfaces';

	export let view: UpsertReignView = 'single';
</script>

<div class="w1 team-view-buttons-container flex start acenter gap-0">
	<label class="relative btn" class:selected={view === 'single'}>
		<input
			type="radio"
			class="app-radio"
			name="reign-type"
			value="single"
			bind:group={view}
			checked={view === 'single'}
		/>
		Individual
	</label>
	<label class="relative btn" class:selected={view === 'team'}>
		<input
			type="radio"
			class="app-radio"
			name="reign-type"
			value="team"
			bind:group={view}
			checked={view === 'team'}
		/>
		Parejas
	</label>

	<label class="relative btn" class:selected={view === 'no-team'}>
		<input
			type="radio"
			class="app-radio"
			name="reign-type"
			value="no-team"
			bind:group={view}
			checked={view === 'no-team'}
		/>
		Sin equipo
	</label>
</div>

<style>
	.team-view-buttons-container {
		width: 100%;
	}
	.team-view-buttons-container label {
		margin: 0;
		width: 100%;
		border-radius: 0;
		background-color: #ddd;
		text-align: center;
		white-space: nowrap;
	}
	.team-view-buttons-container label.selected {
		background-color: var(--sidebar-bg);
		color: white;
	}
	.team-view-buttons-container label:first-child {
		border-radius: 5px 0 0 5px;
	}
	.team-view-buttons-container label:last-child {
		border-radius: 0 5px 5px 0;
	}
</style>
