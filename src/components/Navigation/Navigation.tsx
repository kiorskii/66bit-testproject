import styles from './Navigation.module.css'

const Navigation = () => {
  return (
    <div className={styles.navigation}>
      <ul className={styles.navigation__list}>
        <li className={styles.navigation__item}>
          <a href="#" className={styles.navigation__link}>
            Главная
          </a>
        </li>
        <p>{">"}</p>
        <li className={styles.navigation__item}>
          <a href="#" className={styles.navigation__link}>
            Список сотрудников
          </a>
        </li>
      </ul>
    </div>
  )
}

export default Navigation;