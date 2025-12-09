// Authentication Module

let currentUser = null;
let authStateCallbacks = [];
let authInitialized = false;

// Set up auth state listener IMMEDIATELY (before DOM loads)
auth.onAuthStateChanged((user) => {
  currentUser = user;
  authInitialized = true;

  // Wait for DOM to be ready before updating UI
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      updateAuthUI(user);
      notifyCallbacks(user);
    });
  } else {
    updateAuthUI(user);
    notifyCallbacks(user);
  }
});

// Handle redirect result IMMEDIATELY
auth.getRedirectResult().then((result) => {
  if (result && result.user) {
    currentUser = result.user;
    updateAuthUI(result.user);
    notifyCallbacks(result.user);
  }
}).catch((error) => {
  if (error.code !== 'auth/popup-closed-by-user') {
    alert('Sign in error: ' + error.message);
  }
});

// Notify all registered callbacks
function notifyCallbacks(user) {
  authStateCallbacks.forEach(callback => {
    try {
      callback(user);
    } catch (e) {
      console.error('Callback error:', e);
    }
  });
}

// Sign in with Google
async function signInWithGoogle() {
  try {
    // Use popup instead of redirect
    const result = await auth.signInWithPopup(googleProvider);
    if (result.user) {
      currentUser = result.user;
      updateAuthUI(result.user);
      notifyCallbacks(result.user);
    }
  } catch (error) {
    alert('Failed to sign in: ' + error.message);
  }
}

// Sign out
async function signOut() {
  try {
    await auth.signOut();
    currentUser = null;
  } catch (error) {
    console.error('Sign out error:', error);
    alert('Failed to sign out. Please try again.');
    throw error;
  }
}

// Auth state listener - register additional callbacks
function onAuthStateChange(callback) {
  authStateCallbacks.push(callback);
  // If auth already initialized, call immediately
  if (authInitialized) {
    callback(currentUser);
  }
}

// Update UI based on auth state
function updateAuthUI(user) {
  console.log('updateAuthUI called, user:', user ? user.displayName : 'null');

  const authButton = document.getElementById('auth-button');
  const userInfo = document.getElementById('user-info');
  const protectedElements = document.querySelectorAll('.requires-auth');

  console.log('Found authButton:', !!authButton);
  console.log('Found userInfo:', !!userInfo);

  if (user) {
    // User is signed in
    console.log('User is signed in');
    if (authButton) {
      authButton.textContent = 'Sign Out';
      authButton.onclick = signOut;
    }
    if (userInfo) {
      userInfo.innerHTML = `
        <img src="${user.photoURL || ''}" alt="${user.displayName}" class="user-avatar">
        <span class="user-name">${user.displayName}</span>
      `;
      userInfo.style.display = 'flex';
    }
    protectedElements.forEach(el => el.style.display = 'block');
  } else {
    // User is signed out
    console.log('User is signed out');
    if (authButton) {
      authButton.textContent = 'Sign in with Google';
      authButton.onclick = signInWithGoogle;
    }
    if (userInfo) {
      userInfo.innerHTML = '';
      userInfo.style.display = 'none';
    }
    protectedElements.forEach(el => el.style.display = 'none');
  }
}

// Get current user
function getCurrentUser() {
  return currentUser;
}

// Check if user is authenticated
function isAuthenticated() {
  return currentUser !== null;
}
