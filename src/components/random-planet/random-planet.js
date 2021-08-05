import React, {Component} from 'react';

import SwapiService from '../../services/swapi-service';
import Spinner from '../spinner';
import ErrorIndicator from '../error-indicator';
import placeholder from './big-placeholder.jpg';

import './random-planet.css';

export default class RandomPlanet extends Component {

  swapiService = new SwapiService()

  state = {
    planet: {},
    loading: true,
  }

  componentDidMount() {
    this.updatePlanet()
    this.interval = setInterval(this.updatePlanet, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  onPlanetLoaded = (planet) => {
    this.setState({
      planet,
      loading: false,
      error: false
    })
  }

  onLoadingError = (err) => {
    this.setState({
      loading: false,
      error: true
    })
  }

  updatePlanet = () => {
    const id = Math.floor(Math.random() * 25) + 2
    this.swapiService
      .getPlanet(id)
      .then(this.onPlanetLoaded)
      .catch(this.onLoadingError)
  }

  render() {
    const {planet, loading, error} = this.state

    const hasData = !(loading || error)
    const spinner = loading ? <Spinner/> : null
    const errorMessage = error ? <ErrorIndicator/> : null
    const content = hasData ? <PlanetView planet={planet}/> : null

    return (
      <div className="random-planet jumbotron rounded">
        {spinner}
        {errorMessage}
        {content}
      </div>
    )
  }
}

const PlanetView = ({planet}) => {
  const {id, name, population, rotationPeriod, diameter} = planet
  return (
    <React.Fragment>
      <img
        className="planet-image"
        src={`https://starwars-visualguide.com/assets/img/planets/${id}.jpg`}
        onError={(e) => {
          e.target.src = placeholder
        }}
      />
      <div>
        <h4>{name}</h4>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <span className="term">Population</span>
            <span>{population}</span>
          </li>
          <li className="list-group-item">
            <span className="term">Rotation Period</span>
            <span>{rotationPeriod}</span>
          </li>
          <li className="list-group-item">
            <span className="term">Diameter</span>
            <span>{diameter}</span>
          </li>
        </ul>
      </div>
    </React.Fragment>
  )
}
