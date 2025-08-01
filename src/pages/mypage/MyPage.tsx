import { Box, List, ListItem, ListItemButton, ListItemText, Paper } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import './MyPage.css';

const menuItems = [
    { text: '내 정보', path: '/mypage' },
    { text: '내가 가진 카드', path: '/mypage/cards' },
    { text: '내가 쓴 글', path: '/mypage/posts' },
    { text: '내가 신청한 글', path: '/mypage/requests' },
    { text: '게임 전적', path: '/mypage/gameRecords'}
];

export default function MyPage() {
    const location = useLocation();

    // 현재 경로가 '/mypage' 또는 '/mypage/'일 때 '내 정보'를 선택된 상태로 표시하기 위한 조건
    const isMyInfoSelected = (itemPath: string) => {
        if (itemPath === '/mypage') {
            return location.pathname === '/mypage' || location.pathname === '/mypage/';
        }
        return location.pathname.startsWith(itemPath);
    };

    return (
        <Box className="mypage-container" sx={{ flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Paper elevation={1}>
                    <List sx={{ display: 'flex', p: 0 , width: 700 }}>
                        {menuItems.map((item) => (
                            <ListItem
                                key={item.text}
                                disablePadding
                                sx={{
                                    flex: 1,
                                    '&:not(:last-of-type)': {
                                        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
                                    },
                                }}
                            >
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
                                    selected={isMyInfoSelected(item.path)}
                                >
                                    <ListItemText primary={item.text} sx={{ textAlign: 'center' }} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>
            <Box className="mypage-content">
                <Outlet />
            </Box>
        </Box>
    );
}