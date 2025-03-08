<script>
	import Seo from '$lib/components/seo/seo.svelte';
	import { page } from '$app/state';
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';

	let showPassword = false;
	const nextRedirect = page.url.searchParams.has('next')
		? page.url.searchParams.get('next')?.toString()
		: '/admin/dashboard';
</script>

<Seo title="Login" description="Accede a tu cuenta" />

<PageWrapper page="login" showFooter={false}>
	<div class="login-container-wrapper">
		<div class="login-container">
			<div class="flex column acenter center">
				<h1><img width="96" height="96" src="/icons/versatile.png" alt="" /></h1>
				<h2><span class="dreadnotus">Acceder</span></h2>
				<div class="down login-auth-form-container">
					<AsyncForm method="post" showButtons={false} showToast={false} redirect={nextRedirect}>
						<div class="flex center gap-small column astart relative" style="height:205px">
							<input
								type="text"
								placeholder="example@email.com"
								autocomplete="email"
								aria-autocomplete="list"
								class="w1 app-custom-input"
								name="email"
								required
							/>
							<div class="w1 flex between">
								<input
									type={showPassword ? 'text' : 'password'}
									placeholder="Password"
									class="w1 app-custom-input nradius"
									autocomplete="current-password"
									aria-autocomplete="list"
									name="password"
									required
								/>
								<button
									class="nradius pointer btn cta"
									type="button"
									on:click={() => (showPassword = !showPassword)}
								>
									{showPassword ? 'Ocultar' : 'Mostrar'}
								</button>
							</div>
							<a href="#forgot" class="w1 block forgot opensans fw-800 tcenter">
								He olvidado mi contraseña
							</a>
						</div>

						<div class="w1 flex between row">
							<a href="/register">
								<button type="button" class="w1 btn"> Registrar </button>
							</a>
							<button class="btn cta" type="submit">Acceder</button>
						</div>
					</AsyncForm>
				</div>
			</div>
		</div>
	</div>
</PageWrapper>

<style>
	.login-container {
		position: absolute;
		top: 50%;
		right: 50px;
		transform: translateY(-50%);
		width: 100%;
		max-width: 400px;
		padding: 20px;
		background-color: #ffffff5e;
		border-radius: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	@media screen and (max-width: 768px) {
		.login-container-wrapper {
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
		}
		.login-container {
			position: static;
			transform: translate(0);
		}
	}
</style>
