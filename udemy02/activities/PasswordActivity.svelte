<script>
	let password = "";
	let displayPassword;
	let addedPassword = false;
	let passwordValidity = "short";

	let passwords = [];

	$: if (password.trim().length < 5) {
		passwordValidity = "short";
	} else if (password.trim().length > 10) {
		passwordValidity = "long";
	} else {
		passwordValidity = "valid";
	}

	function appendPassword() {
		if (passwordValidity !== "valid") {
			return;
		}
		passwords = [...passwords, password];
	}

	function removePassword(index) {
		passwords = passwords.filter((_, i) => {
			return i !== index;
		});
	}
</script>

<h1>Assignment</h1>

<p>Solve these tasks.</p>

<ol>
	<li>Add a password input field and save the user input in a variable.</li>
	<li>
		Output "Too short" if the password is shorter than 5 characters and "Too
		long" if it's longer than 10.
	</li>
	<li>
		Output the password in a paragraph tag if it's between these boundaries.
	</li>
	<li>Add a button and let the user add the passwords to an array.</li>
	<li>Output the array values (= passwords) in a unordered list (ul tag).</li>
	<li>Bonus: If a password is clicked, remove it from the list.</li>
</ol>

<hr />

<h1>Solution</h1>

<div id="password-form">
	<div class="form-control">
		<label for="password">Password</label>
		<input type="password" id="password" bind:value={password} />
	</div>
</div>

{#if passwordValidity === "short"}
	<p class="error">Password is too short</p>
{:else if passwordValidity === "long"}
	<p class="error">Password is too long</p>
{:else}
	<p>&nbsp;</p>
{/if}

<button on:click={appendPassword}>Set Password</button>

<ul>
	{#each passwords as password, index (password)}
		<li on:click={removePassword.bind(this, index)}>{password}</li>
	{:else}
		<li class="error">No passwords</li>
	{/each}
</ul>

{#if addedPassword}
	<p>Password: {displayPassword}</p>
{/if}

<style>
	.error {
		color: red;
	}
</style>
