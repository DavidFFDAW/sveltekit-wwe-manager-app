<script lang="ts">
	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import interactionPlugin from '@fullcalendar/interaction';
	import type { PPV } from '@prisma/client';

	let calendar;
	let selectedDate: string;
	export let ppvs: PPV[];
	$: events = ppvs.map((ppv) => {
		return {
			start: ppv.game_date?.toString() as string,
			end: ppv.game_date?.toString() as string,
			title: ppv.name,
			image: ppv.image as string
		};
	});

	onMount(() => {
		const calendarHTMLElement = document.getElementById('calendar');
		if (!calendarHTMLElement) return;

		calendar = new Calendar(calendarHTMLElement, {
			plugins: [dayGridPlugin, interactionPlugin],
			initialView: 'dayGridMonth',
			dayMaxEvents: 1,
			events: events,
			dateClick: (info: any) => {
				selectedDate = info.dateStr;
				console.log('Fecha seleccionada:', selectedDate);
			},
			eventContent: (eventInfo: any) => {
				console.log(`Evento: ${eventInfo.event.title}`);

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
