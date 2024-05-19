import { getSessionUser } from "@/app/api/user/getSessionUser";
import { EditProfileForm } from "@/app/profile/EditProfileForm";
import Typography from "@mui/material/Typography";

export default async function ProfilePage() {
  const user = await getSessionUser();

  if (!user) {
    return null;
  }

  return (
    <div>
      <Typography gutterBottom variant={"h4"}>
        Профиль
      </Typography>
      <EditProfileForm user={user} />
    </div>
  );
}