const SESSION_KEY = 'letape_welcome_entered';

/** In-memory fallback for native sessions without sessionStorage. */
let enteredThisSession = false;

/** Whether the user has already passed the welcome screen this session. */
export function hasEnteredWelcome(): boolean {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  }
  return enteredThisSession;
}

/** Mark the welcome screen as completed for the current session. */
export function markWelcomeEntered(): void {
  enteredThisSession = true;
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, '1');
  }
}

/** Clears session flag — useful for future settings or auth flows. */
export function resetWelcomeSession(): void {
  enteredThisSession = false;
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem(SESSION_KEY);
  }
}
