"use client";
import { Organisation, User } from "@prisma/client";
import { createContext, ReactNode, useContext } from "react";
import useSWR from "swr";

const UserContext = createContext<User | null>(null);

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

export function WithUser({
  initialData,
  children,
}: {
  children: ReactNode;
  initialData: User;
}) {
  const { data } = useSWR("/api/user", fetcher, { fallbackData: initialData });
  return (
    <UserContext.Provider
      value={{ ...data, isAdmin: data.role.name === Role.ADMIN }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return { user: useContext(UserContext) };
}

export function useOrganisation(): {
  organisation: Organisation;
  isLoading: boolean;
  error: boolean;
} {
  const { data, isLoading, error } = useSWR("/api/organisation", fetcher);
  return { organisation: data, isLoading, error };
}

export enum Role {
  ADMIN = "ADMIN",
}