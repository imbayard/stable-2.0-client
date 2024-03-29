import { FaCheckCircle, FaTimesCircle, FaTrophy, FaRobot } from "react-icons/fa";
import { IconContext } from "react-icons/lib";

export function CheckMark(){
    return(
        <IconContext.Provider
            value={{ color: 'green' }}
        >
            <div>
                <FaCheckCircle/>
            </div>
        </IconContext.Provider>
    );
}

export function XMark(){
    return(
        <IconContext.Provider
            value={{ color: 'red' }}
        >
            <div>
                <FaTimesCircle/>
            </div>
        </IconContext.Provider>
    );
}

export function TrophySymbol(){
    return(
        <IconContext.Provider
            value={{ color: 'orange' }}
        >
            <div>
                <FaTrophy/>
            </div>
        </IconContext.Provider>
    );
}

export function CoachSymbol(){
    return(
        <IconContext.Provider
            value={{ color: 'blue', size: '50px'}}
        >
            <>
                <FaRobot />
            </>
        </IconContext.Provider>
    )
}