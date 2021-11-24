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

const Ticket = ({
  imgUrl,
  price,

  originTo,
  destinationTo,
  toStartTime,
  toFinishTime,
  durationTo,
  flightToStops,
  flightToStopsAmount,

  originFrom,
  destinationFrom,
  fromStartTime,
  fromFinishTime,
  durationFrom,
  flightFromStops,
  flightFromStopsAmount,
}) => {
  let flightToStopsAmountText = getStopsText(flightToStopsAmount)
  let flightFromStopsAmountText = getStopsText(flightFromStopsAmount)

  return (
    <div className={style.container}>
      <div className={style.header}>
        <p>{price} Р</p>

        <img src={imgUrl} alt="logo"/>
      </div>

      <div className={style.flightInfo}>
        <dl className={style.flightInfoItem}>
          <dt>{originTo} – {destinationTo}</dt>
          <dd>{toStartTime} – {toFinishTime}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>В пути</dt>
          <dd>{durationTo}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>{flightToStopsAmountText}</dt>
          <dd>{flightToStops}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>{originFrom} – {destinationFrom}</dt>
          <dd>{fromStartTime} – {fromFinishTime}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>В пути</dt>
          <dd>{durationFrom}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>{flightFromStopsAmountText}</dt>
          <dd>{flightFromStops}</dd>
        </dl>
      </div>
    </div>
  )
}

export default Ticket
