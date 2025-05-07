import Swal from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  showConfirmButton: false,
  position: "top-right",
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const Alert = Swal.mixin({
  customClass: {
    confirmButton:
      "px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer rounded-sm outline-none",
  },
  buttonsStyling: false,
  showConfirmButton: true,
  timer: 3000,
});

export const Confirm = Swal.mixin({
  customClass: {
    confirmButton:
      "px-4 py-2 bg-green-600 hover:bg-green-500 text-white cursor-pointer rounded-sm outline-none",
    cancelButton:
      "px-4 py-2 bg-red-600 hover:bg-red-500 text-white cursor-pointer rounded-sm outline-none",
    actions: "gap-4",
  },
  buttonsStyling: false,
  icon: "warning",
  showCancelButton: true,
  confirmButtonText: "Confirm !",
  cancelButtonText: "Cancel !",
  reverseButtons: true,
});
