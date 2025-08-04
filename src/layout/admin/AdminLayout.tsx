import { Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import {Dashboard, Home, People, Style} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
    { text: '대시보드', path: '/admin/dashboard', icon: <Dashboard /> },
    { text: '사용자 관리', path: '/admin/users', icon: <People /> },
    { text: '카드 관리', path: '/admin/cards', icon: <Style /> },
    { text: '메인 페이지로', path: '/', icon: <Home />}
];

export default function AdminLayout() {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: 80,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        관리자 페이지
                    </Typography>
                </Toolbar>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton onClick={() => navigate(item.path)}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
