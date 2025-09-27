import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import {
  createSupportTicket as createSupportTicketApi,
  createTicket as createTicketApi,
  getAllTickets,
  getTicketById,
  ClientTicket,
} from "@/api/client/clientTicketApi";

const TICKET_QUERY_KEYS = {
  all: ["client", "tickets"] as const,
  lists: () => [...TICKET_QUERY_KEYS.all, "list"] as const,
  list: (filters?: string) => [...TICKET_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...TICKET_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string | number) => [...TICKET_QUERY_KEYS.details(), id] as const,
};

export const useGetClientTickets = (params?: { pageNumber?: number; pageSize?: number }) => {
  const { toast } = useToast();
  return useQuery<ClientTicket[]>({
    queryKey: TICKET_QUERY_KEYS.list(JSON.stringify(params)),
    queryFn: async () => {
      try {
        return await getAllTickets(params);
      } catch (error: any) {
        toast({ title: "خطأ", description: error?.message || "فشل في تحميل التذاكر", variant: "destructive" });
        throw error;
      }
    },
    staleTime: 60 * 1000,
  });
};

export const useGetClientTicketById = (id: string | number, enabled: boolean = true) => {
  const { toast } = useToast();
  return useQuery<ClientTicket>({
    queryKey: TICKET_QUERY_KEYS.detail(id),
    queryFn: async () => {
      try {
        return await getTicketById(id);
      } catch (error: any) {
        toast({ title: "خطأ", description: error?.message || "فشل في تحميل التذكرة", variant: "destructive" });
        throw error;
      }
    },
    enabled: enabled && !!id,
    staleTime: 60 * 1000,
  });
};

export const useCreateSupportTicket = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupportTicketApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.all });
      toast({ title: "تم الإنشاء", description: "تم إنشاء تذكرة دعم بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ", description: error?.message || "فشل إنشاء تذكرة الدعم", variant: "destructive" });
    },
  });
};

export const useCreateTicket = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTicketApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKET_QUERY_KEYS.all });
      toast({ title: "تم الإنشاء", description: "تم إنشاء التذكرة بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ", description: error?.message || "فشل إنشاء التذكرة", variant: "destructive" });
    },
  });
};