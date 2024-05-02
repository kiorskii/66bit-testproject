import { Link, useParams } from 'react-router-dom';
import styles from './Navigation.module.css'

const Navigation = ({ employeeName }) => {

  const { id } = useParams();

  return (
    <div className={styles.navigation}>
      <ul className={styles.navigation__list}>
        <li className={styles.navigation__item}>
          <Link to={"/"} className={styles.navigation__link}>
            Главная
          </Link>

        </li>
        <p>{">"}</p>
        <li className={styles.navigation__item}>
          <Link to={"/employees"} className={styles.navigation__link}>
            Список сотрудников
          </Link>
        </li>
        {id &&
          <>
            <p>{">"}</p>
            <li className={styles.navigation__item + ' ' + styles.navigation__name}>
              <a href='#' className={styles.navigation__link}>
                {employeeName}
              </a>
            </li>
          </>
        }
      </ul>
    </div >
  )
}

export default Navigation;