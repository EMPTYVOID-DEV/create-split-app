<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

  /**
	 * here we prompt the user first that we gonna send him an email to verify his account
	 * we get the email from the url-params
	 * we send him an email with otp
	 * he verifies himself by typing the otp code
	*/

	export let form: { message: string };

	let state: 'send' | 'verify' = 'send';
	const sendEnhance: SubmitFunction = async () => {
		return ({ result, update }) => {
			if (result.type == 'success') state = 'verify';
			update();
		};
	};
</script>

<div class="emailVerification">
	<div class="wrapper">
		{#if state == 'send'}
			<span class="message">
				'Just one more step: let's verify your email. Click "Send me an email" below to receive the
				verification email in your inbox.</span
			>
			<form action="?/send" method="post" use:enhance={sendEnhance}>
				<button>Send me an email</button>
			</form>
		{:else}
			<span class="message">
				An email has been sent to your address. If you have not yet received it, we recommend
				checking your spam folder. Once located, please proceed by copying the verification code and
				pasting it below.
			</span>
			<form action="?/verify" method="post" use:enhance>
				<input type="text" name="otp" />
				<button>Verify</button>
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
		transition: background-color 0.3s ease;
	}
	.error {
		font-size: 0.9rem;
		color: #ff0000;
	}
</style>
