import "./Card.scss";
const Card: React.FC = () => {
    return (
        <div className="card">
            <div>
                <img src="./rating.png" alt="" />
            </div>
            <div className="name">
                <span>Name</span><><img src="./tick.png" alt="" /></>
            </div>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita optio maiores eum dolorem fugiat deserunt perspiciatis incidunt placeat minima porro! Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>

        </div>
    )
}
export default Card;