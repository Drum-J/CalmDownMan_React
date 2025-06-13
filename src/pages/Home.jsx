import React, {useEffect, useState} from 'react';
import {Box, Grid, Typography} from "@mui/material";
import api from "../api/axios.jsx";
import CardPack from "../components/CardPack.jsx";

export default function Home() {
    const [cardPacks, setCardPacks] = useState([]);

    const fetchData = async () => {
        try {
            const response = await api.get('/card/seasons');
            setCardPacks(response.data.data);
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 403) {
                console.log(error.response.status);
                alert(error.response.data.data);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <Box textAlign="center" mt={5}>
            <Grid container justifyContent="center">
                {cardPacks.map((pack,index) => (
                    <CardPack key={index} id={pack.id} title={pack.title} imageUrl={pack.imageUrl} />
                ))}
            </Grid>
        </Box>
    )
}