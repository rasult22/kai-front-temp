import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "./auth";
import { PROTOTYPE_MODE } from "@/prototype";
import * as MockQueries from "@/prototype/mock-queries";

export type Client = {
  id: number;
  user_id: number;
  telegram_id: number;
  email: string;
  fullname: string;
  table: string;
  is_active: boolean;
};

const _useClientDetailReal = (unique_url_id: string) =>
  useQuery<Client>({
    queryKey: ["client_detail", unique_url_id],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}api/clients/${unique_url_id}/`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Не удалось загрузить данные клиента");
      }
      return await response.json();
    },
    enabled: !!unique_url_id,
  });

export const useClientDetail = PROTOTYPE_MODE ? MockQueries.useClientDetail : _useClientDetailReal;
