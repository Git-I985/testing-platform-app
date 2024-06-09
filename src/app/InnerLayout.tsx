"use client";

import { getUserRoleName, Role, useUser } from "@/app/WithUser";
import {
  Add,
  Home,
  Logout,
  PeopleAlt,
  Person,
  Quiz,
} from "@mui/icons-material";
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
import ListItem from "@mui/material/ListItem";
import Chip from "@mui/material/Chip";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  // @ts-ignore
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    maxWidth: open ? `calc(100% - ${drawerWidth}px)` : "100%",
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
  // @ts-ignore
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

  const { user } = useUser();

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
          <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
            <Typography variant="h6" noWrap fontWeight={600}>
              АСТ
            </Typography>
            {user?.organisation ? (
              <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                {user.organisation.name}{" "}
                {user?.role ? (
                  <Chip
                    variant={"filled"}
                    color={"info"}
                    size={"small"}
                    label={getUserRoleName(user?.role?.name as Role)}
                  />
                ) : null}
              </Typography>
            ) : null}
          </Box>
          {user?.name ? (
            <Typography variant="body1" noWrap>
              {user.name}
            </Typography>
          ) : null}
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
        <Divider />
        <List sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <ListItem disablePadding>
            <ListItemButton component={Link} href={"/"}>
              <ListItemIcon sx={{ color: "white" }}>
                <Home />
              </ListItemIcon>

              <ListItemText primary={"Главная"} />
            </ListItemButton>
          </ListItem>
          {user?.organisationId ? (
            <>
              <ListItem disablePadding>
                <ListItemButton component={Link} href={"/tests"}>
                  <ListItemIcon sx={{ color: "white" }}>
                    <Quiz />
                  </ListItemIcon>
                  <ListItemText primary={"Тесты"} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} href={"/organisation"}>
                  <ListItemIcon sx={{ color: "white" }}>
                    <PeopleAlt />
                  </ListItemIcon>
                  <ListItemText primary={"Организация"} />
                </ListItemButton>
              </ListItem>
            </>
          ) : null}
          <ListItem disablePadding>
            <ListItemButton component={Link} href={"/profile"}>
              <ListItemIcon sx={{ color: "white" }}>
                <Person />
              </ListItemIcon>
              <ListItemText primary={"Профиль"} />
            </ListItemButton>
          </ListItem>
          {!user?.organisationId ? (
            <ListItem disablePadding>
              <ListItemButton component={Link} href={"/organisation/create"}>
                <ListItemIcon sx={{ color: "white" }}>
                  <Add />
                </ListItemIcon>
                <ListItemText primary={"Создать организацию"} />
              </ListItemButton>
            </ListItem>
          ) : null}
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