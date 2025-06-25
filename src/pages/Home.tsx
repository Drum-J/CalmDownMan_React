import {JSX, useEffect, useState } from 'react';
import { Box, Grid } from "@mui/material";
import api from "../common/axios";
import CardPack from "../components/CardPack";
import {ApiError, ApiResponse} from "../common/ApiResponse.ts";

interface CardPack {
    id: number;
    title: string;
    imageUrl: string;
}

export default function Home(): JSX.Element {
    const [cardPacks, setCardPacks] = useState<CardPack[]>([]);

    const fetchData = async () => {
        try {
            const response = await api.get<ApiResponse<CardPack[]>>('/card/seasons');
            setCardPacks(response.data.data);
        } catch (error) {
            const err = error as ApiError;
            if (err.response?.status === 401 || err.response?.status === 403) {
                console.log(err.response.status);
                alert(err.response.data.data);
            }
        }
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