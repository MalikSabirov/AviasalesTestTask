import style from './style.module.scss'

const FilterCheckbox = ({ isChecked, title, onChange }) => {
  return (
    <label>
      <input type="checkbox" checked={isChecked} onChange={onChange} />
      <span>{title}</span>
    </label>
  )
}

const NumberOfTransfers = ({ numberOfTransfers, handleChange }) => {
  return(
    <div className={style.container}>
      <p className={style.title}>Количество пересадок</p>

      <ul className={style.filterList}>
        {numberOfTransfers.map(item => {
          return (
            <li className={style.filterListItem} key={item.id}>
              <FilterCheckbox 
                id={item.id}
                title={item.title}
                isChecked={item.isChecked}
                onChange={() => handleChange(item.id)}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default NumberOfTransfers
