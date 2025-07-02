import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { JSX } from "react";

// 공용으로 사용할 옵션의 형태 정의
interface Option {
    value: string;
    label: string;
}

interface FilterSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    minWidth?: number;
}

export default function FilterSelect({ label, value, onChange, options, minWidth }: FilterSelectProps): JSX.Element {
    // MUI의 Select 컴포넌트의 onChange 타입에 맞춘 핸들러
    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    // label을 기반으로 고유한 ID 생성
    const labelId = `${label.toLowerCase().replace(/ /g, '-')}-select-label`;

    return (
        <FormControl sx={{ minWidth: minWidth ? minWidth : 300 }}>
            <InputLabel id={labelId}>{label}</InputLabel>
            <Select
                labelId={labelId}
                value={value}
                label={label}
                onChange={handleChange}
                MenuProps={{ disableScrollLock: true }}
            >
                {options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}