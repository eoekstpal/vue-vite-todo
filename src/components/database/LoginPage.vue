<template>
    <div class="login-page">
      <h1>Welcome to Todo App</h1>
      <button @click="signInWithGoogle" class="google-login-btn">
        Sign in with Google
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { supabase } from '../../services/supabase'
  
  async function signInWithGoogle() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in with Google:', error)
      alert('Error signing in with Google. Please try again.')
    }
  }
  </script>
  
  <style scoped>
  .login-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  
  .google-login-btn {
    background-color: #4285F4;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .google-login-btn:hover {
    background-color: #357AE8;
  }
  </style>