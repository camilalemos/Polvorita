import React,{useState,useEffect} from 'react';

export default function PlayerList({ gameInfo }) {

    const [playersInfo, setPlayersInfo] = useState([]);
    const [minister, setMinister] = useState('');
    const [director, setDirector] = useState('');
    
    useEffect(() => {
        if(gameInfo.players)
            setPlayersInfo(Object.values(gameInfo.players));   
        if(gameInfo.length !== 0 ){
            setDirector(gameInfo.elections.headmaster);
            setMinister(gameInfo.elections.minister);
        }
    },[gameInfo])
    
    return (
        <div style={{display:'flex' , flexDirection:'column' }}>
			{playersInfo.map((values) => {
                let textcolorlist
                if (values.is_alive === true)
                textcolorlist = <a style={{ fontSize:26 }}> {values.name} {values.user_name === minister ? "M" : ""} {values.user_name === director ? "D": ""} </a>
                else textcolorlist = <a style={{color: "grey", textDecoration: 'line-through', fontSize:26 }}> {values.name} </a>
                return textcolorlist
            })}
		</div>
    )
}

//