<script lang="ts">
	import type { Team, WrestlerTeam } from '@prisma/client';
	export let team: Team = {} as Team;
</script>

<div class="container">
	<h1>{team.name}</h1>
	<p>{team.slug}</p>
</div>
