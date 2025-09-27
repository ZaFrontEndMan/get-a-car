import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { ClientFaq, getAllClientFaqs, getClientFaqById } from "@/api/client/clientFaqApi";

const FAQ_QUERY_KEYS = {
  all: ["client", "faqs"] as const,
  lists: () => [...FAQ_QUERY_KEYS.all, "list"] as const,
  list: (filters?: string) => [...FAQ_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...FAQ_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string | number) => [...FAQ_QUERY_KEYS.details(), id] as const,
};

export const useGetClientFaqs = () => {
  const { toast } = useToast();
  return useQuery<ClientFaq[]>({
    queryKey: FAQ_QUERY_KEYS.lists(),
    queryFn: async () => {
      try {
        return await getAllClientFaqs();
      } catch (error: any) {
        toast({ title: "خطأ", description: error?.message || "فشل في تحميل الأسئلة الشائعة", variant: "destructive" });
        throw error;
      }
    },
    staleTime: 60 * 1000,
  });
};

export const useGetClientFaqById = (id: string | number, enabled: boolean = true) => {
  const { toast } = useToast();
  return useQuery<ClientFaq>({
    queryKey: FAQ_QUERY_KEYS.detail(id),
    queryFn: async () => {
      try {
        return await getClientFaqById(id);
      } catch (error: any) {
        toast({ title: "خطأ", description: error?.message || "فشل في تحميل سؤال شائع", variant: "destructive" });
        throw error;
      }
    },
    enabled: enabled && !!id,
    staleTime: 60 * 1000,
  });
};