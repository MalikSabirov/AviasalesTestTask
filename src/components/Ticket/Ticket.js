import style from './style.module.scss'

const Ticket = ({
  price,
  imgUrl,
  flightTo,
  flightFrom,
}) => {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <p>{price} Р</p>

        <img src={imgUrl} alt="logo"/>
      </div>

      <div className={style.flightInfo}>
        <dl className={style.flightInfoItem}>
          <dt>{flightTo.direction}</dt>
          <dd>{flightTo.time}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>В пути</dt>
          <dd>{flightTo.duration}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>{flightTo.stopsNum}</dt>
          <dd>{flightTo.stops}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>{flightFrom.direction}</dt>
          <dd>{flightFrom.time}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>В пути</dt>
          <dd>{flightFrom.duration}</dd>
        </dl>

        <dl className={style.flightInfoItem}>
          <dt>{flightFrom.stopsNum}</dt>
          <dd>{flightFrom.stops}</dd>
        </dl>
      </div>
    </div>
  )
}

export default Ticket
