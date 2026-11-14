export const firebaseConfig = {
  apiKey: "AIzaSyDzPHEIWeurkX2FNlwUYlDwxkpMzktabTI",
  authDomain: "aula-c-jorge.firebaseapp.com",
  projectId: "aula-c-jorge",
  storageBucket: "aula-c-jorge.firebasestorage.app",
  messagingSenderId: "335432240132",
  appId: "1:335432240132:web:7093e8d5e28e3dd6ca7951",
  measurementId: "G-XN2LBG4FXE",
};

export const apiBase = (import.meta.env.VITE_AULA_API_URL || "/api").replace(/\/$/, "");
