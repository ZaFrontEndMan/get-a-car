import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSupportTicket,
  createTicket,
  getAllTickets,
  getTicketById,
} from "../../api/vendor/vendorTicketApi";

// Query keys
const VENDOR_TICKET_QUERY_KEYS = {
  all: ["vendor", "tickets"] as const,
  lists: () => [...VENDOR_TICKET_QUERY_KEYS.all, "list"] as const,
  list: (filters: string) => [...VENDOR_TICKET_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...VENDOR_TICKET_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...VENDOR_TICKET_QUERY_KEYS.details(), id] as const,
};

// Get all tickets
export const useGetAllTickets = () => {
  return useQuery({
    queryKey: VENDOR_TICKET_QUERY_KEYS.lists(),
    queryFn: getAllTickets,
  });
};

// Get ticket by ID
export const useGetTicketById = (ticketId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: VENDOR_TICKET_QUERY_KEYS.detail(ticketId),
    queryFn: () => getTicketById(ticketId),
    enabled: enabled && !!ticketId,
  });
};

// Create support ticket mutation
export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createSupportTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_TICKET_QUERY_KEYS.all });
    },
  });
};

// Create ticket mutation
export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_TICKET_QUERY_KEYS.all });
    },
  });
};