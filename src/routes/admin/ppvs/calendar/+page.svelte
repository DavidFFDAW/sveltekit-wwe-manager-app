<script lang="ts">
	let { data } = $props();
	const today = new Date();
	const year = data.year;
	let month = $state(data.month);
	const currentMonthDate = $derived(new Date(year, month, 1));
	const lastMonthDate = $derived(new Date(year, month + 1, 0));

	const monthLabel = $derived(
		currentMonthDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
	);
	const weeklyShows: Record<number, { name: string; image: string; type: string }> = {
		1: { type: 'weekly', name: 'RAW', image: '/brands/raw.webp' },
		3: { type: 'weekly', name: 'Evolution', image: '/brands/awl.webp' },
		5: { type: 'weekly', name: 'SmackDown', image: '/brands/smackdown.webp' }
	};
	const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

	const days = $derived.by(() => {
		return Array.from({ length: lastMonthDate.getDate() }, (_, index) => {
			const dayDate = new Date(year, month, index + 1, 12, 0, 0);
			const iso = dayDate.getCustomIsoFormat();

			return {
				iso: iso,
				day: index + 1,
				past: dayDate.getTime() < today.getTime(),
				isToday: dayDate.toDateString() === today.toDateString(),
				weekday: dayDate.getDay(),
				weekdayLabel: dayDate.toLocaleDateString('es-ES', { weekday: 'long' }),
				event: data.yearlyPPVs[iso] || weeklyShows[dayDate.getDay()]
			};
		});
	});
</script>

<svelte:head>
	<title>Calendario de shows y PPVs</title>
</svelte:head>

<section class="calendar-page" aria-labelledby="calendar-title">
	<header>
		<h1 id="calendar-title">Calendario de shows y PPVs</h1>
		<p id="calendar-month" aria-live="polite">{monthLabel}</p>
		<div class="month-navigation">
			<button type="button" disabled={month === 0} onclick={() => (month = Math.max(0, month - 1))}>
				Anterior
			</button>
			<button
				type="button"
				disabled={month === 11}
				onclick={() => (month = Math.min(11, month + 1))}
			>
				Siguiente
			</button>
		</div>
	</header>

	<div class="calendar" role="table" aria-labelledby="calendar-month">
		<div class="weekdays" role="row">
			{#each weekdays as weekday}
				<div class="weekday" role="columnheader" aria-label={weekday}>
					<span aria-hidden="true">{weekday.slice(0, 3)}</span>
				</div>
			{/each}
		</div>
		<div class="day-container week" role="row">
			{#each days as day}
				<div
					class="day"
					class:past={day.past}
					class:today={day.isToday}
					style:grid-column-start={day.day === 1 ? ((day.weekday + 6) % 7) + 1 : undefined}
					role="cell"
				>
					<time datetime={day.iso}>{day.day}</time>
					{#if day.event}
						<div class="events">
							<div class="event weekly">
								<img src={day.event.image} alt="" loading="lazy" />
								<span>
									<small>{day.event.type === 'weekly' ? 'Show semanal' : 'PPV'}</small>
									{day.event.name}
								</span>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<!-- {#each Array.from({ length: cellCount / 7 }, (_, index) => index) as week}
			<div class="week" role="row">
				{#each days.slice(week * 7, week * 7 + 7) as day}
					<div class="day" class:empty={day === null} class:today={day === data.today} role="cell">
						{#if day !== null}
							<time
								datetime={`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
								aria-current={day === data.today ? 'date' : undefined}>{day}</time
							>
							<div class="events">
								{#each weeklyShows.filter((show) => show.weekday === new Date(year, month, day).getDay()) as show}
									<div class="event weekly">
										<img src={show.image} alt="" loading="lazy" /><span
											><small>Show semanal</small>{show.name}</span
										>
									</div>
								{/each}
								{#each data.ppvs.filter((event) => event.day === day) as event (event.id)}
									<a class="event ppv" href={`/admin/ppvs/${event.id}`}>
										{#if event.image}<img src={event.image} alt="" loading="lazy" />{/if}
										<span><small>PPV</small>{event.name}</span>
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/each} -->
	</div>
</section>

<style>
	.calendar-page {
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		color: #252b36;
	}
	header {
		margin-bottom: 1.5rem;
	}
	h1 {
		margin: 0 0 0.5rem;
		font-size: 1.75rem;
	}
	header p {
		margin: 0;
		color: #64748b;
		font-size: 1.125rem;
	}
	header p::first-letter {
		text-transform: uppercase;
	}
	.calendar {
		overflow: hidden;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		background: #fff;
	}
	.month-navigation {
		display: flex;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}
	.month-navigation button {
		padding: 0.5rem 0.75rem;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		background: #fff;
		color: #252b36;
		cursor: pointer;
	}
	.month-navigation button:disabled {
		opacity: 0.5;
		cursor: default;
	}
	.weekdays,
	.week {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
	}
	.weekday {
		padding: 1rem 0.25rem;
		background: #f8fafc;
		color: #64748b;
		text-align: center;
		font-size: 0.875rem;
		font-weight: 600;
	}
	.day {
		min-height: 110px;
		padding: 0.75rem;
		border-top: 1px solid #e2e8f0;
		border-right: 1px solid #e2e8f0;
	}
	.events {
		display: grid;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
	.event {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		min-width: 0;
		padding: 0.5rem;
		border: 1px solid #ddd6fe;
		border-radius: 6px;
		background: #f5f3ff;
		color: #6d28d9;
		font-size: 0.8rem;
		text-decoration: none;
		overflow-wrap: anywhere;
	}
	.event img {
		width: 100%;
		height: 45px;
		object-fit: contain;
	}
	.event small {
		display: block;
		font-size: 0.65rem;
		font-weight: 600;
	}
	.weekly {
		background: #eff6ff;
		border-color: #bfdbfe;
		color: #1d4ed8;
	}
	a.event:hover {
		background: #ede9fe;
	}
	a.event:focus-visible {
		outline: 2px solid #7c3aed;
		outline-offset: 2px;
	}
	.past {
		background: #f8fafc;
	}
	time {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		font-size: 0.875rem;
	}
	.today {
		background: #eff6ff;
	}
	.today time {
		border-radius: 50%;
		background: #2563eb;
		color: #fff;
		font-weight: 700;
	}
	@media (max-width: 600px) {
		.day {
			min-height: 70px;
			padding: 0.25rem;
		}
		.weekday {
			font-size: 0.75rem;
		}
	}
</style>
