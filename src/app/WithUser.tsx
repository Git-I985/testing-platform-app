"use client";
import { fetcher } from "@/app/fetcher";
import { Prisma, User } from "@prisma/client";
import { createContext, ReactNode, useContext } from "react";
import useSWR from "swr";

const UserContext = createContext<
  | (Prisma.UserGetPayload<{
      include: { role: true; organisation: true };
    }> & { isAdmin: boolean; isManager: boolean })
  | null
>(null);

export function WithUser({
  initialData,
  children,
}: {
  children: ReactNode;
  initialData: User;
}) {
  const { data } = useSWR("/api/user", fetcher, {
    fallbackData: initialData,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
  });
  return (
    <UserContext.Provider
      value={{
        ...data,
        isAdmin: data.role?.name === Role.ADMIN,
        isManager: data.role?.name === Role.MANAGER,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return { user: useContext(UserContext) };
}

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  USER = "USER",
}

export function getUserRoleName(role: Role) {
  return {
    ADMIN: "Администратор",
    MANAGER: "Менеджер",
    USER: "Пользователь",
  }[role];
}