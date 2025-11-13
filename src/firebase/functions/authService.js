import { 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import { auth } from '../../firebase/functions/firebase.config';

// Configure providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

githubProvider.setCustomParameters({
  allow_signup: 'true'
});

// Email/Password Registration with Email Verification
export const registerWithEmail = async (email, password, fullName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: fullName
    });

    // Send email verification
    await sendEmailVerification(userCredential.user);

    return { 
      success: true, 
      user: userCredential.user,
      emailVerified: false,
      message: 'Registration successful! Please check your email for verification link.'
    };
  } catch (error) {
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    }
    
    return { success: false, error: errorMessage };
  }
};

// Email/Password Login with Email Verification Check
export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if email is verified
    if (!user.emailVerified) {
      await signOut(auth); // Logout user if email not verified
      return { 
        success: false, 
        error: 'Please verify your email address before logging in. Check your inbox for verification link.' 
      };
    }

    return { 
      success: true, 
      user: user,
      emailVerified: true
    };
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password.';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    }
    
    return { success: false, error: errorMessage };
  }
};

// Resend Email Verification
export const resendEmailVerification = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      return { success: true, message: 'Verification email sent successfully!' };
    }
    return { success: false, error: 'No user found. Please log in again.' };
  } catch (error) {
    return { success: false, error: 'Failed to send verification email. Please try again.' };
  }
};

// Google Login
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Google automatically provides displayName and photoURL
    const user = result.user;
    console.log('Google user:', {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    });
    
    return { 
      success: true, 
      user: user,
      emailVerified: true // Google users are automatically verified
    };
  } catch (error) {
    let errorMessage = 'Google login failed. Please try again.';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Login cancelled.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked. Please allow popups for this site.';
    }
    
    return { success: false, error: errorMessage };
  }
};

// GitHub Login
export const loginWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    
    // GitHub automatically provides displayName and photoURL
    const user = result.user;
    console.log('GitHub user:', {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    });
    
    return { 
      success: true, 
      user: user,
      emailVerified: true // GitHub users are automatically verified
    };
  } catch (error) {
    let errorMessage = 'GitHub login failed. Please try again.';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Login cancelled.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup was blocked. Please allow popups for this site.';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with the same email address.';
    }
    
    return { success: false, error: errorMessage };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Check if user email is verified
export const checkEmailVerification = () => {
  const user = auth.currentUser;
  return user ? user.emailVerified : false;
};