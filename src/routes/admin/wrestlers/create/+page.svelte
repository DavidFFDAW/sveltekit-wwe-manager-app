<script>
	import AsyncForm from '$lib/components/forms/async-form.svelte';
</script>

<section class="wwe-new-wrestler-create-panel" style="padding: 20px;">
	<h1>Create a new wrestler</h1>

	<AsyncForm redirect="/admin/wrestlers" method="post">
		<fieldset class="wwe-new-wrestler-create-panel-fieldset">
			<legend>Campos obligatorios</legend>
			<div class="form-item">
				<label for="name">Name</label>
				<input type="text" id="name" name="name" required />
			</div>

			<div class="form-item">
				<label for="brand">Marca</label>
				<select name="brand" id="brand" required>
					<option value="raw">RAW</option>
					<option value="smackdown">SmackDown</option>
					<option value="AWL">AWL</option>
				</select>
			</div>

			<div class="form-item">
				<label for="status">Status</label>
				<select name="status" id="status" required>
					<option value="active">Activo</option>
					<option value="inactive">Inactivo</option>
				</select>
			</div>

			<div class="form-item">
				<label for="twitter_acc">Twitter Account</label>
				<input type="text" id="twitter_acc" name="twitter_acc" required />
			</div>

			<div class="form-item">
				<label for="twitter_name">Twitter Name</label>
				<input type="text" id="twitter_name" name="twitter_name" required />
			</div>

			<div class="form-item">
				<label for="finisher">Finisher</label>
				<input type="text" id="finisher" name="finisher" required />
			</div>

			<div class="form-item">
				<label for="overall">Overall</label>
				<input type="number" id="overall" name="overall" required />
			</div>

			<div class="form-item">
				<label for="sex">Género</label>
				<select name="gender" id="sex" required>
					<option value="M">Hombre</option>
					<option value="F">Mujer</option>
				</select>
			</div>

			<div class="form-item">
				<label for="kayfabe">Kayfabe</label>
				<select name="kayfabe" id="kayfabe" required>
					<option value="face">Face</option>
					<option value="heel">Heel</option>
				</select>
			</div>

			<input type="hidden" name="test" value="a" />
			<input type="hidden" name="test" value="b" />
			<input type="hidden" name="test" value="c" />
		</fieldset>
	</AsyncForm>
</section>
