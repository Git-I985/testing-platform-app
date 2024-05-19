"use client";
import { Logout } from "@mui/icons-material";
import { useMediaQuery } from "@mui/system";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { PropsWithChildren, useEffect } from "react";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft({ children }: PropsWithChildren) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(matches);
  }, [matches]);

  // @ts-ignore
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap fontWeight={600} sx={{ flexGrow: 1 }}>
            АСТ
          </Typography>
          {matches ? null : (
            <IconButton
              onClick={() => setOpen(!open)}
              sx={{ color: theme.palette.secondary.contrastText }}
              size={"large"}
            >
              <MenuIcon fontSize={"large"} />
            </IconButton>
          )}

          {matches ? (
            <IconButton
              onClick={() => signOut()}
              sx={{ color: theme.palette.secondary.contrastText }}
            >
              <Logout />
            </IconButton>
          ) : null}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: theme.palette.primary.dark,
            color: theme.palette.secondary.contrastText,
          },
        }}
        variant={"persistent"}
        anchor="left"
        open={open}
      >
        <Toolbar />
        {/*<DrawerHeader>*/}
        {/*    /!*<Typography variant={'body1'}>Автоматизированная платформа тестирования</Typography>*!/*/}
        {/*</DrawerHeader>*/}
        <Divider />
        <List sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/*{['Тесты', 'Профиль'].map((text, index) => (*/}
          <ListItem disablePadding>
            <ListItemButton component={Link} href={"/"}>
              <ListItemText primary={"Главная"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href={"/tests"}>
              <ListItemText primary={"Тесты"} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} href={"/profile"}>
              <ListItemText primary={"Профиль"} />
            </ListItemButton>
          </ListItem>
          {matches ? null : (
            <ListItem sx={{ mt: "auto" }}>
              <ListItemButton onClick={() => signOut()}>
                <ListItemIcon
                  sx={{ color: theme.palette.secondary.contrastText }}
                >
                  <Logout />
                </ListItemIcon>
                <ListItemText primary={"Выход"} />
              </ListItemButton>
            </ListItem>
          )}
          {/*))}*/}
        </List>
        {/*<Divider />*/}
        {/*<List>*/}
        {/*  {['All mail', 'Trash', 'Spam'].map((text, index) => (*/}
        {/*    <ListItem key={text} disablePadding>*/}
        {/*      <ListItemButton>*/}
        {/*        <ListItemIcon>*/}
        {/*          {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}*/}
        {/*        </ListItemIcon>*/}
        {/*        <ListItemText primary={text} />*/}
        {/*      </ListItemButton>*/}
        {/*    </ListItem>*/}
        {/*  ))}*/}
        {/*</List>*/}
      </Drawer>
      {/* @ts-ignore */}
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}