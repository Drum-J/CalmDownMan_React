import React from "react";
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Grid, IconButton,
    Typography
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export default function CardResultModal({ open, onClose, cards }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth='lg'>
            <DialogTitle sx={{m: 0, p: 2, position: 'relative'}} align={'center'}>
                🎉 카드 오픈 결과!
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 12,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={3} sx={{justifyContent: 'center'}}>
                    {cards.map((card, index) => (
                        <Grid key={index}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="400"
                                    image={card.imageUrl}
                                    alt={card.title}
                                    referrerPolicy="no-referrer"
                                />
                                <CardContent>
                                    <Typography variant="h6">{card.title}</Typography>
                                    <Typography variant="body2">등급: {card.grade}</Typography>
                                    <Typography variant="body2">파워: {card.power}</Typography>
                                    <Typography variant="body2">공격: {card.attackType}</Typography>
                                    <Typography variant="body2" color="text.secondary">시즌: {card.cardSeason}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>

            <DialogActions sx={{marginBottom: 2, justifyContent: 'center'}}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="primary"
                    size="large"
                >확인
                </Button>
            </DialogActions>
        </Dialog>
    );
}
