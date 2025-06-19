import { Grid } from "@mui/material";
import CardItem from "./CardItem";

export default function CardGrid({ cards }) {
    return (
        <Grid container justifyContent={'center'} spacing={2}>
            {cards.map((card, idx) => (
                <Grid key={idx}>
                    <CardItem card={card} />
                </Grid>
            ))}
        </Grid>
    );
}