import { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import CadastroForm from "../../components/auth/CadastroForm";
import styles from './AuthPage.module.css';

export default function AuthPage({ setToken }) {
  const [tela, setTela] = useState("login");

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <h1 className={styles.logo}>Gestão SSO</h1>

        <div className={styles.toggleContainer}>
          <button
            onClick={() => setTela("login")}
            className={`${styles.toggleButton} ${tela === 'login' ? styles.activeButton : ''}`}
          >
            Login
          </button>
          <button
            onClick={() => setTela("cadastro")}
            className={`${styles.toggleButton} ${tela === 'cadastro' ? styles.activeButton : ''}`}
          >
            Cadastrar
          </button>
        </div>

        {tela === "login" ? (
          <LoginForm setToken={setToken} />
        ) : (
          <CadastroForm />
        )}
      </div>
    </div>
  );
}