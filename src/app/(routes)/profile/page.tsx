import { EditProfileForm } from "@/app/(routes)/profile/EditProfileForm";
import Typography from "@mui/material/Typography";

export default async function ProfilePage() {
  return (
    <div>
      <Typography mb={7} mt={5} variant={"h3"} color={"secondary.light"}>
        Профиль
      </Typography>
      <EditProfileForm />
    </div>
  );
}