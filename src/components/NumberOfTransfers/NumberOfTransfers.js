import style from './style.module.scss'

const NumberOfTransfers = ({
  NumberOfTransfers, 
  handleChange
}) => {
  const filterListItemComponent = NumberOfTransfers.map(item => {
    return (
      <li className={style.filterListItem} key={item.id}>
        <input type="checkbox" checked={item.isChecked} onChange={() => handleChange(item.id)}/>
        <span>{item.title}</span>
      </li>
    )
  })

  return(
    <div className={style.container}>
      <p className={style.title}>Количество пересадок</p>

      <ul className={style.filterList}>
        {filterListItemComponent}
      </ul>
    </div>
  )
}

export default NumberOfTransfers
