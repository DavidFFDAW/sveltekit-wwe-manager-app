<script lang="ts">
	let { rumbles } = $props();
</script>

<div class="w1 rumble-winners-container">
	<div class="rumble-winners-list">
		{#each rumbles as rumble}
			<div class="w1 current-rumble-winner rumble-winner-item">
				<img src={rumble.winner.image_name} alt={rumble.winner.name} class="rumble-winner-image" />
				<p class="rumble-winner-entry-number rumble bold">{rumble.entry_number}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.rumble-winners-container {
		width: 100%;
		margin: 0 auto;
	}
	.rumble-winners-container .rumble-winners-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
	}

	.rumble-winners-container .rumble-winner-item {
		width: 100%;
		height: 220px;
		cursor: pointer;
		position: relative;
		border-radius: 8px;
		padding: 1rem;
		background-color: #333;
		background-image: url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6bed05fb-8ffb-4996-8575-1b9c179251cf/dfdi6k0-3e6f2f40-ddfe-4fe6-b94b-abb282e6c528.png/v1/fill/w_1280,h_720,q_80,strp/royal_rumble_2021_match_card_background_by_mackdanger1000000000_dfdi6k0-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6Ii9mLzZiZWQwNWZiLThmZmItNDk5Ni04NTc1LTFiOWMxNzkyNTFjZi9kZmRpNmswLTNlNmYyZjQwLWRkZmUtNGZlNi1iOTRiLWFiYjI4MmU2YzUyOC5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.s_7UZkbszFDh7AUZ9a5Cb4iUrm3nmr6-HmicHV-CBzY');
		background-size: cover;
		background-position: top;
		background-repeat: no-repeat;
		border: 1px solid #333;

		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		gap: 10px;
	}
	.rumble-winners-container .rumble-winner-item img.rumble-winner-image {
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		transform-origin: bottom;
		max-width: 238px;
		object-position: left;
		object-fit: cover;
	}
	.rumble-winners-container .rumble-winner-item:nth-child(even) img.rumble-winner-image {
		right: 0;
		left: auto;
		object-position: right;
	}
	.rumble-winners-container .rumble-winner-item:hover img.rumble-winner-image {
		transform: scale(1.05);
	}

	.rumble-winners-container .rumble-winner-item .rumble-winner-entry-number {
		position: absolute;
		top: 50%;
		right: 1rem;
		transform: translateY(-50%);
		font-size: 40px;
		color: #fff;
		background-color: #333;
		padding: 5px;
		border-radius: 0;
		border-top: 2px solid red;
		border-bottom: 2px solid red;
	}
	.rumble-winners-container .rumble-winner-item:nth-child(even) .rumble-winner-entry-number {
		right: auto;
		left: 1rem;
	}

	@media (max-width: 768px) {
		.rumble-winners-container .rumble-winner-item .rumble-winner-entry-number {
			position: static;
			transform: none;
		}
	}
</style>
