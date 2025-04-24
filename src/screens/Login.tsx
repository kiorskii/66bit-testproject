import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/employees', { replace: true });   

    } catch {
      setErr('Неверный логин или пароль');
    }
  };

  return (
    <form onSubmit={submit} className="login-form">
      <h1>Вход</h1>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Пароль"
      />
      {error && <span className="error">{error}</span>}
      <button type="submit">Войти</button>
    </form>
  );
}
