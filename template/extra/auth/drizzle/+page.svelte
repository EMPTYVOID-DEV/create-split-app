<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	export let form: { message: string };
	let action: 'sign in' | 'sign up' = 'sign up';
</script>

<div class="auth">
	<form class="auth-form" method="post" action="?/{action}" use:enhance>
		{#if action == 'sign up'}
			<input class="auth-input" type="text" name="username" placeholder="Username" />
		{/if}
		<input class="auth-input" type="email" name="email" placeholder="Email" />
		<input class="auth-input" type="password" name="password" placeholder="Password" />
		<button class="auth-btn" type="submit">{action === 'sign up' ? 'Sign Up' : 'Sign In'}</button>
		{#if form}
			<span class="error">{form.message}</span>
		{/if}
	</form>

	<div class="change-action">
		{#if action == 'sign up'}
			<span
				>Already have an account <button
					class="change-action-btn"
					on:click={() => (action = 'sign in')}>Sign In</button
				></span
			>
		{:else}
			<span
				>Don't have an account <button
					class="change-action-btn"
					on:click={() => (action = 'sign up')}>Sign Up</button
				></span
			>
			<span
				>Forget your password <button
					class="change-action-btn"
					on:click={() => goto('/auth/password-reset')}
				>
					Reset it</button
				></span
			>
		{/if}
	</div>

	<a href="/auth/github" class="github">{action == 'sign in' ? 'Sign in' : 'Sign up'} with GitHub</a
	>
</div>

<style>
	.auth {
		width: 100vw;
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
	}

	.auth-form {
		width: 60%;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.auth-input {
		padding: 0.5rem;
		border: 2px solid #121212;
		border-radius: 0.25rem;
		font-size: 1rem;
		outline: none;		
	}

	.auth-input:focus {
		border: 2px solid #3498db;
	}

	.auth-btn {
		padding: 0.75rem 1.5rem;
		background-color: #3498db;
		color: #fff;
		border: none;
		border-radius: 0.25rem;
		font-weight: 500;
		cursor: pointer;
	}

	.error {
		font-size: 0.9rem;
		color: #ff0000;
	}


	.change-action {
		display: flex;
		flex-direction: column;
		font-size: 0.9rem;
	}

	.change-action-btn {
		background: none;
		border: none;
		color: #3498db;
		font-weight: 500;
		cursor: pointer;
	}

	.github {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		background-color: #121212;
		color: #fff;
		text-decoration: none;
		border-radius: 0.25rem;
		font-weight: 500;
	}


	@media screen and (width<768px) {
		.auth-form {
			width: 90%;
		}
	}
</style>
