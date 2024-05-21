"use client";
import { useUser } from "@/app/WithUser";
import { Card, CardActions, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

export default function Home() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <main>
      <Typography mb={7} mt={5} variant={"h3"} color={"secondary.light"}>
        Домашняя
      </Typography>
      <Grid container spacing={2}>
        {!user.organisationId ? (
          <Grid item xs={4}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography mb={3} variant={"h5"}>
                  Первые шаги
                </Typography>
                <Typography variant="body1">
                  Кажется вы не состоите не в одной организации, создайте свою
                  или попросите администраторов вашей организации добавить вас в
                  нее
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  color={"primary"}
                  variant={"contained"}
                  href={"/organisation/create"}
                >
                  Создать организацию
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ) : null}
      </Grid>
    </main>
  );
}