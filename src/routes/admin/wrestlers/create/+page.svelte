<script>
	import AsyncForm from '$lib/components/forms/async-form.svelte';
	import PageWrapper from '$lib/components/page-wrapper/page-wrapper.svelte';
</script>

<PageWrapper page="wrestler-create">
	<AsyncForm redirect="/admin/wrestlers" method="post" buttonText="Crear luchador">
		<div class="form-cols">
			<div class="form-item">
				<label for="name">Nombre</label>
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
				<label for="status">Estado</label>
				<select name="status" id="status" required>
					<option value="active">Activo</option>
					<option value="inactive">Inactivo</option>
				</select>
			</div>

			<div class="form-item">
				<label for="twitter_acc">Cuenta Twitter</label>
				<input type="text" id="twitter_acc" name="twitter_acc" required />
			</div>

			<div class="form-item">
				<label for="twitter_name">Nombre de Twitter</label>
				<input type="text" id="twitter_name" name="twitter_name" required />
			</div>

			<div class="form-item">
				<label for="finisher">Finisher</label>
				<input type="text" id="finisher" name="finisher" required />
			</div>

			<div class="form-item">
				<label for="overall">Media</label>
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

			<input type="hidden" name="test[]" value="a" />
			<input type="hidden" name="test[]" value="b" />
			<input type="hidden" name="test[]" value="c" />
		</div>

		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Praesentium ratione neque commodi,
			porro quaerat, est explicabo ea corporis repudiandae alias consequuntur impedit debitis
			corrupti eligendi doloribus. Repellendus ullam est minus.
		</p>
	</AsyncForm>
</PageWrapper>

<style>
	.form-cols {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		padding: 25px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		background-color: #eee;
		border-radius: 10px;
		gap: 20px;
	}

	.form-cols .form-item {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.form-cols .form-item input {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	.form-cols .form-item select {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}
</style>
