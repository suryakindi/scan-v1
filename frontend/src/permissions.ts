export const permissions: PermissionT[] = [
  {
    module: "Management-Client",
    can_view: true,
    can_edit: true,
    can_create: false,
    can_delete: false,
  },
  {
    module: "Management-Client",
    can_view: true,
    can_edit: false,
    can_create: true,
    can_delete: false,
  },
  {
    module: "Integrasi-Tools",
    can_view: true,
    can_edit: false,
    can_create: true,
    can_delete: true,
  },
  {
    module: "Registrasi",
    can_view: true,
    can_edit: true,
    can_create: true,
    can_delete: true,
  },
  {
    module: "Master-Data",
    can_view: true,
    can_edit: true,
    can_create: true,
    can_delete: true,
  },
];
