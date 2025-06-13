import {Card, CardContent, CardMedia, Typography} from "@mui/material";

export default function CardPack({id, title, imageUrl}) {
    const handleClick = () => {
        confirm(`${title}(을)를 오픈할까요?`);
    }

    return (
        <Card sx={{ maxWidth: 300, m: 2 }} onClick={() => handleClick()}>
            <CardMedia
                component="img"
                height="400"
                image={imageUrl}
                alt={title}
            />
            <CardContent>
                <Typography variant="h6">{title}</Typography>
            </CardContent>
        </Card>
    )
}