import {MenuItem, Select, InputLabel, FormControl, SelectChangeEvent} from "@mui/material";
import {Season} from "./dto";
import {JSX} from "react";

type SeasonSelectProps = {
    seasons: Season[];
    selectedSeasonId: string;
    onChange: (seasonId: string) => void;
}

export default function SeasonSelect({seasons, selectedSeasonId, onChange}: SeasonSelectProps): JSX.Element {
    const handleChange = (e: SelectChangeEvent) => {
        onChange(e.target.value);
    };

    return (
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>시즌 선택</InputLabel>
            <Select
                variant="standard"
                label="시즌 선택"
                value={selectedSeasonId}
                onChange={handleChange}
                MenuProps={{ disableScrollLock: true }}
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
};