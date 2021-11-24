import style from './style.module.scss'

const Tabs = ({
  tabsData,
  tabs,
  changeTab
}) => {

  const tabsComponent = tabsData.map(item => {
    return (
      <button 
        key={item.id} 
        onClick={() => changeTab(item.id)}
        className={`tabs-item ${item.isActive ? "activeTab" : ""}`}
      >
        {item.title}
        {tabs}
      </button>
    )
  })

  return(
    <div className={style.container}>
      {tabsComponent}
    </div>
  )
}

export default Tabs
