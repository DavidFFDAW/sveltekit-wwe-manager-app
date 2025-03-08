<script lang="ts">
	let step: number = 1;
	let maxSteps: number = 3;
	let currentStep: number = 0;

	const nextStep = () => {
		if (currentStep < maxSteps) currentStep++;
	};

	const prevStep = () => {
		currentStep--;
	};

	const formSubmit = (e: Event) => {
		e.preventDefault();
		console.log('Form submitted');
		const datas = new FormData(e.target as HTMLFormElement);
		console.log('datas: ', Object.fromEntries(datas));
	};
</script>

<h1>Formulario en pasos de prueba</h1>

<form class="form-container" on:submit={formSubmit}>
	<div class="steps-wrapper" style="transform: translateX(-{currentStep * 100}%);">
		<!-- Paso 1 -->
		<div class="step">
			<h2>Paso 1</h2>
			<input type="text" name="nombre" placeholder="Nombre" required />
			<div class="buttons">
				<button type="button" on:click={nextStep}>Siguiente</button>
			</div>
		</div>

		<!-- Paso 2 -->
		<div class="step">
			<h2>Paso 2</h2>
			<input type="email" name="email" placeholder="Correo" required />
			<div class="buttons">
				<button type="button" on:click={prevStep}>Anterior</button>
				<button type="button" on:click={nextStep}>Siguiente</button>
			</div>
		</div>

		<!-- Paso 3 -->
		<div class="step">
			<h2>Paso 3</h2>
			<input type="password" name="password" placeholder="Contraseña" required />
			<div class="buttons">
				<button type="button" on:click={prevStep}>Anterior</button>
				<button type="submit">Enviar</button>
			</div>
		</div>
	</div>
</form>

<style>
	.form-container {
		width: 100%;
		overflow: hidden;
		position: relative;
	}

	.steps-wrapper {
		display: flex;
		width: 300%; /* Ajustar según el número de pasos */
		transition: transform 0.4s ease-in-out;
	}

	.step {
		width: 100%;
		flex-shrink: 0;
		padding: 20px;
		box-sizing: border-box;
	}

	.buttons {
		margin-top: 20px;
		display: flex;
		justify-content: space-between;
	}
</style>
