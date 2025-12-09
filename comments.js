// Comments Functionality

let commentsUnsubscribe = null;

// Initialize comments
function initComments() {
  // Listen for auth state to enable/disable comment form
  onAuthStateChange((user) => {
    updateCommentFormState(user);
    // Reload comments to update like buttons when auth changes
    loadComments();
  });

  // Set up comment form
  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', handleCommentSubmit);
  }

  // Load comments with real-time updates
  loadComments();
}

// Update comment form based on auth state
function updateCommentFormState(user) {
  const commentInput = document.getElementById('comment-input');
  const commentSubmit = document.getElementById('comment-submit');
  const commentAuthPrompt = document.getElementById('comment-auth-prompt');

  if (user) {
    if (commentInput) commentInput.disabled = false;
    if (commentSubmit) commentSubmit.disabled = false;
    if (commentInput) commentInput.placeholder = 'Write a comment...';
    if (commentAuthPrompt) commentAuthPrompt.style.display = 'none';
  } else {
    if (commentInput) commentInput.disabled = true;
    if (commentSubmit) commentSubmit.disabled = true;
    if (commentInput) commentInput.placeholder = 'Sign in to comment';
    if (commentAuthPrompt) commentAuthPrompt.style.display = 'block';
  }
}

// Load comments with real-time listener
function loadComments() {
  const commentsContainer = document.getElementById('comments-list');
  if (!commentsContainer) return;

  // Unsubscribe from previous listener if exists
  if (commentsUnsubscribe) {
    commentsUnsubscribe();
  }

  // Set up real-time listener
  commentsUnsubscribe = db.collection('comments')
    .orderBy('timestamp', 'desc')
    .limit(50)
    .onSnapshot((snapshot) => {
      commentsContainer.innerHTML = '';

      if (snapshot.empty) {
        commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
        return;
      }

      snapshot.forEach((doc) => {
        const comment = { id: doc.id, ...doc.data() };
        const commentElement = createCommentElement(comment);
        commentsContainer.appendChild(commentElement);
      });
    }, (error) => {
      console.error('Error loading comments:', error);
      commentsContainer.innerHTML = '<p class="comments-error">Failed to load comments.</p>';
    });
}

// Create comment DOM element
function createCommentElement(comment) {
  const div = document.createElement('div');
  div.className = 'comment';
  div.dataset.id = comment.id;

  const user = getCurrentUser();
  const isOwner = user && user.uid === comment.userId;
  const hasLiked = user && comment.likes && comment.likes.includes(user.uid);
  const likeCount = comment.likes ? comment.likes.length : 0;

  const timestamp = comment.timestamp ? formatTimestamp(comment.timestamp) : 'Just now';

  div.innerHTML = `
    <div class="comment-header">
      <img src="${comment.userPhoto || 'https://via.placeholder.com/32'}" alt="${comment.userName}" class="comment-avatar">
      <span class="comment-author">${comment.userName}</span>
      <span class="comment-time">${timestamp}</span>
    </div>
    <div class="comment-body">
      <p class="comment-text">${escapeHtml(comment.text)}</p>
    </div>
    <div class="comment-actions">
      <button class="like-button ${hasLiked ? 'liked' : ''}" onclick="toggleLike('${comment.id}')" ${!user ? 'disabled' : ''}>
        <span class="like-icon">${hasLiked ? '♥' : '♡'}</span>
        <span class="like-count">${likeCount}</span>
      </button>
      ${isOwner ? `<button class="delete-button" onclick="deleteComment('${comment.id}')">Delete</button>` : ''}
    </div>
  `;

  return div;
}

// Handle comment submission
async function handleCommentSubmit(e) {
  e.preventDefault();

  const user = getCurrentUser();
  if (!user) {
    alert('Please sign in to comment.');
    return;
  }

  const input = document.getElementById('comment-input');
  const submitBtn = document.getElementById('comment-submit');
  const text = input.value.trim();

  if (!text) return;

  // Disable form while submitting
  input.disabled = true;
  submitBtn.disabled = true;

  try {
    await db.collection('comments').add({
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userPhoto: user.photoURL || '',
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      likes: []
    });

    input.value = '';
  } catch (error) {
    console.error('Error posting comment:', error);
    alert('Failed to post comment. Please try again.');
  }

  // Re-enable form
  input.disabled = false;
  submitBtn.disabled = false;
  input.focus();
}

// Toggle like on a comment
async function toggleLike(commentId) {
  const user = getCurrentUser();
  if (!user) {
    alert('Please sign in to like comments.');
    return;
  }

  const commentRef = db.collection('comments').doc(commentId);

  try {
    const doc = await commentRef.get();
    if (!doc.exists) return;

    const likes = doc.data().likes || [];
    const userIndex = likes.indexOf(user.uid);

    if (userIndex > -1) {
      // Remove like
      likes.splice(userIndex, 1);
    } else {
      // Add like
      likes.push(user.uid);
    }

    await commentRef.update({ likes: likes });
  } catch (error) {
    console.error('Error toggling like:', error);
  }
}

// Delete a comment
async function deleteComment(commentId) {
  const user = getCurrentUser();
  if (!user) return;

  if (!confirm('Are you sure you want to delete this comment?')) {
    return;
  }

  try {
    const commentRef = db.collection('comments').doc(commentId);
    const doc = await commentRef.get();

    if (doc.exists && doc.data().userId === user.uid) {
      await commentRef.delete();
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    alert('Failed to delete comment. Please try again.');
  }
}

// Format timestamp
function formatTimestamp(timestamp) {
  if (!timestamp) return 'Just now';

  const date = timestamp.toDate();
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initComments);
