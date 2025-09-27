import axiosInstance from "@/utils/axiosInstance";

// Generic API envelope
interface ApiEnvelope<T> {
  isSuccess?: boolean;
  customMessage?: string;
  message?: string;
  data?: T;
}

// API item shapes (flexible)
export interface TicketApiItem {
  id?: string | number;
  ticketId?: string | number;
  subject?: string;
  description?: string;
  priority?: string; // low | medium | high
  status?: string; // open | closed | pending | etc.
  createdAt?: string;
  updatedAt?: string;
  // new fields from actual response
  date?: string;
  reportedBy?: string;
  vendorName?: string;
  vendorLogo?: string;
  vendorId?: string | null;
  userName?: string;
  phone?: string;
  email?: string | null;
  userId?: string;
  categorystatus?: string;
  from?: string;
  to?: string;
  title?: string;
  isSystem?: boolean;
  attachement?: string;
  [key: string]: any;
}

// Normalized UI type
export interface ClientTicket {
  id: string;
  subject: string;
  description?: string;
  priority?: "low" | "medium" | "high" | string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  // expose extra fields if needed
  date?: string;
  reportedBy?: string;
  vendorName?: string;
  vendorLogo?: string;
  vendorId?: string | null;
  userName?: string;
  phone?: string;
  email?: string | null;
  userId?: string;
  categorystatus?: string;
  from?: string;
  to?: string;
  title?: string;
  isSystem?: boolean;
  attachement?: string;
}

const unwrap = <T,>(resp: any): T => {
  const env: ApiEnvelope<T> = resp;
  if (typeof env === "object" && env && ("isSuccess" in env || "data" in env)) {
    if (env.isSuccess === false) {
      const msg = env.customMessage || env.message || "Request failed";
      throw new Error(msg);
    }
    return (env.data as T) ?? (resp as T);
  }
  return resp as T;
};

const normalizeTicket = (item: TicketApiItem): ClientTicket => {
  return {
    id: String(item.id ?? item.ticketId ?? ""),
    subject: item.title || item.subject || "",
    description: item.description,
    priority: (item.priority as any) || "medium",
    status: item.status,
    createdAt: item.date || item.createdAt,
    updatedAt: item.updatedAt,
    // pass through new fields
    date: item.date,
    reportedBy: item.reportedBy,
    vendorName: item.vendorName,
    vendorLogo: item.vendorLogo,
    vendorId: item.vendorId,
    userName: item.userName,
    phone: item.phone,
    email: item.email,
    userId: item.userId,
    categorystatus: item.categorystatus,
    from: item.from,
    to: item.to,
    title: item.title,
    isSystem: item.isSystem,
    attachement: item.attachement,
  };
};

// POST /Client/Ticket/CreateSupportTicket
export const createSupportTicket = async (payload: {
  subject: string;
  description: string;
  priority?: "low" | "medium" | "high";
}) => {
  try {
    const { data } = await axiosInstance.post("/Client/Ticket/CreateSupportTicket", payload);
    const item = unwrap<TicketApiItem>(data);
    return normalizeTicket(item);
  } catch (error: any) {
    const msg = error?.response?.data?.customMessage || error?.message || "Failed to create support ticket";
    throw new Error(msg);
  }
};

// POST /Client/Ticket/CreateTicket
export const createTicket = async (payload: {
  subject: string;
  description: string;
  priority?: "low" | "medium" | "high";
}) => {
  try {
    const { data } = await axiosInstance.post("/Client/Ticket/CreateTicket", payload);
    const item = unwrap<TicketApiItem>(data);
    return normalizeTicket(item);
  } catch (error: any) {
    const msg = error?.response?.data?.customMessage || error?.message || "Failed to create ticket";
    throw new Error(msg);
  }
};

// GET /Client/Ticket/GetAllTickets
export const getAllTickets = async (params?: { pageNumber?: number; pageSize?: number }): Promise<ClientTicket[]> => {
  try {
    const { data } = await axiosInstance.get("/Client/Ticket/GetAllTickets", { params });
    const payload = unwrap<any>(data);
    let arr: TicketApiItem[] = [];
    if (Array.isArray(payload)) {
      arr = payload;
    } else if (Array.isArray(payload?.items)) {
      arr = payload.items;
    } else if (Array.isArray(payload?.data?.items)) {
      arr = payload.data.items;
    } else if (Array.isArray(payload?.data)) {
      arr = payload.data;
    } else if (Array.isArray(data)) {
      arr = data as TicketApiItem[];
    }
    return (arr || []).map(normalizeTicket);
  } catch (error: any) {
    const msg = error?.response?.data?.customMessage || error?.message || "Failed to fetch tickets";
    throw new Error(msg);
  }
};

// GET /Client/Ticket/GetTicketById/:ticketId
export const getTicketById = async (ticketId: string | number): Promise<ClientTicket> => {
  try {
    const { data } = await axiosInstance.get(`/Client/Ticket/GetTicketById/${ticketId}`);
    const item = unwrap<TicketApiItem>(data);
    return normalizeTicket(item);
  } catch (error: any) {
    const msg = error?.response?.data?.customMessage || error?.message || "Failed to fetch ticket";
    throw new Error(msg);
  }
};