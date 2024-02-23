import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <img src="/src/assets/logo.png" alt="logo" />
      </div>
      <div className={styles.header__info}>
        <div className={styles.header__contacts}>
          <p className={styles.header__phone}>+7 343 290 84 76</p>
          <p className={styles.header__email}>info@66bit.ru</p>
        </div>
        <button className={styles.header__button}>
          <div className={styles.button__icon}>
            <img src="/src/assets/Moon.svg" alt="switch" />
          </div>
        </button>
      </div>
    </header>
  )
}

export default Header;