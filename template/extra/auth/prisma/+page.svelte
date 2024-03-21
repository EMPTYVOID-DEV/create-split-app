<script lang="ts">
	import { enhance } from '$app/forms';

	export let form: string;
	let action: 'signin' | 'signup' = 'signup';
</script>

<div class="auth">
	<form class="auth-form" method="post" action="?/{action}" use:enhance>
		{#if action == 'signup'}
			<input class="auth-input" type="text" name="username" placeholder="Username" />
		{/if}
		<input class="auth-input" type="email" name="email" placeholder="Email" />
		<input class="auth-input" type="password" name="password" placeholder="Password" />
		<button class="auth-btn" type="submit">{action === 'signup' ? 'Sign Up' : 'Sign In'}</button>
		<span class="error">{form || ''}</span>
	</form>

	<div class="change-action">
		{#if action == 'signup'}
			<span
				>Already have an account <button
					class="change-action-btn"
					on:click={() => (action = 'signin')}>Sign In</button
				></span
			>
		{:else}
			<span
				>Don't have an account <button
					class="change-action-btn"
					on:click={() => (action = 'signup')}>Sign Up</button
				></span
			>
		{/if}
	</div>

	<a href="/auth/github" class="github">{action == 'signin' ? 'Sign in' : 'Sign up'} with GitHub</a>
</div>

<style>
	.auth {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.auth-form {
		width: 30%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.auth-input {
		padding: 0.5rem;
		border: 1px solid #000000;
		border-radius: 0.25rem;
		font-size: 1rem;
		outline: none;
	}

	.auth-input:focus {
		border: 2px solid #3498db;
	}

	.auth-btn {
		padding: 0.75rem 1.5rem;
		background-color: #3498dbb9;
		color: #fff;
		border: none;
		border-radius: 0.25rem;
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
	}

	.error {
		font-size: 0.9rem;
		color: #ff0000;
	}

	.auth-btn:hover {
		background-color: #3498db;
	}

	.change-action {
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	.change-action-btn {
		background: none;
		border: none;
		color: #3498db;
		font-weight: 500;
		cursor: pointer;
		transition: color 0.2s ease-in-out;
	}

	.github {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background-color: #000000b9;
		color: #fff;
		text-decoration: none;
		border-radius: 0.25rem;
		font-weight: 500;
		transition: background-color 0.2s ease-in-out;
	}

	.github:hover {
		background-color: #000000;
	}

	@media screen and (width<768px) {
		.auth-form {
			width: 90%;
		}
	}
</style>
