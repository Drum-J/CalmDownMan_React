import {MenuItem, Select, InputLabel, FormControl} from "@mui/material";

export default function SeasonSelect({seasons, selectedSeasonId, onChange}) {
    return (
        <FormControl fullWidth sx={{mb: 2}}>
            <InputLabel>시즌 선택</InputLabel>
            <Select
                variant={'standard'}
                label="시즌 선택"
                value={selectedSeasonId}
                onChange={(e) => onChange(e.target.value)}
                MenuProps={{ disableScrollLock: true}}
            >
                <MenuItem value="">전체</MenuItem>
                {seasons.map((season) => (
                    <MenuItem key={season.id} value={season.id}>
                        {season.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}