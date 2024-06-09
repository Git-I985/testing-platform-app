"use client";
import { fetcher } from "@/app/fetcher";
import { Prisma } from "@prisma/client";
import { createContext, ReactNode, useContext } from "react";
import useSWR from "swr";

const OrganisationContext = createContext<Prisma.OrganisationGetPayload<{
  include: { users: true };
}> | null>(null);

export function useOrganisation() {
  return { organisation: useContext(OrganisationContext) };
}

export function WithOrganisation({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useSWR("/api/organisation", fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
  });
  return (
    <OrganisationContext.Provider value={data}>
      {children}
    </OrganisationContext.Provider>
  );
}