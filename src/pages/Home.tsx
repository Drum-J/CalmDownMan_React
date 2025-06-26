import {JSX, useEffect, useState } from 'react';
import { Box, Grid } from "@mui/material";
import api from "../common/axios";
import CardPack from "../components/CardPack";
import { ApiResponse } from "../common/ApiResponse";

interface CardPack {
    id: number;
    title: string;
    imageUrl: string;
}

export default function Home(): JSX.Element {
    const [cardPacks, setCardPacks] = useState<CardPack[]>([]);

    const fetchData = async () => {
        const response = await api.get<ApiResponse<CardPack[]>>('/card/seasons');
        setCardPacks(response.data.data);
    };

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <Box textAlign="center" mt={5}>
            <Grid container justifyContent="center">
                {cardPacks.map((pack: CardPack, index: number) => (
                    <CardPack
                        key={index}
                        id={pack.id}
                        title={pack.title}
                        imageUrl={pack.imageUrl}
                    />
                ))}
            </Grid>
        </Box>
    )
}