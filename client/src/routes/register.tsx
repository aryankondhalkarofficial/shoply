import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { RedirectIfAuthenticated } from "@/components/auth/require-auth";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().trim().email("Enter a valid email address").max(255),
    password: z.string().min(8, "Password must be at least 8 characters").max(128),
    confirmPassword: z.string(),
    address: z.string().trim().min(3, "Address is required").max(200),
    city: z.string().trim().min(2, "City is required").max(100),
    postalCode: z.string().trim().min(3, "Postal code is required").max(20),
    state: z.string().trim().min(2, "State is required").max(100),
    country: z.string().trim().min(2, "Country is required").max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterValues = z.infer<typeof registerSchema>;

const initialValues: RegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  address: "",
  city: "",
  postalCode: "",
  state: "",
  country: "",
};

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create Account — Shoply" },
      { name: "description", content: "Create a Shoply account to save your cart, checkout faster and track your orders." },
      { property: "og:title", content: "Create Account — Shoply" },
      { property: "og:description", content: "Join Shoply to save your cart, checkout faster and track orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RedirectIfAuthenticated>
      <RegisterPage />
    </RedirectIfAuthenticated>
  ),
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState<RegisterValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const set = (key: keyof RegisterValues) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { confirmPassword: _confirmPassword, ...payload } = parsed.data;
      await register(payload);
      toast.success("Account created — welcome to Shoply!");
      navigate({ to: "/products", replace: true });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to create account");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof RegisterValues, label: string, placeholder: string, type = "text") => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={type}
        value={values[key]}
        onChange={set(key)}
        placeholder={placeholder}
        className="h-11"
      />
      {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
    </div>
  );

  return (
    <AuthLayout
      wide
      title="Create your account"
      subtitle="We use your address for shipping — you can update it any time from your profile."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-foreground hover:text-brand">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            {field("name", "Full name", "Test User")}
            {field("email", "Email", "Enter your email", "email")}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={values.password}
                  onChange={set("password")}
                  placeholder="Enter your password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors["password"] && <p className="text-xs text-destructive">{errors["password"]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={set("confirmPassword")}
                  placeholder="Confirm your password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors["confirmPassword"] && (
                <p className="text-xs text-destructive">{errors["confirmPassword"]}</p>
              )}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {field("address", "Address", "221B Baker Street")}
            {field("city", "City", "Bengaluru")}
            {field("postalCode", "Postal code", "560001")}
            {field("state", "State / Region", "Karnataka")}
          </div>
          {field("country", "Country", "India")}

          {formError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {formError}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Create account
          </Button>
      </form>
    </AuthLayout>
  );
}
