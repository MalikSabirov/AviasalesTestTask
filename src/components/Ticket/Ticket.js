import style from './style.module.scss'

const getStopsText = (stops) => {
  if (stops === 0) {
    return "Без пересадок"
  } else if (stops === 1) {
    return "1 пересадка"
  } else {
    return stops + " пересадки"
  }
}

const Ticket = (props) => {
  let flightToStopsAmountText = getStopsText(props.flightToStopsAmount)
  let flightFromStopsAmountText = getStopsText(props.flightFromStopsAmount)

  return (
    <div className={style.container}>
      <div className={style.header}>
        <p>{props.price} Р</p>

        <img src={props.imgUrl} alt="logo"/>
      </div>

      <div className={style.flightInfo}>
        <dl className={style.flightInfoItem}>
          <dt>{props.originTo} – {props.destinationTo}</dt>
          <dd>{props.toStartTime} – {props.toFinishTime}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>В пути</dt>
          <dd>{props.durationTo}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>{flightToStopsAmountText}</dt>
          <dd>{props.flightToStops}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>{props.originFrom} – {props.destinationFrom}</dt>
          <dd>{props.fromStartTime} – {props.fromFinishTime}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>В пути</dt>
          <dd>{props.durationFrom}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>{flightFromStopsAmountText}</dt>
          <dd>{props.flightFromStops}</dd>
        </dl>
      </div>
    </div>
  )
}

export default Ticket
