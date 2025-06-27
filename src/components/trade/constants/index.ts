import { StatusOption, GradeOption } from '../dto';

export const STATUS_OPTIONS: StatusOption[] = [
    { value: 'ALL', label: '전체' },
    { value: 'WAITING', label: '대기' },
    { value: 'COMPLETED', label: '완료' },
    { value: 'REJECTED', label: '거절' },
    { value: 'CANCEL', label: '취소' }
];

export const GRADE_OPTIONS: GradeOption[] = [
    { value: 100, label: '전체' },
    { value: 0, label: 'SSR' },
    { value: 1, label: 'SR' },
    { value: 2, label: 'R' },
    { value: 3, label: 'N' },
    { value: 4, label: 'C' },
    { value: 5, label: 'V' }
];

export const getStatusLabel = (status: string): string => {
    const statusOption = STATUS_OPTIONS.find(option => option.value === status);
    return statusOption ? statusOption.label : status;
};