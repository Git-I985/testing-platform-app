"use client";
import { Prisma, User } from "@prisma/client";
import { createContext, ReactNode, useContext } from "react";
import useSWR from "swr";

const UserContext = createContext<
  | (Prisma.UserGetPayload<{
      include: { role: true };
    }> & { isAdmin: boolean })
  | null
>(null);

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

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
      value={{ ...data, isAdmin: data.role?.name === Role.ADMIN }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return { user: useContext(UserContext) };
}

export function useOrganisation(): {
  organisation: Prisma.OrganisationGetPayload<{
    include: { users: true };
  }>;
  isLoading: boolean;
  error: boolean;
} {
  const { data, isLoading, error } = useSWR("/api/organisation", fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
  });
  return { organisation: data, isLoading, error };
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