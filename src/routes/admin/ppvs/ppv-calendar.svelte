<script lang="ts">
	import { onMount } from 'svelte';
	import { Calendar } from '@fullcalendar/core';
	import dayGridPlugin from '@fullcalendar/daygrid';
	import interactionPlugin from '@fullcalendar/interaction';
	import type { PPV } from '@prisma/client';

	let calendar: Calendar;
	export let name: string;
	export let label: string;
	let calendarHTMLElement: HTMLElement;
	export let selectedDate: string = '';
	const currentYear = new Date().getFullYear();

	export let ppvs: PPV[];
	$: events = ppvs
		.filter((ppv) => Boolean(ppv.game_date))
		.map((ppv) => ({
			title: ppv.name,
			start: ppv.game_date?.toISOString().split('T')[0],
			end: ppv.game_date?.toISOString().split('T')[0],
			image: ppv.image as string,
			url: `/admin/ppvs/${ppv.id}`
		}));

	function highlightSelectedDate(dateStr: string) {
		// Limpiar clases anteriores
		document
			.querySelectorAll('.fc-daygrid-day.selected-day')
			.forEach((el) => el.classList.remove('selected-day'));

		// Buscar el día por su data-date y aplicar clase
		const cell = document.querySelector(`.fc-daygrid-day[data-date="${dateStr}"]`);
		if (cell) {
			cell.classList.add('selected-day');
		}
	}

	onMount(() => {
		if (!calendarHTMLElement) return;

		calendar = new Calendar(calendarHTMLElement, {
			plugins: [dayGridPlugin, interactionPlugin],
			initialView: 'dayGridMonth',
			dayMaxEvents: 1,
			events: events,
			validRange: {
				start: `${currentYear}-01-01`,
				end: `${currentYear + 1}-01-01`
			},
			firstDay: 1,
			weekends: true,
			dayCellClassNames: 'ppv-calendar-item',
			locale: 'es',
			showNonCurrentDates: false,
			dayMaxEventRows: 1,
			initialDate: selectedDate || new Date().toISOString().split('T')[0],
			dateClick: (info: any) => {
				selectedDate = info.dateStr;
				highlightSelectedDate(info.dateStr);
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
		highlightSelectedDate(selectedDate);
	});
</script>

<div class="w1 calendar-container calendar-full-calendar-container astart flex column">
	<div class="form-item">
		<label for={name} class="label form-label pointer">{label}</label>
		<input type="hidden" id={name} {name} bind:value={selectedDate} />
	</div>

	<div bind:this={calendarHTMLElement} class="w1 calendar full-calendar"></div>
	<p>Fecha seleccionada: {selectedDate}</p>
</div>
<div class="ppv-item-image-special-event none"></div>

<style>
	.calendar.full-calendar {
		max-width: 600px;
	}
	.ppv-item-image-special-event {
		width: 100%;
		height: 100%;
		object-fit: cover;
		background-color: #000;
	}
</style>
