"use client";
import { Role, useUser } from "@/app/WithUser";
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
        {user.isAdmin ? (
          <Grid item xs={3}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography mb={3} variant={"h5"}>
                  Управление пользователями
                </Typography>
                <Typography variant="body1">
                  Изменяйте список пользователей, их данные, приглашайте новых
                  пользователей
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  color={"primary"}
                  variant={"contained"}
                  href={"/organisation"}
                >
                  Управление организацией
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ) : null}
        {user?.role?.name === Role.MANAGER ? (
          <Grid item xs={4}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography mb={3} variant={"h5"}>
                  Создание тестов
                </Typography>
                <Typography variant="body1">
                  Создавайте и редактируйте тесты для пользователей в разделе
                  управления тестами
                </Typography>
              </CardContent>
              <CardActions>
                <Button color={"primary"} variant={"contained"} href={"/tests"}>
                  Тесты
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ) : null}
      </Grid>
    </main>
  );
}