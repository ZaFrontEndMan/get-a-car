import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { useRegistration } from "@/hooks/useRegistration";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useCountries,
  useCitiesByCountry,
  getSaudiArabiaId,
} from "@/hooks/useCountriesAndCities";

// Schema for user verification and registration form
const userVerificationSchema = z.object({
  userName: z
    .string()
    .min(3, { message: "username_min_length" })
    .max(50, { message: "username_max_length" }),
  password: z.string().min(6, { message: "passwordMinLength" }),
  city: z.string().min(1, { message: "city_required" }),
  country: z.string().min(1, { message: "country_required" }),
  email: z.string().email({ message: "invalid_email" }),
  firstName: z.string().min(1, { message: "nameRequired" }),
  fullName: z.string().min(1, { message: "nameRequired" }),
  lastName: z.string().min(1, { message: "nameRequired" }),
  nationalId: z.string().min(1, { message: "nationalIdRequired" }),
  phoneNumber: z.string().min(10, { message: "phone_number_invalid" }),
});

type UserVerificationFormData = z.infer<typeof userVerificationSchema>;

interface CheckUserBeforeBookingProps {
  onUserVerified: () => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const CheckUserBeforeBooking: React.FC<CheckUserBeforeBookingProps> = ({
  onUserVerified,
  t,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isLoading, error: apiError, register } = useRegistration();
  const { language } = useLanguage();
  const { data: countries } = useCountries();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<UserVerificationFormData>({
    resolver: zodResolver(userVerificationSchema),
    defaultValues: {
      userName: "",
      password: "",
      city: "",
      country: "",
      email: "",
      firstName: "",
      fullName: "",
      lastName: "",
      nationalId: "",
      phoneNumber: "",
    },
  });
  const { data: cities } = useCitiesByCountry(form.watch("country"));

  // Set default country to Saudi Arabia
  useEffect(() => {
    const setDefaultCountry = async () => {
      const saudiId = await getSaudiArabiaId();
      if (saudiId && !form.getValues("country")) {
        form.setValue("country", saudiId);
      }
    };
    setDefaultCountry();
  }, []);

  // Auto-scroll to top when error occurs
  useEffect(() => {
    if (apiError) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [apiError]);

  const onSubmit = async (data: UserVerificationFormData) => {
    // Create FormData object for API request
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("userType", "client");

    try {
      const registrationSuccess = await register("client", formData);

      if (registrationSuccess) {
        toast({
          title: t("registrationSuccessful"),
          description: t("user_verified_description"),
        });
        onUserVerified();
      } else if (apiError === "المستخدم موجود بالفعل") {
        onUserVerified();
      } else {
        toast({
          description: apiError || t("user_not_found_description"),
          variant: "destructive",
        });
        const params = new URLSearchParams({
          user_id: data.nationalId,
        });
        // navigate(`/signup?${params.toString()}`);
      }
    } catch (err) {
      toast({
        title: t("signupError"),
        description: t("please_try_again"),
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-center">{t("createAccount")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red" />
                  <span className="text-sm text-red">{apiError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full">
                  <Label htmlFor="firstName">{t("firstName")}</Label>
                  <Input
                    id="firstName"
                    type="text"
                    {...form.register("firstName")}
                    placeholder={t("firstName")}
                    className="rounded-lg border-gray-300"
                    disabled={isLoading}
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red">
                      {t(form.formState.errors.firstName.message!)}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label htmlFor="lastName">{t("lastName")}</Label>
                  <Input
                    id="lastName"
                    type="text"
                    {...form.register("lastName")}
                    placeholder={t("lastName")}
                    className="rounded-lg border-gray-300"
                    disabled={isLoading}
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red">
                      {t(form.formState.errors.lastName.message!)}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label htmlFor="fullName">{t("fullName")}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    {...form.register("fullName")}
                    placeholder={t("fullName")}
                    className="rounded-lg border-gray-300"
                    disabled={isLoading}
                  />
                  {form.formState.errors.fullName && (
                    <p className="text-sm text-red">
                      {t(form.formState.errors.fullName.message!)}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label htmlFor="userName">{t("userName")}</Label>
                  <Input
                    id="userName"
                    type="text"
                    {...form.register("userName")}
                    placeholder={t("userName")}
                    className="rounded-lg border-gray-300"
                    disabled={isLoading}
                  />
                  {form.formState.errors.userName && (
                    <p className="text-sm text-red">
                      {t(form.formState.errors.userName.message!)}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label htmlFor="email">{t("emailAddress")}</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder={t("emailAddress")}
                    className="rounded-lg border-gray-300"
                    disabled={isLoading}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red">
                      {t(form.formState.errors.email.message!)}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    {...form.register("phoneNumber")}
                    placeholder={t("phoneNumber")}
                    className="rounded-lg border-gray-300"
                    disabled={isLoading}
                  />
                  {form.formState.errors.phoneNumber && (
                    <p className="text-sm text-red">
                      {t(form.formState.errors.phoneNumber.message!)}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label htmlFor="country">{t("country")}</Label>
                  <Select
                    value={form.watch("country")}
                    onValueChange={(value) => form.setValue("country", value)}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCountry")} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries?.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {language === "ar"
                            ? country.name_ar
                            : country.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.country && (
                    <p className="text-sm text-red">
                      {t(form.formState.errors.country.message!)}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label htmlFor="city">{t("city")}</Label>
                  <Select
                    value={form.watch("city")}
                    onValueChange={(value) => form.setValue("city", value)}
                    disabled={isLoading || !form.watch("country")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCity")} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {language === "ar" ? city.name_ar : city.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.city && (
                    <p className="text-sm text-red">
                      {t(form.formState.errors.city.message!)}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <Label htmlFor="nationalId">{t("nationalId")}</Label>
                  <Input
                    id="nationalId"
                    type="text"
                    {...form.register("nationalId")}
                    placeholder={t("nationalId")}
                    className="rounded-lg border-gray-300"
                    disabled={isLoading}
                  />
                  {form.formState.errors.nationalId && (
                    <p className="text-sm text-red">
                      {t(form.formState.errors.nationalId.message!)}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <Label htmlFor="password">{t("password")}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...form.register("password")}
                      placeholder={t("password")}
                      className="rounded-lg border-gray-300 text-start"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pe-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red">
                      {t(form.formState.errors.password.message!)}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin mr-3" />
                    {t("createAccount")}
                  </>
                ) : (
                  t("verify_and_continue")
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CheckUserBeforeBooking;
