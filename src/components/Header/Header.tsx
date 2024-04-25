import { useTheme } from '../../contexts/ThemeContext';
import styles from './Header.module.css';

const Header = () => {
  const { theme, toggleTheme }: any = useTheme();
  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <img src="/src/assets/logo.png" alt="logo" />
      </div>
      <div className={styles.header__info}>
        <div className={styles.header__contacts}>
          <a className='link' href='tel:+7 343 290 84 76'>+7 343 290 84 76</a>
          <a className='link' href='mailto:info@66bit.ru'>info@66bit.ru</a>
        </div>
        <button onClick={toggleTheme} className={styles.header__button}>
          <div className={styles.button__icon + ' ' + styles[theme]}>
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header;