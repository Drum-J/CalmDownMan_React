import {
    Avatar,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from '@mui/material';
import { OtherPlayerInfo } from '../components/game/dto';
import CloseIcon from '@mui/icons-material/Close';

interface OpponentInfoModalProps {
    open: boolean;
    onClose: () => void;
    opponent: OtherPlayerInfo | null;
}

const OpponentInfoModal = ({ open, onClose, opponent }: OpponentInfoModalProps) => {
    if (!opponent) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                상대 정보
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', p: 2 }}>
                    <Avatar src={opponent.imageUrl} sx={{ width: 150, height: 150, mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        {opponent.nickname}
                    </Typography>
                </Box>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row"><strong>승점</strong></TableCell>
                            <TableCell align="right">{opponent.rankScore}점</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell component="th" scope="row"><strong>전적</strong></TableCell>
                            <TableCell align="right">{opponent.win}승 {opponent.draw}무 {opponent.lose}패</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
};

export default OpponentInfoModal;