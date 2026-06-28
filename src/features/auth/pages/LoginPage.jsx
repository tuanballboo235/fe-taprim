import { useEffect, useMemo, useState } from "react";
import { FaEye, FaEyeSlash, FaLock, FaSignInAlt, FaUser, FaEnvelope, FaUserPlus, FaKey, FaArrowLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@/shared/components/Button";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { register, sendVerificationCode, forgotPassword } from "@/features/auth/api/authService";

const getErrorMessage = (error, defaultMsg) => {
  return getApiErrorMessage(error, defaultMsg);
};

const isAdminRole = (role) => {
  if (Array.isArray(role)) return role.some(isAdminRole);

  const normalizedRole = String(role ?? "").trim().toLowerCase();
  return normalizedRole === "0" || normalizedRole === "admin";
};

const getDashboardRedirect = (requestedPath, adminRole) => {
  const fallbackPath = adminRole ? "/admin" : "/user";
  const target = requestedPath || fallbackPath;

  if (!adminRole && target.startsWith("/admin")) return "/user";

  return target;
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, login } = useAuth();
  
  // State for different modes: "login" | "register" | "verify_registration" | "forgot_password"
  const [mode, setMode] = useState("login");
  
  // Login form state
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  
  // Register form state
  const [registerForm, setRegisterForm] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // OTP entered during verify registration
  const [otpCode, setOtpCode] = useState("");

  // Forgot password form state
  const [forgotForm, setForgotForm] = useState({
    email: "",
    newPassword: "",
    code: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [error, setError] = useState("");

  // OTP Countdown states
  const [registerOtpCountdown, setRegisterOtpCountdown] = useState(0);
  const [forgotOtpCountdown, setForgotOtpCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (registerOtpCountdown > 0) {
      timer = setInterval(() => {
        setRegisterOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [registerOtpCountdown]);

  useEffect(() => {
    let timer;
    if (forgotOtpCountdown > 0) {
      timer = setInterval(() => {
        setForgotOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [forgotOtpCountdown]);

  const redirectTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const target = params.get("redirect") || "";
    return target.startsWith("/") && !target.startsWith("//") ? target : "";
  }, [location.search]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getDashboardRedirect(redirectTo, isAdmin), { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, redirectTo]);

  // Handle Login Change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setForm((current) => ({ ...current, [name]: value }));
  };

  // Handle Register Change
  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setRegisterForm((current) => ({ ...current, [name]: value }));
  };

  // Handle Forgot Change
  const handleForgotChange = (event) => {
    const { name, value } = event.target;
    setError("");
    setForgotForm((current) => ({ ...current, [name]: value }));
  };

  // Handle Send OTP Code
  const handleSendOtp = async (email, forMode) => {
    if (!email) {
      notify.error("Vui lòng nhập địa chỉ email trước.");
      return;
    }
    if (!email.includes("@")) {
      notify.error("Địa chỉ email không hợp lệ.");
      return;
    }

    setIsSendingOtp(true);
    try {
      await sendVerificationCode({ email: email.trim() });
      notify.success("Mã xác minh đã được gửi về email của bạn.");
      if (forMode === "register") {
        setRegisterOtpCountdown(60);
      } else {
        setForgotOtpCountdown(60);
      }
    } catch (err) {
      const message = getErrorMessage(err, "Gửi mã xác minh thất bại. Vui lòng kiểm tra lại.");
      notify.error(message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Login Submit
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const result = await login({
        username: form.username.trim(),
        password: form.password,
      });
      notify.success("Đăng nhập thành công.");
      navigate(getDashboardRedirect(redirectTo, isAdminRole(result?.user?.role)), {
        replace: true,
      });
    } catch (err) {
      const message = getErrorMessage(err, "Đăng nhập không thành công. Vui lòng thử lại.");
      setError(message);
      notify.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Register Submit - First send code and move to verification screen
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      notify.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (registerForm.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      notify.error("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setIsSendingOtp(true);
    setError("");

    try {
      await sendVerificationCode({ email: registerForm.email.trim() });
      notify.success("Mã xác minh đã được gửi đến email của bạn.");
      setRegisterOtpCountdown(60);
      setMode("verify_registration");
    } catch (err) {
      const message = getErrorMessage(err, "Gửi mã xác minh thất bại. Vui lòng kiểm tra lại.");
      setError(message);
      notify.error(message);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verification OTP and Complete Registration Submit
  const handleVerifyRegistrationSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await register({
        username: registerForm.username.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
        code: otpCode.trim(),
      });
      notify.success("Đăng ký tài khoản thành công!");
      setForm((current) => ({ ...current, username: registerForm.username }));
      setRegisterForm({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      });
      setOtpCode("");
      setMode("login");
    } catch (err) {
      const message = getErrorMessage(err, "Đăng ký không thành công. Mã xác minh không chính xác hoặc đã hết hạn.");
      setError(message);
      notify.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Forgot Password Submit
  const handleForgotPasswordSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await forgotPassword({
        email: forgotForm.email.trim(),
        newPassword: forgotForm.newPassword,
        code: forgotForm.code.trim(),
      });
      notify.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập bằng mật khẩu mới.");
      setForm((current) => ({ ...current, username: forgotForm.email }));
      setMode("login");
    } catch (err) {
      const message = getErrorMessage(err, "Đặt lại mật khẩu không thành công. Vui lòng thử lại.");
      setError(message);
      notify.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-slate-50 to-emerald-100/50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-40 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-40 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <section className="w-full max-w-md bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/40 p-8 transition-all duration-300 relative z-10 hover:shadow-2xl hover:shadow-emerald-100/20">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/product" className="inline-block transition-transform duration-300 hover:scale-105">
            <img
              src="https://res.cloudinary.com/dzcb8xqjh/image/upload/v1750269205/logo_crop_xlfxai.png"
              alt="taprim"
              className="h-14 w-36 object-contain"
            />
          </Link>
        </div>

        {/* Back Button for Register, Verify, or Forgot Password */}
        {(mode === "register" || mode === "verify_registration" || mode === "forgot_password") && (
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 mb-6 transition-colors duration-200"
          >
            <FaArrowLeft /> Quay lại đăng nhập
          </button>
        )}

        {/* Heading text */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">
            {mode === "login" && "Đăng nhập tài khoản"}
            {mode === "register" && "Đăng ký thành viên"}
            {mode === "verify_registration" && "Xác minh tài khoản"}
            {mode === "forgot_password" && "Khôi phục mật khẩu"}
          </h1>
          <p className="mt-1.5 text-xs text-slate-500">
            {mode === "login" && "Đăng nhập để tiếp tục mua hàng và tra cứu đơn."}
            {mode === "register" && "Tạo tài khoản mới để hưởng trọn ưu đãi từ TAPRIM."}
            {mode === "verify_registration" && `Mã xác minh (OTP) đã được gửi đến email ${registerForm.email}.`}
            {mode === "forgot_password" && "Nhập email của bạn để nhận mã đặt lại mật khẩu."}
          </p>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700">
            {error}
          </p>
        )}

        {/* ---------------- FORM LOGIN ---------------- */}
        {mode === "login" && (
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Tên đăng nhập / Email
              </span>
              <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-200">
                <FaUser className="shrink-0 text-slate-400 text-sm" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Nhập username hoặc email..."
                  autoComplete="username"
                  className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Mật khẩu</span>
              <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-200">
                <FaLock className="shrink-0 text-slate-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu..."
                  autoComplete="current-password"
                  className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((curr) => !curr)}
                  className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors duration-200"
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </span>
            </label>

            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-800 transition-colors duration-200"
              >
                Chưa có tài khoản? Đăng ký
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("forgot_password");
                  setError("");
                }}
                className="text-xs font-medium text-slate-500 hover:text-emerald-600 transition-colors duration-200"
              >
                Quên mật khẩu?
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              leftIcon={<FaSignInAlt />}
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 py-3 rounded-lg text-sm font-semibold shadow-md shadow-emerald-100"
            >
              {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        )}

        {/* ---------------- FORM REGISTER ---------------- */}
        {mode === "register" && (
          <form className="space-y-4" onSubmit={handleRegisterSubmit}>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</span>
              <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-200">
                <FaEnvelope className="shrink-0 text-slate-400 text-sm" />
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  placeholder="name@example.com"
                  className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Tên đăng nhập (Username)</span>
              <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-200">
                <FaUser className="shrink-0 text-slate-400 text-sm" />
                <input
                  type="text"
                  name="username"
                  value={registerForm.username}
                  onChange={handleRegisterChange}
                  placeholder="Nhập tên đăng nhập..."
                  className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Mật khẩu</span>
              <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-200">
                <FaLock className="shrink-0 text-slate-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  placeholder="Tối thiểu 6 ký tự..."
                  className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((curr) => !curr)}
                  className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors duration-200"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Xác nhận mật khẩu</span>
              <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-200">
                <FaLock className="shrink-0 text-slate-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Nhập lại mật khẩu..."
                  className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  required
                />
              </span>
            </label>

            <Button
              type="submit"
              fullWidth
              isLoading={isSendingOtp}
              leftIcon={<FaUserPlus />}
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 py-3 rounded-lg text-sm font-semibold shadow-md shadow-emerald-100"
            >
              {isSendingOtp ? "Đang xử lý..." : "Đăng ký tài khoản"}
            </Button>
          </form>
        )}

        {/* ---------------- FORM VERIFY REGISTRATION (OTP) ---------------- */}
        {mode === "verify_registration" && (
          <form className="space-y-4" onSubmit={handleVerifyRegistrationSubmit}>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Mã OTP xác minh</span>
              <div className="mt-1.5 flex gap-2">
                <span className="flex-1 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-200">
                  <FaKey className="shrink-0 text-slate-400 text-sm" />
                  <input
                    type="text"
                    name="code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Nhập mã 6 chữ số..."
                    className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
                    required
                  />
                </span>
                <button
                  type="button"
                  disabled={isSendingOtp || registerOtpCountdown > 0}
                  onClick={() => handleSendOtp(registerForm.email, "register")}
                  className="px-4 py-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 select-none min-w-[100px] text-center"
                >
                  {isSendingOtp ? "Đang gửi..." : registerOtpCountdown > 0 ? `${registerOtpCountdown}s` : "Gửi lại mã"}
                </button>
              </div>
            </label>

            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              leftIcon={<FaKey />}
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 py-3 rounded-lg text-sm font-semibold shadow-md shadow-emerald-100"
            >
              {isSubmitting ? "Đang xác minh..." : "Xác minh & Hoàn tất"}
            </Button>
          </form>
        )}

        {/* ---------------- FORM FORGOT PASSWORD ---------------- */}
        {mode === "forgot_password" && (
          <form className="space-y-4" onSubmit={handleForgotPasswordSubmit}>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email tài khoản</span>
              <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-200">
                <FaEnvelope className="shrink-0 text-slate-400 text-sm" />
                <input
                  type="email"
                  name="email"
                  value={forgotForm.email}
                  onChange={handleForgotChange}
                  placeholder="name@example.com"
                  className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Mã OTP</span>
              <div className="mt-1.5 flex gap-2">
                <span className="flex-1 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-200">
                  <FaKey className="shrink-0 text-slate-400 text-sm" />
                  <input
                    type="text"
                    name="code"
                    value={forgotForm.code}
                    onChange={handleForgotChange}
                    placeholder="Mã 6 chữ số..."
                    className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
                    required
                  />
                </span>
                <button
                  type="button"
                  disabled={isSendingOtp || forgotOtpCountdown > 0}
                  onClick={() => handleSendOtp(forgotForm.email, "forgot")}
                  className="px-4 py-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 select-none min-w-[100px] text-center"
                >
                  {isSendingOtp ? "Đang gửi..." : forgotOtpCountdown > 0 ? `${forgotOtpCountdown}s` : "Gửi mã"}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Mật khẩu mới</span>
              <span className="mt-1.5 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all duration-200">
                <FaLock className="shrink-0 text-slate-400 text-sm" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={forgotForm.newPassword}
                  onChange={handleForgotChange}
                  placeholder="Tối thiểu 6 ký tự..."
                  className="w-full border-0 bg-transparent p-0 text-sm text-slate-800 placeholder-slate-400 outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((curr) => !curr)}
                  className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors duration-200"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </span>
            </label>

            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              leftIcon={<FaKey />}
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 py-3 rounded-lg text-sm font-semibold shadow-md shadow-emerald-100"
            >
              {isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}

