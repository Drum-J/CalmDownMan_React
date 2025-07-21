import { Grid } from "@mui/material";
import CardItem from "./CardItem";
import {Card as CardDto} from "./dto";
import {JSX} from "react";

interface CardGridProps {
    cards: CardDto[];
}

export default function CardGrid({ cards }: CardGridProps): JSX.Element {
    return (
        <Grid container justifyContent={'center'} spacing={2}>
            {cards.map((card,index) => (
                <Grid key={index}>
                    <CardItem card={card} />
                </Grid>
            ))}
        </Grid>
    );

}