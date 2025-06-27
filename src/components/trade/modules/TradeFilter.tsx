import { FormControl, InputLabel, Select, MenuItem, Box, SelectChangeEvent } from '@mui/material';
import { STATUS_OPTIONS, GRADE_OPTIONS } from '../constants';

interface TradeFilterProps {
    status: string;
    grade: string;
    onStatusChange: (event: SelectChangeEvent) => void;
    onGradeChange: (event: SelectChangeEvent) => void;
}

export default function TradeFilter({ status, grade, onStatusChange, onGradeChange }: TradeFilterProps) {
    return (
        <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>상태</InputLabel>
                <Select
                    value={status}
                    label="상태"
                    onChange={onStatusChange}
                    variant="filled">
                    {STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>등급</InputLabel>
                <Select
                    value={grade}
                    label="등급"
                    onChange={onGradeChange}
                    variant="filled">
                    {GRADE_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}