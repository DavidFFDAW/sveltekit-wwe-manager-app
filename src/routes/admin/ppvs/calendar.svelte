<script lang="ts">
	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import interactionPlugin from '@fullcalendar/interaction';
	import type { PPV } from '@prisma/client';

	let calendar;
	let selectedDate: string;
	export let ppvs: PPV[] = [];
	const events = ppvs
		.filter((ppv) => ppv.active)
		.map((ppv) => {
			return {
				title: ppv.name,
				start: ppv.game_date as Date,
				image: ppv.image as string
			};
		});

	onMount(() => {
		const calendarHTMLElement = document.getElementById('calendar');
		if (!calendarHTMLElement) return;

		calendar = new Calendar(calendarHTMLElement, {
			plugins: [dayGridPlugin, interactionPlugin],
			initialView: 'dayGridMonth',
			events: events,
			dateClick: (info: any) => {
				selectedDate = info.dateStr;
				console.log('Fecha seleccionada:', selectedDate);
			},
			eventContent: (eventInfo: any) => {
				if (eventInfo.event.extendedProps.image) {
					return {
						html: `<img src="${eventInfo.event.extendedProps.image}" class="ppv-item-image-special-event">`
					};
				}
			}
		});

		calendar.render();
	});
</script>

<div class="w1 flex column">
	<div id="calendar" class="w1"></div>
	<p>Fecha seleccionada: {selectedDate}</p>
</div>

<style>
	#calendar {
		max-width: 800px;
		margin: auto;
	}
	.ppv-item-image-special-event {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
