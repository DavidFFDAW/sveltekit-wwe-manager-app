<script lang="ts">
	let { id, name, image, date, url } = $props();
</script>

<div class="notification-card" data-id={id}>
	<img src={image} alt={name} class="notification-image" width="80" />
	<div class="datas">
		<p class="notification-name bold">{name}</p>
		<small>{date?.toLocaleDateString()}</small>
		<a href={url} class="btn btn-check">Revisar</a>
	</div>
</div>

<style>
	.notification-card {
		height: 200px;
		position: relative;
		border: 2px solid #333;
		background-color: #333;
		border-radius: 8px;
	}
	.notification-card .notification-image {
		position: absolute;
		top: 50%;
		left: 50%;
		width: calc(100% - 6px);
		height: calc(100% - 6px);
		border-radius: 5px;
		object-fit: cover;
		transform: translate(-50%, -50%);
		z-index: 0;
	}

	.notification-card .datas {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100%;
		padding: 10px;
		color: #fff;
		z-index: 1;
	}
	.notification-card .datas::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.4);
		border-radius: 8px;
		z-index: -1;
	}

	.notification-card .btn-check {
		position: relative;
		padding: 8px 25px;
		background-color: transparent;
		margin-right: 5px;
		border: none;
		color: #fff;
		font-size: 1em;
		text-transform: uppercase;
		cursor: pointer;
		z-index: 1;
	}
	.notification-card .btn-check::after {
		content: '';
		position: absolute;
		background-color: var(--raw);
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		border-radius: 2px;
		transform: skew(-10deg);
		z-index: -1;
	}
</style>
