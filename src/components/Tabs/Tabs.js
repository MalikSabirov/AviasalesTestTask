import style from './style.module.scss'

const TabComponent = ( {title, onClick, tabs, className} ) => {
  return (
    <button onClick={onClick} className={className}>
      {title}
      {tabs}
    </button>
  )
}

const Tabs = ({
  tabsData,
  changeTab
}) => {

  return(
    <div className={style.container}>
      {tabsData.map(item => {
        const tabClasses = [style.tabsItem, item.isActive ? style.tabsItemActive : ''].join(" ")

        return (
          <TabComponent
            key={item.id}
            onClick={() => changeTab(item.id)}
            title={item.title}
            className={tabClasses}
          />
        )
      })}
    </div>
  )
}

export default Tabs
