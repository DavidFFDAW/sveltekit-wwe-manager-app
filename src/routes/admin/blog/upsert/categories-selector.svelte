<script lang="ts">
	type Props = {
		defaultCategories?: string[];
		type?: 'checkbox' | 'radio';
	};
	let { defaultCategories = [], type = 'checkbox' }: Props = $props();
	let categories: string[] = $state(defaultCategories);
	let uniqueCategories = $derived([...new Set(categories)]);

	const handleChange = (event: Event) => {
		event.preventDefault();
		const input = event.target as HTMLInputElement;
		if (!input || !(input instanceof HTMLInputElement)) return;

		const value = input.value.trim();
		if (value && !categories.includes(value)) {
			categories = [...categories, value];
			input.value = '';
		}
	};

	function handleCategoryRemoval(category: string) {
		return () => {
			categories = categories.filter((c) => c !== category);
		};
	}
</script>

<div class="categories-selector">
	<label class="label categories-selector-label">
		<span class="label-text">Categorías</span>
		<input
			class="input"
			name="category_add"
			type="text"
			placeholder="Add a category"
			onchange={handleChange}
		/>
	</label>

	<div class="categories-selector-list">
		{#each uniqueCategories as category}
			<label class="categories-selector-item label relative">
				<input {type} name="categories[]" value={category} class="app-radio" />
				<span>{category}</span>
				<!-- <button
					type="button"
					class="btn btn-sm btn-error icon"
					aria-label="Remove category"
					aria-describedby="Remove category"
					aria-controls="category_add"
					onclick={handleCategoryRemoval(category)}
				>
					<i class="fa-solid fa-xmark"></i>
				</button> -->
			</label>
		{/each}
	</div>
</div>

<style>
	.categories-selector {
		width: 100%;
	}
	.categories-selector-label {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.categories-selector-label .label-text {
		font-size: 16px;
		font-weight: 600;
		text-transform: uppercase;
		color: #000;
	}
	.categories-selector-list {
		padding: 8px 0;
	}
	.app-radio {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
	.app-radio + span {
		display: inline-block;
		padding: 4px 10px;
		border: 1px solid #ccc;
		border-radius: 50px;
		background-color: #f9f9f9;
		cursor: pointer;
	}
	.app-radio:checked + span {
		background-color: #007bff;
		border-color: #007bff;
		color: #fff;
	}
</style>
