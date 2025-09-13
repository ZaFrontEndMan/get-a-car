import axiosInstance from "../../utils/axiosInstance";

// Create support ticket
export const createSupportTicket = async (ticketData: any) => {
  const { data } = await axiosInstance.post("/api/Vendor/Ticket/CreateSupportTicket", ticketData);
  return data;
};

// Create ticket
export const createTicket = async (ticketData: any) => {
  const { data } = await axiosInstance.post("/api/Vendor/Ticket/CreateTicket", ticketData);
  return data;
};

// Get all tickets
export const getAllTickets = async () => {
  const { data } = await axiosInstance.get("/api/Vendor/Ticket/GetAllTickets");
  return data;
};

// Get ticket by ID
export const getTicketById = async (ticketId: string) => {
  const { data } = await axiosInstance.get(`/api/Vendor/Ticket/GetTicketById/${ticketId}`);
  return data;
};