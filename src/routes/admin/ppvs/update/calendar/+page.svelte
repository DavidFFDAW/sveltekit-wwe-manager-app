<script lang="ts">
	import { onMount } from 'svelte';
	import type { PPVCalendarEntry } from './+page.server.js';
	import type { Instance } from 'flatpickr/dist/types/instance.js';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import Box from '$lib/components/box/box.svelte';

	export let data;
	const today = new Date();
	const MAX_EVENTS = data.ppvs.length;

	let showPopup = false;
	let flatpickrInstance: Instance;
	let popUpSelectedDate: string = '';
	let popUpSelectedPPVId: string = '';
	let selectedDatesArray: string[] = Object.keys(data.ppvCalendar);
	let outerSelectedDates: Record<string, PPVCalendarEntry> = data.ppvCalendar;
	let popupUsedPPVIds: number[] = [];

	const getDateKey = (date: Date) =>
		`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

	const togglePopup = () => {
		showPopup = !showPopup;
		document.body.classList.toggle('no-scroll', showPopup);
	};

	const closePopup = () => {
		showPopup = false;
		selectedDatesArray = selectedDatesArray.filter((date) => date !== popUpSelectedDate);

		if (flatpickrInstance && !popUpSelectedPPVId) {
			flatpickrInstance.setDate(selectedDatesArray, false);
		}

		popUpSelectedPPVId = '';
		popUpSelectedDate = '';
		document.body.classList.remove('no-scroll');
	};

	const resetCalendarDatas = () => {
		selectedDatesArray = [];
		outerSelectedDates = {};
		if (flatpickrInstance) {
			flatpickrInstance.setDate([], false);
			flatpickrInstance.jumpToDate(`${today.getFullYear()}-01-01`);
		}
	};

	const createPPVOnCalendar = (event: Event) => {
		event.preventDefault();
		if (!(event.target instanceof HTMLFormElement)) return;
		const formData = new FormData(event.target as HTMLFormElement);
		const ppvId = Number(formData.get('ppv_date') as string);
		if (!ppvId) return;

		const ppvDatas = data.ppvs.find((ppv) => ppv.id === ppvId);
		if (!ppvDatas) return;

		outerSelectedDates[popUpSelectedDate] = {
			id: ppvDatas.id,
			name: ppvDatas.name,
			abbreviation: ppvDatas.abbreviation as string,
			image: ppvDatas.image as string,
			date: new Date(popUpSelectedDate)
		};
		selectedDatesArray = Object.keys(outerSelectedDates);
		popupUsedPPVIds = Object.values(outerSelectedDates).map((entry) => entry.id);
		popUpSelectedPPVId = '';
		popUpSelectedDate = '';
		togglePopup();
		if (flatpickrInstance) {
			flatpickrInstance.redraw();
			flatpickrInstance.setDate(selectedDatesArray, false);
		}
	};

	onMount(async () => {
		const { default: flatpickr } = await import('flatpickr');
		const { Spanish } = await import('flatpickr/dist/l10n/es.js');
		console.log(Spanish);

		flatpickr('.flatpickr-selector', {
			mode: 'multiple',
			inline: true,
			showMonths: data.isMobile ? 1 : 2,
			dateFormat: 'Y-m-d',
			defaultDate: Object.keys(outerSelectedDates),
			minDate: `${today.getFullYear() - 1}-01-01`,
			maxDate: `${today.getFullYear() + 1}-12-31`,
			locale: Spanish,
			onReady: function (_: any, __: any, instance: Instance) {
				flatpickrInstance = instance;
			},
			onChange: function (selectedDates: Date[], dateStr: string, instance: any) {
				const currentSelectedOneDate = selectedDates[selectedDates.length - 1];

				if (selectedDates.length > MAX_EVENTS) {
					instance.setDate(selectedDatesArray, false);

					if (selectedDatesArray.length > 0) {
						instance.jumpToDate(currentSelectedOneDate);
					}

					return;
				}
				const isAdding = selectedDates.length > selectedDatesArray.length;

				if (selectedDates.length === 0) {
					outerSelectedDates = {};
					selectedDatesArray = [];
					instance.setDate([], false);
					instance.redraw();
					return;
				}
				selectedDatesArray = selectedDates.map((date) => getDateKey(date));
				outerSelectedDates = selectedDatesArray.reduce(
					(acc, dateKey) => {
						if (outerSelectedDates[dateKey]) {
							acc[dateKey] = outerSelectedDates[dateKey];
						}
						return acc;
					},
					{} as Record<string, PPVCalendarEntry>
				);

				popUpSelectedDate = getDateKey(currentSelectedOneDate);
				if (isAdding) togglePopup();

				instance.redraw();
			},
			onDayCreate: function (dObj: any, dStr: any, fp: any, dayElem: any) {
				const date = dayElem.dateObj;
				const dateKey = getDateKey(date);

				const ppvDate = outerSelectedDates[dateKey];
				if (ppvDate && Object.keys(outerSelectedDates).includes(dateKey)) {
					dayElem.classList.add('custom-flatpickr-markup');
					dayElem.style.backgroundImage = `url(${ppvDate.image || ''})`;
					dayElem.title = ppvDate.name;
					const ppvInfo = document.createElement('span');
					ppvInfo.className = 'custom-flatpickr-element';
					ppvInfo.textContent = ppvDate.name;
					dayElem.appendChild(ppvInfo);
				}
			}
		});
	});

	$: popupUsedPPVIds = Object.values(outerSelectedDates).map((entry) => entry.id);
</script>

<AsyncForm method="post" showButtons={false}>
	<Box icon="calendar-event" title="Fechas de PPV" classes="calendar-box">
		<div class="w1 box-inner {data.isMobile ? 'mobile' : 'desktop'}">
			<input type="hidden" name="action" value="update_calendar" />
			{#each Object.entries(outerSelectedDates) as [dateKey, ppvEntry]}
				<input type="hidden" name="ppv_calendar_dates[{ppvEntry.id}]" value={dateKey} />
			{/each}

			<input type="hidden" class="flatpickr-selector" />
		</div>

		<div class="w1 flex between acenter gap-small">
			<button type="button" class="btn secondary" on:click={resetCalendarDatas}>
				Vaciar calendario
			</button>
			<button type="submit" class="btn cta">Guardar calendario</button>
		</div>
	</Box>
</AsyncForm>

{#if showPopup && popUpSelectedDate}
	<form action="" method="post" on:submit={createPPVOnCalendar}>
		<div class="w1 popup-wrapper">
			<div class="popup-overlay" role="presentation" on:click={closePopup}></div>

			<div class="w1 popup-external-container">
				<div class="popup-container box">
					<header class="w1 popup-header flex end acenter">
						<button
							type="button"
							class="btn unbutton popup-close-button"
							on:click={closePopup}
							aria-label="Close popup"
							title="Close popup"
						>
							<i class="bi bi-x-lg popup-close-icon"></i>
						</button>
					</header>

					<div class="w1 popup-content">
						<p class="title">Selecciona el evento para esta fecha ({popUpSelectedDate})</p>

						<div class="ppv-card-container grid gap-smaller">
							{#each data.ppvs as ppv}
								{#if !popupUsedPPVIds.includes(ppv.id)}
									<label class="relative">
										<input
											type="radio"
											class="app-radio"
											name="ppv_date"
											value={ppv.id}
											bind:group={popUpSelectedPPVId}
										/>
										<div class="ppv-card inner">
											<img width="100" src={ppv.image} alt={ppv.name} class="ppv-card-image" />
											<h3>{ppv.name}</h3>
										</div>
									</label>
								{/if}
							{/each}
						</div>

						<div class="w1 flex end gap-small mt-1">
							<button type="submit" class="btn cta" disabled={!popUpSelectedPPVId}>Guardar</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</form>
{/if}

<style>
	.box-inner {
		max-width: 618px;
	}
	:global(input[type='text'].flatpickr-selector.flatpickr-input) {
		display: none;
	}
	:global(.box-inner.mobile .flatpickr-innerContainer) {
		align-items: center;
	}
	:global(.box-inner.mobile .flatpickr-calendar) {
		width: 100% !important;
	}
	:global(.box.calendar-box) {
		max-width: 660px;
		margin: 0 auto;
	}
	.popup-container p.title {
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 12px;
		text-align: center;
	}
	.popup-container .ppv-card-container.grid {
		margin: 25px 0;
		grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
	}
	.popup-container .ppv-card-container .ppv-card {
		width: 100%;
		height: 100%;
		background-color: #fff;
		border: 2px solid #a8a8a8;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.popup-container .ppv-card-container .ppv-card img {
		width: 100%;
		max-width: 100%;
		height: 100px;
		max-height: 100px;
		border-radius: 4px 4px 0 0;
		object-fit: contain;
		background-color: #000;
	}
	.popup-container .ppv-card-container .ppv-card h3 {
		font-size: 14px;
		padding: 5px 10px;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.popup-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1000;
	}

	.popup-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		cursor: pointer;
		z-index: 1001;
	}

	.popup-external-container {
		position: absolute;
		top: 0;
		left: 0;
		width: calc(100% - var(--sidebar-width));
		height: 100%;
		margin-left: var(--sidebar-width);
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.popup-container {
		position: relative;
		width: 90%;
		max-width: 600px;
		max-height: 90dvh;
		min-height: 200px;
		background-color: #fff;
		border-radius: 14px;
		padding: 15px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		overflow-y: auto;
		z-index: 1002;
	}

	.popup-close-button {
		position: absolute;
		top: 10px;
		right: 10px;
		border-radius: 50%;
		background-color: #eee;
		width: 28px;
		height: 28px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 8px;
	}

	@media screen and (max-width: 600px) {
		.popup-external-container {
			width: 100%;
			margin-left: 0;
		}
	}
</style>
