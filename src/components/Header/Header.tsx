import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './Header.module.css';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { theme, toggleTheme }: any = useTheme();
  const { user, logout } = useAuth(); 


  return (
    <header className={styles.header}>
      <Link to={'/'} className={styles.header__logo}>
        <img className={styles.header__img} src="/src/assets/logo.png" alt="logo" />
      </Link>
      <div className={styles.header__info}>
        <div className={styles.header__contacts}>
          <a className='link' href='tel:+7 343 290 52 92'>+7 343 290 52 92</a>
          <a className='link' href='mailto:info@hrmanager.ru'>info@hrmanager.ru</a>
        </div>
        <button onClick={toggleTheme} className={styles.header__button}>
          <div className={styles.button__icon + ' ' + styles[theme]}>
          </div>
        </button>

        {user && (
        <button onClick={logout} className={styles.button__logout + " button"}>
          Выйти
        </button>
      )}
      </div>
    </header>
  )
}

export default Header;