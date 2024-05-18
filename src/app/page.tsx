"use client"
import {useUser} from "@/app/hooks";

export default function Home() {
  const {user} = useUser()
  return (
      <main>Домашняя страница {user?.email}</main>
  );
}