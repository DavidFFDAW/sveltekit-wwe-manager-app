<script lang="ts">
	import { Utils } from '$lib/utils/general.utils';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface DatasetInputProps extends Omit<HTMLInputAttributes, 'value'> {
		name: string;
		label: string;
		options: string[];
		value?: string | null;
	}

	let { name, label, options, value = $bindable(''), ...rest }: DatasetInputProps = $props();

	const id = `${name}-${Utils.getRandomID(name)}`;
	const listId = `${id}-listbox`;

	let open = $state(false);
	let activeIndex = $state(-1);
	let container: HTMLDivElement;

	const current = $derived(value ?? '');
	// Si el valor coincide exactamente con una opción se muestran todas, para poder cambiarla
	const filtered = $derived.by(() => {
		const term = current.trim().toLowerCase();
		if (!term || options.some((o) => o.toLowerCase() === term)) return options;
		return options.filter((o) => o.toLowerCase().includes(term));
	});

	const openList = () => {
		open = true;
		activeIndex = -1;
	};

	const select = (option: string) => {
		value = option;
		open = false;
		activeIndex = -1;
	};

	const onInput = (e: Event) => {
		value = (e.currentTarget as HTMLInputElement).value;
		openList();
	};

	const onKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape' && open) {
			e.preventDefault();
			open = false;
		}
	};

	const onFocusOut = (e: FocusEvent) => {
		if (!container.contains(e.relatedTarget as Node | null)) open = false;
	};
</script>

<div class="form-item dataset-input" bind:this={container} onfocusout={onFocusOut}>
	<label class="label flex between form-label {rest.required ? 'required-label' : ''}" for={id}>
		<span>
			{Utils.deAccentize(label)}
			{#if rest.required}
				<span class="required-label">*</span>
			{/if}
		</span>
		{#if rest.maxlength}
			<small class="sourcesans">{current.length} / {rest.maxlength}</small>
		{/if}
	</label>

	<div class="combo">
		<input
			type="text"
			{id}
			{name}
			value={current}
			maxlength={rest.maxlength}
			autocomplete="off"
			role="combobox"
			aria-expanded={open}
			aria-controls={listId}
			aria-autocomplete="list"
			aria-activedescendant={activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined}
			oninput={onInput}
			onfocus={openList}
			onclick={openList}
			onkeydown={onKeydown}
			{...rest}
		/>
		<button
			type="button"
			class="toggle"
			tabindex="-1"
			aria-label="Mostrar opciones"
			onclick={() => (open ? (open = false) : openList())}
		>
			<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" class:flipped={open}>
				<path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" />
			</svg>
		</button>

		{#if open && filtered.length > 0}
			<ul class="dropdown" id={listId} role="listbox">
				{#each filtered as option, i}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<li
						id={`${id}-opt-${i}`}
						role="option"
						aria-selected={option === current}
						class:active={i === activeIndex}
						class:selected={option === current}
						onmousedown={(e) => e.preventDefault()}
						onclick={() => select(option)}
					>
						{option}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	.combo {
		position: relative;
	}
	.combo input {
		width: 100%;
		padding-right: 2.2rem;
	}
	.toggle {
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
		width: 2.2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
	}
	.toggle svg {
		transition: transform 0.15s;
	}
	.toggle svg.flipped {
		transform: rotate(180deg);
	}
	.dropdown {
		position: absolute;
		top: calc(100% + 4px);
		left: 0;
		right: 0;
		z-index: 20;
		margin: 0;
		padding: 4px;
		list-style: none;
		max-height: 220px;
		overflow-y: auto;
		background: #fff;
		color: #222;
		border: 1px solid #ddd;
		border-radius: 8px;
		box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
	}
	.dropdown li {
		padding: 8px 10px;
		border-radius: 6px;
		cursor: pointer;
	}
	.dropdown li:hover,
	.dropdown li.active {
		background: #f0f0f0;
	}
	.dropdown li.selected {
		font-weight: 600;
	}
</style>
