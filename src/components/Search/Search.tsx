import React, { useState } from 'react';
import styles from './Search.module.css';
import { useEmployee } from '../../contexts/EmployeeContext';



const Search = () => {
  // Pop-up functionality
  const [activePopup, setActivePopup] = useState("none");

  const handlePopupClick = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const togglePopup = (id: string) => {
    if (activePopup === id) {
      setActivePopup("none");
    } else {
      setActivePopup(id);
    }
  };


  // Filters/Sorting functionality
  const {
    setFilters, setPage, setHasMore
  } = useEmployee();

  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState([]);
  const [genderFilter, setGenderFilter] = useState([]);
  const [stackFilter, setStackFilter] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;
    switch (name) {
      case 'position':
        setPositionFilter(updateFilter(positionFilter, value, checked));
        break;
      case 'gender':
        setGenderFilter(updateFilter(genderFilter, value, checked));
        break;
      case 'stack':
        setStackFilter(updateFilter(stackFilter, value, checked));
        break;
    }
  };

  const updateFilter = (filters, value, checked) => {
    return checked ? [...filters, value] : filters.filter(f => f !== value);
  };

  const handleSearchSubmit = () => {
    setFilters({ genderFilter, positionFilter, stackFilter, searchQuery });
    setPage(1);
    setHasMore(true);
  };


  // Filters Delete and render logic
  const renderSelectedFilters = () => {
    const filters: string[] = [];
    filters.push(...positionFilter);

    filters.push(...genderFilter);

    filters.push(...stackFilter);


    return filters.map(filter => (
      <li key={filter} className={styles.search__filter} onClick={() => handleDeleteFilter(filter)}>
        <div className={styles.search__delete}>
          <span></span><span></span>
        </div>
        {filter}
      </li>
    ));
  };

  const handleDeleteFilter = (filter: any) => {
    if (positionFilter.includes(filter)) {
      setPositionFilter(positionFilter.filter(f => f !== filter));
    }

    if (genderFilter.includes(filter)) {
      setGenderFilter(genderFilter.filter(f => f !== filter));
    }

    if (stackFilter.includes(filter)) {
      setStackFilter(stackFilter.filter(f => f !== filter));
    }
  };



  return (
    <>
      <div className={styles.search}>
        <h1 className={styles.search__title}>Список сотрудников</h1>
        <input
          className={styles.search__input}
          placeholder="Поиск"
          value={searchQuery}
          onChange={handleSearchChange} />
        <ul className={styles.search__criterias}>
          <li className={styles.search__criteria} onClick={() => togglePopup('position')}>
            <p className="criteria__name link">Должность</p>
            <img src="/src/assets/down_arrow.svg" alt="" />
            {activePopup === 'position' && (
              <div className={styles.popup + ' ' + styles.popup_position}>
                <div className={styles.popup__content} onClick={handlePopupClick}>
                  <ul className={styles.post__list}>
                    {['Backend-разработчик', 'Frontend-разработчик', 'Аналитик', 'Менеджер', 'Дизайнер', 'Fullstack'].map((positionName, index) => (
                      <li key={index} className={styles.post__item}>
                        <label className={`${styles.post__label} link`} >
                          {positionName}
                          <input type="checkbox"
                            className={styles.customCheckbox}
                            value={positionName}
                            name="position"
                            onChange={handleCheckboxChange}
                            checked={positionFilter.includes(positionName)} />
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
          <li className={styles.search__criteria} onClick={() => togglePopup('gender')}>
            <p className="criteria__name link">Пол</p>
            <img src="/src/assets/down_arrow.svg" alt="" />
            {activePopup === 'gender' && (
              <div className={styles.popup}>
                <div className={styles.popup__content} onClick={handlePopupClick}>
                  <ul className={styles.post__list}>
                    {['Мужчина', 'Женщина'].map((genderName, index) => (
                      <li key={index} className={styles.post__item}>
                        <label className={`${styles.post__label} link`}>
                          {genderName}
                          <input type="checkbox"
                            className={styles.customCheckbox}
                            value={genderName}
                            name="gender"
                            onChange={handleCheckboxChange}
                            checked={genderFilter.includes(genderName)} />
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
          <li className={styles.search__criteria} onClick={() => togglePopup('stack')}>
            <p className="criteria__name link">Стек технологий</p>
            <img src="/src/assets/down_arrow.svg" alt="" />
            {activePopup === 'stack' && (
              <div className={styles.popup}>
                <div className={styles.popup__content} onClick={handlePopupClick}>
                  <ul className={styles.post__list}>
                    {['C#', 'React', 'Java', 'PHP', 'Figma', 'Word'].map((stackName, index) => (
                      <li key={index} className={styles.post__item}>
                        <label className={`${styles.post__label} link`}>
                          {stackName}
                          <input type="checkbox"
                            className={styles.customCheckbox}
                            value={stackName} name="stack"
                            onChange={handleCheckboxChange}
                            checked={stackFilter.includes(stackName)} />
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
        </ul>
      </div>
      <div className={styles.search__info}>
        <ul className={styles.search__filters}>
          <p className={styles.search__pretitle}>Выбранные фильтры: </p>
          {renderSelectedFilters()}
        </ul>
        <button onClick={handleSearchSubmit} className={styles.search__button}>Найти</button>
      </div>
    </>
  )
}

export default Search;
