<script lang="ts">
	export let headers: string[] = [];
</script>

<div class="container overflowable-table">
	<table>
		<thead>
			{#if headers.length > 0}
				<tr>
					{#each headers as header}
						<th>{header}</th>
					{/each}
				</tr>
			{/if}
			{#if $$slots.head}
				<slot name="head"></slot>
			{/if}
		</thead>
		<tbody>
			<slot></slot>
		</tbody>
		{#if $$slots.footer}
			<tfoot>
				<tr>
					<slot name="footer"></slot>
				</tr>
			</tfoot>
		{/if}
	</table>
</div>
