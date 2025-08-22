<script lang="ts">
	let wrestler: string = '';
	let content: string = '';
	export let name: string;
	export let datasetList: string;

	const handleAddText = (text: string) => (ev: Event) => {
		ev.preventDefault();
		if (content.length > 0) content += ` ${text} `;
	};
	const handleAddWrestler = (ev: Event) => {
		ev.preventDefault();
		if (wrestler.length > 0) {
			content += wrestler.trim();
			wrestler = '';
		}
	};
</script>

<div class="w1 flex astart gap-small match-wrestlers-container responsive">
	<label class="block w1 label">
		<span class="label form-label dreadnotus">Participantes</span>
		<textarea {name} bind:value={content} placeholder="AJ Styles VS Triple H" rows="3"></textarea>
	</label>
	<div class="w1 flex column astart gap-smaller responsive">
		<label class="block w1 label">
			<span class="label form-label dreadnotus">Luchador</span>
			<div class="flex gap-0 input-buttons-container column">
				<input
					type="text"
					name="dataset-wrestlers-autocomplete"
					list={datasetList}
					bind:value={wrestler}
					placeholder="← Añadir luchadores de forma simple al textarea ←"
				/>

				<div class="w1 flex total ascenter nogap">
					<button
						type="button"
						class="btn btn-match-wrestlers btn-add-wrestler"
						on:click={handleAddWrestler}
					>
						<i class="bi bi-plus"></i>
						Luchador
					</button>

					<button
						type="button"
						class="btn btn-match-wrestlers btn-add-vs"
						on:click={handleAddText('VS')}
					>
						VS
					</button>

					<button
						type="button"
						class="btn btn-match-wrestlers btn-add-vs"
						on:click={handleAddText('(c)')}
					>
						Campeón
					</button>
				</div>
			</div>
		</label>
	</div>
</div>

<style>
	textarea {
		width: 100%;
		min-height: 20px;
	}
	.input-buttons-container input {
		border-radius: 8px 8px 0 0;
		border-bottom: 0;
		height: 34px;
	}
	.btn.btn-match-wrestlers {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 34px;
		border-radius: 0;
		color: #333;
		padding: 2px 12px;
		background-color: #fff;
		font-size: 14px;
		border: 1px solid #ccc;
	}
	.btn.btn-match-wrestlers.btn-add-wrestler {
		border-radius: 0 0 0 8px;
		border-right: 0;
	}
	.btn.btn-match-wrestlers.btn-add-vs {
		border-radius: 0 0 8px 0;
	}
</style>
