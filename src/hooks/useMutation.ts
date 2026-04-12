import { remove, edit, patch, post } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCustomPost = (endpoint: string, queryKey?: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => post(endpoint, body),
    onSuccess: () => {
      queryKey?.forEach((key) => {
        queryClient.resetQueries({ queryKey: [key] });
      });
    },
  });
};

type UpdateEndpoint = string | (() => string);

export const useCustomUpdate = (
  endpoint: UpdateEndpoint,
  queryKey?: string[],
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => {
      const url = typeof endpoint === "function" ? endpoint() : endpoint;
      return edit(url, body);
    },
    onSuccess: () => {
      queryKey?.forEach((key) => {
        queryClient.resetQueries({ queryKey: [key] });
      });
    },
  });
};

export const useCustomPatch = (endpoint: string, queryKey: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: any) => patch(endpoint, body),
    onSuccess: () => {
      queryKey?.forEach((key) => {
        queryClient.resetQueries({ queryKey: [key] });
      });
    },
  });
};

export const useCustomRemove = (endpoint: string, queryKey: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => remove(endpoint),
    onSuccess: () => {
      queryKey?.forEach((key) => {
        queryClient.resetQueries({ queryKey: [key] });
      });
    },
  });
};
