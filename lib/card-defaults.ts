// Datos de empresa por defecto (Bowje) con los que se rellena una tarjeta nueva
// (creada por admin, por el enlace SSO, o desde "Crear mi tarjeta"). El usuario
// los puede cambiar luego. La web lleva https:// para que el enlace funcione
// (en la tarjeta pública se muestra sin el protocolo).
export const BOWJE_CARD_DEFAULTS = {
  company: "Bowje",
  phone: "91 659 29 28",
  website: "https://bowje.es",
  addressLine: "Calle Lanzarote 4",
  city: "San Sebastián de los Reyes",
  postalCode: "28703",
  country: "España",
} as const;
