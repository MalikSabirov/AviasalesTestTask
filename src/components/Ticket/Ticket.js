import style from './style.module.scss'

const getStopsText = (stops) => {
  if (stops < 0) {
    return ""
  } else if (stops === 0) {
    return "Без пересадок"
  } else if (stops === 1) {
    return "1 пересадка"
  } else if (stops >= 2 && stops <= 4) {
    return `${stops} пересадки`
  } else {
    return `${stops} пересадок`
  }
}

const Ticket = ({
  imgUrl,
  price,

  originTo,
  destinationTo,
  flightTimeThere,
  durationTo,
  flightToStops,

  originFrom,
  destinationFrom,
  flightTimeBack,
  durationFrom,
  flightFromStops,
}) => {
  const flightToStopsText = getStopsText(flightToStops.length)
  const flightFromStopsText = getStopsText(flightFromStops.length)

  return (
    <div className={style.container}>
      <div className={style.header}>
        <p>{price} Р</p>

        <img src={imgUrl} alt="logo"/>
      </div>

      <div className={style.flightInfo}>
        <dl className={style.flightInfoItem}>
          <dt>{originTo} – {destinationTo}</dt>
          <dd>{flightTimeThere}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>В пути</dt>
          <dd>{durationTo}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>{flightToStopsText}</dt>
          <dd>{flightToStops}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>{originFrom} – {destinationFrom}</dt>
          <dd>{flightTimeBack}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>В пути</dt>
          <dd>{durationFrom}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>{flightFromStopsText}</dt>
          <dd>{flightFromStops}</dd>
        </dl>
      </div>
    </div>
  )
}

export default Ticket
