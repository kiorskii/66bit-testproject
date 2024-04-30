import { Link } from 'react-router-dom'
import styles from './Welcome.module.css'

const Welcome = () => {
  return (
    <div className={styles.welcome}>
      <h1 className={styles.title}>Добро пожаловать!</h1>
      <Link to={"/employees"} className="button">Вход в систему</Link>
    </div>
  )
}

export default Welcome