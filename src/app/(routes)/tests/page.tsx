"use client";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Stack, Tab } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useState } from "react";

export default function TestsPage() {
  const [selectedTab, setSelectedTab] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography mb={7} mt={5} variant={"h3"} color={"secondary.light"}>
          Тесты
        </Typography>
        <Button href={"/tests/create"} component={Link} variant={"contained"}>
          Создать тест
        </Button>
      </Stack>
      <TabContext value={selectedTab}>
        <Box>
          <TabList
            onChange={handleChange}
            variant={"fullWidth"}
            aria-label="lab API tabs example"
          >
            <Tab
              sx={{
                fontWeight: 600,
              }}
              label="Пройденные"
              value="1"
            />
            <Tab
              sx={{
                fontWeight: 600,
              }}
              label="К прохождению"
              value="2"
            />
            <Tab
              sx={{
                fontWeight: 600,
              }}
              label="Созданные"
              value="3"
            />
          </TabList>
        </Box>
        <TabPanel value="1">Пройденные</TabPanel>
        <TabPanel value="2">К прохождению</TabPanel>
        <TabPanel value="3">Созданные</TabPanel>
      </TabContext>
    </>
  );
}