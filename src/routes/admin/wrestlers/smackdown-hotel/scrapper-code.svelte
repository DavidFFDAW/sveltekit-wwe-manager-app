<script lang="ts">
	const copy = () => {
		const code = document.querySelector('code');
		if (!code || !code.textContent) return;
		navigator.clipboard.writeText(code.textContent);
	};
</script>

<div class="w1 code-preview-copy">
	<small>
		En esta página se proporciona el script que sirve para extraer los datos más importantes de los
		luchadores registrador en la página de Smackdown Hotel. Este script descarga un JSON con los
		datos. También se podrá importar dicho JSON para importar las nuevas adiciones al roster.
	</small>
	<code>
		{@html `
const rosterItems = [...(document.querySelectorAll('.roster_section .roster'))]; </code>
const parsed = rosterItems.map((item) => {
    const overall = item.querySelector('.roster-overall');
    const name = item.querySelector('.roster_name');
    const label = item.querySelector('.roster_label');
    const image = item.querySelector('img');

    return { 
        overall: overall ? Number(overall.textContent) : null,
        name: name ? name.textContent : null,
        label: label ? label.textContent : null,
        image: image ? image.src : null
    };
}).filter((value, index, self) => self.findIndex((t) => t.name === value.name) === index);

const link = document.createElement('a');
link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(parsed, null, 2));
link.download = 'the-smackdown-hotel-roster-${Date.now()}.json';
link.click();
link.remove();
`}
	</code>
	<button class="btn copy" type="button" on:click={copy}>Copy</button>
	<small>
		Para usar este script, simplemente copia el código y pégalo en la consola de tu navegador
		mientras estás en la página de Smackdown Hotel.
	</small>
</div>

<style>
	code {
		width: 100%;
		background-color: #fff;
		padding: 10px;
		display: block;
		border-radius: 5px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
		white-space: pre-wrap;
		overflow: hidden;
	}

	.btn.copy {
		position: absolute;
		top: 10px;
		right: 10px;
	}

	.code-preview-copy {
		position: relative;
	}
</style>
