import axiosInstance from "@/utils/axiosInstance";

// Generic API envelope used by backend
interface ApiEnvelope<T> {
  isSuccess?: boolean;
  customMessage?: string;
  message?: string;
  data?: T;
}

// Raw FAQ shape from API (unknown exact fields, so keep flexible)
export interface FaqApiItem {
  id?: string | number;
  faqId?: string | number;
  Id?: string | number;
  // New API may send 'title'/'description' instead of 'question'/'answer'
  title?: string;
  description?: string;
  question?: string;
  answer?: string;
  question_en?: string;
  question_ar?: string;
  answer_en?: string;
  answer_ar?: string;
  order_index?: number;
  is_active?: boolean;
  [key: string]: any;
}

// Normalized FAQ type for UI consumption
export interface ClientFaq {
  id: string;
  question?: string;
  answer?: string;
  question_en?: string;
  question_ar?: string;
  answer_en?: string;
  answer_ar?: string;
  order_index?: number;
  is_active?: boolean;
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

const normalizeFaq = (item: FaqApiItem): ClientFaq => {
  const id = String(item.id ?? item.faqId ?? item.Id ?? "");
  return {
    id,
    // Prefer explicit question/answer; fallback to title/description for client response
    question: item.question ?? item.title,
    answer: item.answer ?? item.description,
    question_en: item.question_en,
    question_ar: item.question_ar,
    answer_en: item.answer_en,
    answer_ar: item.answer_ar,
    order_index: item.order_index,
    is_active: item.is_active,
  };
};

// GET /Client/Faqs/GetAllFaqs
export const getAllClientFaqs = async (): Promise<ClientFaq[]> => {
  try {
    const { data } = await axiosInstance.get("/Client/Faqs/GetAllFaqs");
    const items = unwrap<FaqApiItem[]>(data);
    const arr = Array.isArray(items) ? items : [];
    return arr.map(normalizeFaq);
  } catch (error: any) {
    const msg = error?.response?.data?.customMessage || error?.message || "Failed to fetch FAQs";
    throw new Error(msg);
  }
};

// GET /Client/Faqs/GetFaqsById/:id
export const getClientFaqById = async (id: string | number): Promise<ClientFaq> => {
  try {
    const { data } = await axiosInstance.get(`/Client/Faqs/GetFaqsById/${id}`);
    const item = unwrap<FaqApiItem>(data);
    return normalizeFaq(item);
  } catch (error: any) {
    const msg = error?.response?.data?.customMessage || error?.message || "Failed to fetch FAQ";
    throw new Error(msg);
  }
};