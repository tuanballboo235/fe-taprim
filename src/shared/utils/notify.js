import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2800,
  timerProgressBar: true,
  customClass: {
    popup: "taprim-swal-toast",
  },
});

const fireToast = (icon, title, options = {}) =>
  toast.fire({
    icon,
    title,
    ...options,
  });

export const notify = {
  success: (title, options) => fireToast("success", title, options),
  error: (title, options) => fireToast("error", title, options),
  warning: (title, options) => fireToast("warning", title, options),
  info: (title, options) => fireToast("info", title, options),
  confirm: async ({
    title = "Bạn chắc chắn?",
    text,
    confirmButtonText = "Đồng ý",
    cancelButtonText = "Hủy",
    icon = "question",
    confirmButtonColor = "#15803d",
    cancelButtonColor = "#64748b",
  } = {}) => {
    const result = await Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor,
      cancelButtonColor,
      reverseButtons: true,
    });

    return result.isConfirmed;
  },
  loading: (title = "Đang xử lý...") =>
    Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => Swal.showLoading(),
    }),
  close: () => Swal.close(),
};

export default notify;
