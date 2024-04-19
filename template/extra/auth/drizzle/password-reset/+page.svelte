<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

  /**
	 * here the user will enter his email we check whether is valid or not and if it linked to an account
	 * we send him an email with otp code
	 * he verifies himself by typing the otp code
	 * reset his password and get redirected to auth page 
	 * Note: we need to to store the email to then use it to reset the password (you can set it as query param)
	 */

	export let form: { message: string };
	let email=""
	let state: 'send' | 'verify' | 'reset' = 'send';
	const verifyEnhance: SubmitFunction = async () => {
		return ({ result, update }) => {
			if (result.type == 'success') state = 'reset';
			update();
		};
	};

	const sendEnhance: SubmitFunction = async () => {
		return ({ result, update }) => {
			if (result.type == 'success') state = 'verify';
			update();
		};
	};
	const resetEnhance :SubmitFunction =async ({formData})=>{
		  formData.append("email",email)
	}
</script>

<div class="emailVerification">
	<div class="wrapper">
		{#if state == 'send'}
			<span class="message">
				Please provide the email address associated with the account for which you would like to
				reset the password.</span
			>
			<form action="?/send" method="post" use:enhance={sendEnhance}>
				<input type="email" name="email" bind:value={email} />
				<button>Send me an email</button>
			</form>
		{:else if state == 'verify'}
			<span class="message">
				An email has been sent to your address. If you have not yet received it, we recommend
				checking your spam folder. Once located, please proceed by copying the verification code and
				pasting it below.
			</span>
			<form action="?/verify" method="post" use:enhance={verifyEnhance}>
				<input type="text" name="otp" />
				<button>Verify</button>
			</form>
		{:else}
			<span class="message">Type your new password </span>
			<form action="?/reset" method="post" use:enhance={resetEnhance}>
				<input type="password" name="password" />
				<button>confirm</button>
			</form>
		{/if}
		{#if form}
			<span class="error">{form.message}</span>
		{/if}
	</div>
</div>

<style>
	.emailVerification {
		height: 100vh;
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.wrapper {
		width: 60%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		padding: 2rem;
		border-radius: 8px;
	}

	.wrapper form {
		display: contents;
	}

	.wrapper .message {
		color: #121212;
		word-break: break-all;
	}

	.wrapper input{
		border: 2px solid #121212;
	}
	.wrapper input:focus{
		border: 2px solid #3498db;
	}

	.wrapper input,
	.wrapper button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border-radius: 4px;
	}

	.wrapper button {
		background-color: #3498db;
		color: white;
		border: none;
		cursor: pointer;
	}
	.error {
		font-size: 0.9rem;
		color: #ff0000;
	}
</style>
