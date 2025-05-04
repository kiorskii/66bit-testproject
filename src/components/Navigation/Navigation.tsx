import { Link, useParams, useLocation } from "react-router-dom";
import styles from "./Navigation.module.css";

const Navigation = ({ employeeName }) => {
  const { id } = useParams();
  const { pathname } = useLocation(); // ← получаем текущий URL

  /* определяем первый сегмент после «/» */
  const firstSeg = pathname.split("/")[1] || "";

  /* карта «URL-сегмент → подпись» */
  const labelMap: Record<string, string> = {
    employee: "Сотрудник",
    employees: "Список сотрудников",
    "add-employee": "Добавить сотрудника",
    "import-employees": "Импорт из файла",
    "create-project": "Создать проект",
    projects: "Проекты",
    analytics: "Аналитика",
    settings: "Настройки",
  };

  /* ссылка для второго элемента */
  const secondHref = firstSeg ? `/${firstSeg}` : "/";

  return (
    <div className={styles.navigation}>
      <ul className={styles.navigation__list}>
        {/* 1. Главная */}
        <li className={styles.navigation__item}>
          <Link to="/" className={styles.navigation__link}>
            Главная
          </Link>
        </li>

        {/* разделитель */}
        {firstSeg && <p>{">"}</p>}

        {/* 2. динамическая подпись */}
        {firstSeg && (
          <li className={styles.navigation__item}>
            <Link to={secondHref} className={styles.navigation__link}>
              {labelMap[firstSeg] || firstSeg}
            </Link>
          </li>
        )}

        {/* 3. имя сотрудника (как было) */}
        {id && (
          <>
            <p>{">"}</p>
            <li
              className={`${styles.navigation__item} ${styles.navigation__name}`}
            >
              <a href="#" className={styles.navigation__link}>
                {employeeName}
              </a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navigation;
