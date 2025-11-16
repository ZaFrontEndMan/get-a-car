import React, { useMemo, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Plus,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Paperclip,
} from "lucide-react";
import { useGetClientFaqs } from "@/hooks/client/useClientFaqs";
import {
  useGetClientTickets,
  useCreateTicket,
} from "@/hooks/client/useClientTickets";
import { useToast } from "@/components/ui/use-toast";
import LazyImage from "../ui/LazyImage";

// Small helper components to keep UI stable and code modular
const StatusIcon: React.FC<{ status?: string }> = ({ status }) => {
  switch (status) {
    case "open":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "in-progress":
    case "in_progress":
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "resolved":
    case "closed":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50";
    case "medium":
      return "text-yellow-600 bg-yellow-50";
    case "low":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

// Normalized ticket shape used by this component UI
type UITicket = {
  id: string;
  subject: string;
  status?: string;
  priority?: "low" | "medium" | "high" | string;
  createdAt?: string;
  updatedAt?: string;
  attachment?: string;
};

// Utility: normalize various API shapes into UITicket
const normalizeTicketItem = (item: any): UITicket => {
  const rawStatus: string | undefined = item?.status ?? item?.ticketStatus;
  // Map possible status values to UI statuses (English + Arabic)
  const statusMapEn: Record<string, string> = {
    open: "open",
    pending: "in-progress",
    in_progress: "in-progress",
    "in-progress": "in-progress",
    resolved: "resolved",
    closed: "resolved",
  };
  const statusMapAr: Record<string, string> = {
    مفتوح: "open",
    مغلق: "resolved",
    مسودة: "in-progress",
  };
  const statusKey = String(rawStatus ?? "").trim();
  const uiStatus =
    statusMapEn[statusKey.toLowerCase()] || statusMapAr[statusKey] || "open";

  // Priority fallback (response does not include priority)
  const uiPriority: UITicket["priority"] = "medium";

  return {
    id: String(item?.id ?? item?.ticketId ?? item?.TicketId ?? ""),
    subject: item?.title ?? item?.issueTitle ?? item?.subject ?? "",
    status: uiStatus,
    priority: uiPriority,
    createdAt: item?.date ?? item?.createdAt ?? "",
    updatedAt: item?.date ?? item?.updatedAt ?? "",
    attachment: item?.attachement ?? item?.attachment ?? "",
  };
};

const SupportSection: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // Form state (extended to support attachment and optional info)
  const [newTicketForm, setNewTicketForm] = useState({
    subject: "",
    priority: "1",
    description: "",
    attachment: null as File | null,
    additionalInfo: "",
    categoryStatus: "",
    ticketStatus: "",
    vendorId: "",
    customerId: "",
  });

  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Load FAQs from Client API
  const { data: clientFaqs, isLoading: faqsLoading } = useGetClientFaqs();

  // Client tickets via hook (primary source)
  const {
    data: hookTickets,
    isLoading: ticketsLoading,
    error: ticketsError,
  } = useGetClientTickets({ pageNumber, pageSize });

  const normalizedHookTickets: UITicket[] = useMemo(() => {
    if (!hookTickets) return [];
    const source = Array.isArray(hookTickets)
      ? hookTickets
      : hookTickets?.items ||
        hookTickets?.data?.items ||
        hookTickets?.data ||
        [];
    return Array.isArray(source) ? source.map(normalizeTicketItem) : [];
  }, [hookTickets]);

  // Create ticket hook (primary submit)
  const { mutateAsync: createTicketAsync, isPending: creatingTicket } =
    useCreateTicket();

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Submit using FormData with required fields (including attachment)
      const fd = new FormData();
      if (newTicketForm.attachment)
        fd.append("attachement", newTicketForm.attachment);
      fd.append("issueTitle", newTicketForm.subject);
      if (newTicketForm.categoryStatus)
        fd.append("customerCategoryStatus", newTicketForm.categoryStatus);

      fd.append("ticketStatus", 1);
      if (newTicketForm.vendorId) fd.append("vendorId", newTicketForm.vendorId);
      if (newTicketForm.customerId)
        fd.append("customerId", newTicketForm.customerId);
      fd.append("additionalInfo", newTicketForm.additionalInfo);

      const categoryValue =
        newTicketForm.categoryStatus?.toString().trim() ||
        (newTicketForm.priority === "high" ? "2" : "1");
      fd.append("CategoryStatus", categoryValue);

      await createTicketAsync(fd);

      setNewTicketForm({
        subject: "",
        priority: "medium",
        description: "",
        attachment: null,
        additionalInfo: "",
        categoryStatus: "",
        ticketStatus: "",
        vendorId: "",
        customerId: "",
      });
    } catch (error: any) {
      toast({
        title: t("error") ?? "Error",
        description: error?.message || "Failed to create ticket",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="px-2 md:px-0">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
        {t("support")}
      </h1>

      <Tabs defaultValue="faqs" className="w-full">
        <TabsList className="grid w-full grid-cols-3 text-xs md:text-sm">
          <TabsTrigger value="faqs" className="px-2 py-2">
            {t("faqs")}
          </TabsTrigger>
          <TabsTrigger value="tickets" className="px-2 py-2">
            {t("supportTickets")}
          </TabsTrigger>
          <TabsTrigger value="contact" className="px-2 py-2">
            {t("contact")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="mt-4 md:mt-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              {t("frequentlyAskedQuestions")}
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqsLoading ? (
                <div className="text-sm text-gray-500">{t("loading")}...</div>
              ) : clientFaqs && clientFaqs.length > 0 ? (
                clientFaqs.map((faq, index) => (
                  <AccordionItem key={faq.id ?? index} value={`item-${index}`}>
                    <AccordionTrigger className="text-start text-sm md:text-base">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm md:text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  {t("noFaqs") ?? "No FAQs available"}
                </div>
              )}
            </Accordion>
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="mt-4 md:mt-6 ">
          <div>
            {/* New Ticket Form */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <Plus className="h-5 w-5 text-primary" />
                <h2 className="text-lg md:text-xl font-semibold">
                  {t("createNewTicket")}
                </h2>
              </div>

              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("subject")}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTicketForm.subject}
                    onChange={(e) =>
                      setNewTicketForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={t("enterSubject")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("category")}
                  </label>
                  <select
                    value={newTicketForm.priority}
                    onChange={(e) =>
                      setNewTicketForm((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="1">{t("technical")}</option>
                    <option value="2">{t("financial")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("description")}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newTicketForm.additionalInfo}
                    onChange={(e) =>
                      setNewTicketForm((prev) => ({
                        ...prev,
                        additionalInfo: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder={t("describeIssue")}
                  />
                </div>

                {/* Attachment (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Paperclip className="h-4 w-4" />{" "}
                    {t("attachment") ?? "Attachment"}
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setNewTicketForm((prev) => ({
                        ...prev,
                        attachment: e.target.files?.[0] ?? null,
                      }))
                    }
                    className="w-full text-sm md:text-base"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingTicket}
                  className="w-full md:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm md:text-base flex items-center gap-2 disabled:opacity-70"
                >
                  {creatingTicket && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}{" "}
                  {t("submitTicket")}
                </button>
              </form>
            </div>

            {/* Tickets - Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow mt-8">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold">{t("myTickets")}</h2>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600">
                    {t("itemsPerPage")}
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPageNumber(1);
                    }}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 border rounded text-sm"
                      disabled={pageNumber <= 1}
                      onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    >
                      {t("previous")}
                    </button>
                    <span className="text-sm text-gray-600">
                      {t("page")} {pageNumber}
                    </span>
                    <button
                      className="px-2 py-1 border rounded text-sm"
                      disabled={(hookTickets?.length ?? 0) < pageSize}
                      onClick={() => setPageNumber((p) => p + 1)}
                    >
                      {t("next")}
                    </button>
                  </div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="rtl:text-end text-start">{t("subject")}</TableHead>
                    <TableHead className="rtl:text-end text-start">{t("status")}</TableHead>
                    <TableHead className="rtl:text-end text-start">{t("created")}</TableHead>
                    <TableHead className="rtl:text-end text-start">
                      {t("lastUpdate")}
                    </TableHead>
                    <TableHead className="rtl:text-end text-start">
                      {t("attachment")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketsLoading && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />{" "}
                          {t("loading")}...
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {!ticketsLoading &&
                    hookTickets?.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>{ticket.title}</TableCell>
                        <TableCell>
                          <div className="flex items-end gap-2 ">
                            <StatusIcon status={ticket.status} />
                            <span className="capitalize">
                              {t(ticket.status ?? "open")}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>{ticket.createdAt}</TableCell>
                        <TableCell>{ticket.updatedAt}</TableCell>
                        <TableCell>
                          {ticket.attachement ? (
                            <LazyImage
                              src={`${import.meta.env.VITE_UPLOADS_BASE_URL}${
                                ticket.attachement
                              }`}
                              alt="attachment"
                              className="h-10 w-10 object-cover rounded"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* Tickets - Mobile Grid */}
            <div className="md:hidden bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">{t("myTickets")}</h2>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600">
                      {t("itemsPerPage")}
                    </label>
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageNumber(1);
                      }}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 border rounded text-xs"
                      disabled={pageNumber <= 1}
                      onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                    >
                      {t("previous")}
                    </button>
                    <span className="text-xs text-gray-600">
                      {t("page")} {pageNumber}
                    </span>
                    <button
                      className="px-2 py-1 border rounded text-xs"
                      disabled={(normalizedHookTickets?.length ?? 0) < pageSize}
                      onClick={() => setPageNumber((p) => p + 1)}
                    >
                      {t("next")}
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-4 p-4">
                {ticketsLoading ? (
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> {t("loading")}
                    ...
                  </div>
                ) : (
                  normalizedHookTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {ticket.id}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {ticket.subject}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            ticket.priority || "medium"
                          )}`}
                        >
                          {t(ticket.priority || "medium")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusIcon status={ticket.status} />
                          <span className="text-sm capitalize">
                            {t(ticket.status ?? "open")}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 space-y-1">
                        <div>
                          {t("created")}: {ticket.createdAt}
                        </div>
                        <div>
                          {t("lastUpdate")}: {ticket.updatedAt}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-4 md:mt-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">
              {t("support")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="text-center p-4 md:p-6 border rounded-lg">
                <Phone className="h-6 w-6 md:h-8 md:w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-sm md:text-base">
                  {t("phone")}
                </h3>
                <p className="text-gray-600 text-sm md:text-base">
                  +966 11 123 4567
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {t("available24_7")}
                </p>
              </div>

              <div className="text-center p-4 md:p-6 border rounded-lg">
                <Mail className="h-6 w-6 md:h-8 md:w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2 text-sm md:text-base">
                  {t("email")}
                </h3>
                <p className="text-gray-600 text-sm md:text-base break-all">
                  support@getcar.com
                </p>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  {t("responseIn24h")}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportSection;
