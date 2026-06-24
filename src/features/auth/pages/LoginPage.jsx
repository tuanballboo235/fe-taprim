import { useEffect, useMemo, useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaSignInAlt, FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@/shared/components/Button";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";
import { useAuth } from "@/features/auth/hooks/useAuth";

const getErrorMessage = (error) => {
  return getApiErrorMessage(
    error,
    "Dang nhap khong thanh cong. Vui long thu lai."
  );
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get("redirect") || "/admin";
    return target.startsWith("/") && !target.startsWith("//") ? target : "/admin";
  }, [location.search]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? redirectTo : "/product", { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, redirectTo]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await login({
        username: form.username.trim(),
        password: form.password,
      });
      notify.success("Dang nhap thanh cong.");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      notify.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm p-6">
        <Link to="/product" className="inline-flex items-center gap-2 mb-8">
          <img
            src="https://res.cloudinary.com/dzcb8xqjh/image/upload/v1750269205/logo_crop_xlfxai.png"
            alt="taprim"
            className="h-12 w-32 object-contain"
          />
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Dang nhap quan tri</h1>
          <p className="mt-2 text-sm text-slate-500">
            Su dung tai khoan duoc cap de truy cap khu quan tri.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Ten dang nhap</span>
            <span className="mt-2 flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-2 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
              <FaUser className="shrink-0 text-slate-400" />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 outline-none"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Mat khau</span>
            <span className="mt-2 flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-2 focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
              <FaLock className="shrink-0 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="w-full border-0 bg-transparent p-0 text-sm text-slate-900 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="shrink-0 text-slate-500 hover:text-slate-800"
                title={showPassword ? "An mat khau" : "Hien mat khau"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </span>
          </label>

          {error && (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            leftIcon={<FaSignInAlt />}
          >
            {isSubmitting ? "Dang dang nhap..." : "Dang nhap"}
          </Button>
        </form>
      </section>
    </main>
  );
}
