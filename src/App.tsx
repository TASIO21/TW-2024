import { Component } from "react";
import { Navbar, Nav, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootswatch/dist/morph/bootstrap.min.css";
import './App.css';

const PLACES = [
        { name: "Молдова", zip: "MD" },
        { name: "Румыния", zip: "RO" },
        { name: "Украина", zip: "UA" },
        { name: "Беларусь", zip: "BY" },
        { name: "Польша", zip: "PL" },
        { name: "Австрия", zip: "AT" },
        { name: "Италия", zip: "IT" },
        { name: "Франция", zip: "FR" },
        { name: "Германия", zip: "DE" },
        { name: "Греция", zip: "GR" }
    ];
interface WeatherDescription {
    [key: string]: string;
}

const weatherDescriptions: WeatherDescription = {
};

interface WeatherDisplayProps {
    zip: string;
    cityName: string;
}

interface WeatherDisplayState {
    weatherData: {
        weather: {
            description: string;
            icon: string;
        }[];
        main: {
            temp: number;
            temp_max: number;
            temp_min: number;
        };
        wind: {
            speed: number;
        };
    } | null;
}

class WeatherDisplay extends Component<WeatherDisplayProps, WeatherDisplayState> {
    constructor(props: WeatherDisplayProps) {
        super(props);
        this.state = {
            weatherData: null
        };
    }

    componentDidMount() {
        this.fetchWeatherData();
    }

    componentDidUpdate(prevProps: WeatherDisplayProps) {
        if (prevProps.cityName !== this.props.cityName || prevProps.zip !== this.props.zip) {
            this.fetchWeatherData();
        }
    }

    fetchWeatherData() {
        const { zip, cityName } = this.props;
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&zip=${zip}&appid=e9d33feacac3341f2de45ad2892e89a3&units=metric`;
        fetch(URL)
            .then(res => res.json())
            .then(json => {
                this.setState({ weatherData: json });
            })
            .catch(error => {
                console.error("Ошибка получения данных о погоде:", error);
            });
    }

    render() {
        const weatherData = this.state.weatherData;
        if (!weatherData) return <div>Загрузка...</div>;
        const weather = weatherData.weather[0];
        const iconUrl = `https://openweathermap.org/img/w/${weather.icon}.png`;
        const russianDescription = weatherDescriptions[weather.description];
        return (
            <div>
                <h1>
                    Погода в {this.props.cityName}
                    <img src={iconUrl} alt={weather.description} />
                </h1>
                <p>Описание: {russianDescription}</p>
                <p>Текущая: {weatherData.main.temp}°</p>
                <p>Максимальная: {weatherData.main.temp_max}°</p>
                <p>Минимальная: {weatherData.main.temp_min}°</p>
                <p>Скорость ветра: {weatherData.wind.speed} миль/ч</p>
            </div>
        );
    }
}

interface AppState {
    activePlace: number[];
}

class App extends Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            activePlace: [0, 0]
        };
    }

    render() {
        const [, cityIndex] = this.state.activePlace; // Используем деструктуризацию и пропускаем districtIndex
        const selectedCity = PLACES[cityIndex];
        return (
            <div className="App">
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand>Метео-Гайд</Navbar.Brand>
                </Navbar>
                <Container>
                    <Row>
                        <Col md={4}>
                            <h3>Выберите страну</h3>
                            <Nav className="flex-column">
                                {PLACES.map((city, index) => (
                                    <Nav.Item key={index}>
                                        <Nav.Link
                                            onClick={() => this.setState({ activePlace: [0, index] })}
                                        >
                                            {city.name}
                                        </Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>
                        </Col>
                        <Col md={8}>
                            <WeatherDisplay
                                zip={selectedCity.zip}
                                cityName={selectedCity.name}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}



export default App;
