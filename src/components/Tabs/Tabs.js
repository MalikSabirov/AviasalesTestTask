import style from './style.module.scss'

const Tabs = (props) => {

  const tabsComponent = props.tabsData.map(item => {
    return (
      <button 
        key={item.id} 
        onClick={() => props.changeTab(item.id)}
        className={`tabs-item ${item.isActive ? "activeTab" : ""}`}
      >
        {item.title}
        {props.tabs}
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
