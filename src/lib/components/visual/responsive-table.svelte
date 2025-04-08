<script lang="ts">
	export let header: string[];
</script>

<div class="responsive-table">
	<table class="custom-table">
		<thead>
			<tr>
				{#each header as headTitle}
					<th>{headTitle}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			<slot />
		</tbody>
		<slot name="footer" />
	</table>
</div>
