"use client";

import { useActionState, useRef, useState, useTransition, type ChangeEvent, type CSSProperties, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { deleteCardPhotoAction, type CardFormState } from "@/lib/actions/cards";
import { cardPath, logoSrc } from "@/lib/api";
import { compressImage } from "@/lib/image";
import { BOWJE_CARD_DEFAULTS } from "@/lib/card-defaults";
import { Button } from "@/components/ds";
import { resolveTemplate } from "@/components/card/templates/registry";
import { initials, theme } from "@/components/card/templates/shared";
import type { Card, CardPublic, Empresa, Template, User } from "@/lib/types";

const initial: CardFormState = {};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/** Botón con aspecto de enlace (para "Cambiar/Quitar foto"). */
const linkBtn: CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  textAlign: "left",
  fontSize: 13,
  textDecoration: "underline",
  color: "var(--accent)",
};

type CardAction = (prev: CardFormState, formData: FormData) => Promise<CardFormState>;

const DRAFT: CardPublic = {
  id: 0,
  slug: "preview",
  displayName: "Tu nombre",
  config: { colors: { primary: "#54D222", bg: "#1C1C1E", text: "#FFFFFF" }, layout: "minimal" },
};

/** Id de la empresa de una plantilla (viene como IRI "/api/empresas/1" u objeto). */
function templateEmpresaId(t: Template): string {
  if (!t.empresa) return "";
  if (typeof t.empresa === "string") return t.empresa.split("/").pop() || "";
  return String(t.empresa.id);
}

/**
 * Reconstruye la tarjeta en memoria para el preview. El aspecto (colores+diseño)
 * lo define la plantilla elegida; el resto son los campos del formulario.
 */
function buildLiveCard(form: HTMLFormElement, card: Card | undefined, template: Template | null, empresa: Empresa | null, photoOverride?: string, photoRemoved?: boolean, photoPos?: { x: number; y: number }, photoFit?: "cover" | "contain"): CardPublic {
  const fd = new FormData(form);
  const g = (k: string) => {
    const v = fd.get(k);
    const s = v === null ? "" : String(v).trim();
    return s || null;
  };
  const tplCfg = template?.defaultConfig;

  return {
    id: card?.id ?? 0,
    slug: card?.slug ?? "preview",
    displayName: g("displayName") || "Tu nombre",
    company: g("company"),
    jobTitle: g("jobTitle"),
    phone: g("phone"),
    mobile: g("mobile"),
    email: g("email"),
    website: g("website"),
    addressLine: g("addressLine"),
    city: g("city"),
    postalCode: g("postalCode"),
    country: g("country"),
    linkedin: g("linkedin"),
    template: template ?? null,
    empresa: empresa ?? null,
    config: {
      colors: tplCfg?.colors ?? { primary: "#54D222", bg: "#1C1C1E", text: "#FFFFFF" },
      layout: tplCfg?.layout ?? "minimal",
      photoUrl: photoOverride ?? (photoRemoved ? undefined : card?.config?.photoUrl),
      photoPosition: photoPos,
      photoFit,
      visibleFields: tplCfg?.visibleFields ?? card?.config?.visibleFields,
    },
  };
}

function Input({ name, label, defaultValue }: { name: string; label: string; defaultValue?: string | null }) {
  return (
    <div>
      <label className="bw-label" htmlFor={`f-${name}`}>
        {label}
      </label>
      <input id={`f-${name}`} name={name} className="bw-input" defaultValue={defaultValue ?? ""} />
    </div>
  );
}

/**
 * Formulario de tarjeta con preview en vivo. Eliges empresa → una de sus
 * plantillas; el color/diseño lo pone la plantilla (no hay selector de color).
 */
export function CardEditor({
  action,
  card,
  templates,
  users,
  empresas,
  lockEmpresa = false,
  submitLabel = "Guardar cambios",
  showPreview = true,
  previewAside,
}: {
  action: CardAction;
  card?: Card;
  templates: Template[];
  users?: User[];
  empresas?: Empresa[];
  // Si es true, la empresa se muestra fija (no editable): el usuario solo puede
  // cambiar de plantilla dentro de esa empresa. La empresa la asigna el admin.
  lockEmpresa?: boolean;
  submitLabel?: string;
  showPreview?: boolean;
  previewAside?: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  const initialEmpresaId = card && card.empresa && typeof card.empresa === "object" ? String(card.empresa.id) : "";
  const initialTemplateId = card && card.template && typeof card.template === "object" ? String(card.template.id) : "";

  const [empresaId, setEmpresaId] = useState<string>(initialEmpresaId);
  const [templateId, setTemplateId] = useState<string>(initialTemplateId);
  const [live, setLive] = useState<CardPublic>(card ?? DRAFT);
  // Preview local (blob) de la foto recién elegida, antes de guardarla.
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const [compressing, setCompressing] = useState(false);
  const photoPreviewRef = useRef<string | undefined>(undefined);
  // Marca si el usuario ha quitado la foto guardada (para volver a las iniciales).
  const [photoRemoved, setPhotoRemoved] = useState(false);
  const photoRemovedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [removing, startRemove] = useTransition();
  // Punto focal de la foto (object-position), en % 0–100. Arrastrar la reencuadra.
  const [photoPos, setPhotoPos] = useState<{ x: number; y: number }>(card?.config?.photoPosition ?? { x: 50, y: 50 });
  const photoPosRef = useRef(photoPos);
  // Encaje: "cover" recorta llenando el área; "contain" muestra la foto entera con fondo difuminado.
  const [photoFitMode, setPhotoFitMode] = useState<"cover" | "contain">(card?.config?.photoFit ?? "cover");
  const photoFitRef = useRef(photoFitMode);
  const dragRef = useRef<{ startX: number; startY: number; baseX: number; baseY: number; w: number; h: number } | null>(null);

  const currentUserId = card && card.user && typeof card.user === "object" ? card.user.id : "";

  const templatesForEmpresa = templates.filter((t) => templateEmpresaId(t) === empresaId);

  // Reconstruye el preview leyendo el formulario; reconcilia empresa↔plantilla.
  function syncLive(form: HTMLFormElement) {
    const fd = new FormData(form);
    const empId = String(fd.get("empresaId") || "");
    let tplId = String(fd.get("templateId") || "");
    const forEmp = templates.filter((t) => templateEmpresaId(t) === empId);
    if (!forEmp.some((t) => String(t.id) === tplId)) {
      tplId = forEmp[0] ? String(forEmp[0].id) : "";
    }
    setEmpresaId(empId);
    setTemplateId(tplId);
    const tpl = templates.find((t) => String(t.id) === tplId) ?? null;
    const emp = empresas?.find((e) => String(e.id) === empId) ?? null;
    setLive(buildLiveCard(form, card, tpl, emp, photoPreviewRef.current, photoRemovedRef.current, photoPosRef.current, photoFitRef.current));
  }

  // Abre el selector de archivo (al pinchar la foto o el botón "Cambiar").
  function openPhotoPicker() {
    fileInputRef.current?.click();
  }

  // Al elegir un archivo, lo comprime en el navegador (para no chocar con los
  // límites de subida) y genera una URL local para previsualizarlo al instante.
  async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    let file = input.files?.[0];
    if (file) {
      setCompressing(true);
      try {
        const compressed = await compressImage(file);
        if (compressed !== file) {
          // Sustituimos el archivo del input por el comprimido: es el que se subirá.
          const dt = new DataTransfer();
          dt.items.add(compressed);
          input.files = dt.files;
          file = compressed;
        }
      } catch {
        // Si la compresión falla, subimos el original (mejor eso que bloquear).
      } finally {
        setCompressing(false);
      }
    }
    if (photoPreviewRef.current) URL.revokeObjectURL(photoPreviewRef.current);
    const url = file ? URL.createObjectURL(file) : undefined;
    photoPreviewRef.current = url;
    setPhotoPreview(url);
    // Elegir una foto anula un borrado previo y recentra el encuadre.
    photoRemovedRef.current = false;
    setPhotoRemoved(false);
    applyPhotoPos({ x: 50, y: 50 });
    if (input.form) syncLive(input.form);
  }

  // Cambia el modo de encaje y actualiza la vista previa del layout en vivo.
  function applyPhotoFit(mode: "cover" | "contain") {
    photoFitRef.current = mode;
    setPhotoFitMode(mode);
    const form = fileInputRef.current?.form;
    if (form) syncLive(form);
  }

  // Fija el punto focal y reencuadra la vista previa del layout en vivo.
  function applyPhotoPos(pos: { x: number; y: number }) {
    photoPosRef.current = pos;
    setPhotoPos(pos);
    const form = fileInputRef.current?.form;
    if (form) syncLive(form);
  }

  // Arrastrar la foto en el recuadro para reencuadrarla (ratón y táctil).
  function handlePosPointerDown(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = { startX: e.clientX, startY: e.clientY, baseX: photoPosRef.current.x, baseY: photoPosRef.current.y, w: rect.width, h: rect.height };
  }
  function handlePosPointerMove(e: PointerEvent<HTMLDivElement>) {
    const d = dragRef.current;
    if (!d) return;
    // Arrastrar la imagen a la derecha/abajo revela el lado opuesto → resta.
    const x = clamp(d.baseX - ((e.clientX - d.startX) / d.w) * 100, 0, 100);
    const y = clamp(d.baseY - ((e.clientY - d.startY) / d.h) * 100, 0, 100);
    applyPhotoPos({ x: Math.round(x), y: Math.round(y) });
  }
  function handlePosPointerUp() {
    dragRef.current = null;
  }

  // Quita la foto: limpia la selección local y, si estaba guardada, la borra en el backend.
  function handleRemovePhoto(e: MouseEvent<HTMLButtonElement>) {
    const form = e.currentTarget.form;
    if (photoPreviewRef.current) URL.revokeObjectURL(photoPreviewRef.current);
    photoPreviewRef.current = undefined;
    setPhotoPreview(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
    photoRemovedRef.current = true;
    setPhotoRemoved(true);
    if (form) syncLive(form);
    if (card?.id && card.config?.photoUrl) {
      startRemove(async () => {
        await deleteCardPhotoAction(card.id);
      });
    }
  }

  const Preview = resolveTemplate(live);
  const empresaLogo = live.empresa && typeof live.empresa === "object" ? live.empresa.logoUrl : null;

  const form = (
    <form
      action={formAction}
      onChange={(e) => syncLive(e.currentTarget)}
      className="bw-surface flex flex-col gap-5"
      style={{ padding: 24 }}
    >
      {users && (
        <div>
          <label className="bw-label" htmlFor="f-userId">
            Usuario*
          </label>
          <select id="f-userId" name="userId" className="bw-select" defaultValue={currentUserId}>
            <option value="">— Elige un usuario —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
      )}

      <Input name="displayName" label="Nombre visible*" defaultValue={card?.displayName} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input name="jobTitle" label="Cargo" defaultValue={card?.jobTitle} />
        <Input name="company" label="Empresa (texto en la tarjeta)" defaultValue={card ? card.company : BOWJE_CARD_DEFAULTS.company} />
        <Input name="mobile" label="Móvil" defaultValue={card?.mobile} />
        <Input name="phone" label="Teléfono" defaultValue={card ? card.phone : BOWJE_CARD_DEFAULTS.phone} />
        <Input name="email" label="Email" defaultValue={card?.email} />
        <Input name="website" label="Web" defaultValue={card ? card.website : BOWJE_CARD_DEFAULTS.website} />
        <Input name="addressLine" label="Dirección" defaultValue={card ? card.addressLine : BOWJE_CARD_DEFAULTS.addressLine} />
        <Input name="city" label="Ciudad" defaultValue={card ? card.city : BOWJE_CARD_DEFAULTS.city} />
        <Input name="postalCode" label="Código postal" defaultValue={card ? card.postalCode : BOWJE_CARD_DEFAULTS.postalCode} />
        <Input name="country" label="País" defaultValue={card ? card.country : BOWJE_CARD_DEFAULTS.country} />
        <Input name="linkedin" label="LinkedIn" defaultValue={card?.linkedin} />
      </div>

      {(() => {
        const photoThumb = photoPreview ?? (photoRemoved ? undefined : logoSrc(card?.config?.photoUrl));
        return (
          <div>
            <label className="bw-label">Foto</label>
            <div className="flex items-center gap-3">
              {/* Pinchar la foto (o el hueco) abre el selector para subir/cambiar. */}
              <button
                type="button"
                onClick={openPhotoPicker}
                title={photoThumb ? "Cambiar foto" : "Subir foto"}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  overflow: "hidden",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid var(--border, rgba(0,0,0,0.15))",
                  background: "var(--surface-2, rgba(0,0,0,0.04))",
                  color: "var(--text-muted)",
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                {photoThumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoThumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  initials(live.displayName)
                )}
              </button>

              <div className="flex flex-col gap-1">
                <button type="button" onClick={openPhotoPicker} style={linkBtn}>
                  {photoThumb ? "Cambiar foto" : "Subir foto"}
                </button>
                {photoThumb && (
                  <button type="button" onClick={handleRemovePhoto} disabled={removing} style={{ ...linkBtn, color: "#ff6b6b" }}>
                    {removing ? "Quitando…" : "Quitar foto"}
                  </button>
                )}
              </div>
            </div>

            {photoThumb && (
              <div style={{ marginTop: 10 }}>
                {photoFitMode === "cover" && (
                  <>
                    <div
                      onPointerDown={handlePosPointerDown}
                      onPointerMove={handlePosPointerMove}
                      onPointerUp={handlePosPointerUp}
                      style={{
                        width: 180,
                        height: 180,
                        borderRadius: 8,
                        overflow: "hidden",
                        border: "1px solid var(--border, rgba(0,0,0,0.15))",
                        cursor: "grab",
                        touchAction: "none",
                        userSelect: "none",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoThumb}
                        alt=""
                        draggable={false}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${photoPos.x}% ${photoPos.y}%`, pointerEvents: "none" }}
                      />
                    </div>
                    <div className="flex items-center gap-3" style={{ marginTop: 6 }}>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Arrastra la foto para reencuadrarla</span>
                      <button type="button" onClick={() => applyPhotoPos({ x: 50, y: 50 })} style={linkBtn}>
                        Centrar
                      </button>
                    </div>
                  </>
                )}

                {/* Encaje: recortar llenando el área o mostrar la foto entera con fondo difuminado. */}
                <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="photoFit"
                      value="cover"
                      checked={photoFitMode === "cover"}
                      onChange={() => applyPhotoFit("cover")}
                      style={{ accentColor: "var(--accent)" }}
                    />
                    Recortar (llenar)
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="photoFit"
                      value="contain"
                      checked={photoFitMode === "contain"}
                      onChange={() => applyPhotoFit("contain")}
                      style={{ accentColor: "var(--accent)" }}
                    />
                    Mostrar entera (fondo difuminado)
                  </label>
                </div>
              </div>
            )}

            <input type="hidden" name="photoPosX" value={photoPos.x} />
            <input type="hidden" name="photoPosY" value={photoPos.y} />
            <input type="hidden" name="currentPhotoUrl" value={photoRemoved ? "" : card?.config?.photoUrl ?? ""} />
            <input
              ref={fileInputRef}
              id="f-photo"
              name="photo"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
              PNG, JPG, WEBP o SVG. Las fotos grandes se optimizan automáticamente al subirlas. Si no subes ninguna, se muestran tus iniciales.
            </p>
          </div>
        );
      })()}

      <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
        <input type="checkbox" name="isPublished" defaultChecked={card ? (card.isPublished ?? false) : true} style={{ accentColor: "var(--accent)" }} />
        {card?.slug ? `Publicada (visible en ${cardPath(card.empresa, card.slug)})` : "Publicada (visible al público)"}
      </label>

      {empresas && empresas.length > 0 && (
        <div className="flex flex-col gap-3" style={{ borderTop: "1px solid var(--border, rgba(0,0,0,0.12))", paddingTop: 18 }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Elige el diseño de tu tarjeta. Al cambiarlo lo verás al instante en la vista previa.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="bw-label" htmlFor="f-empresa">
                Empresa (marca)
              </label>
              {lockEmpresa ? (
                // La empresa la fija el admin: solo lectura. El hidden conserva el
                // valor para que syncLive y el envío del formulario funcionen igual.
                <>
                  <div id="f-empresa" className="bw-input" aria-readonly="true" style={{ opacity: 0.85 }}>
                    {empresas.find((e) => String(e.id) === empresaId)?.name ?? "Sin empresa asignada"}
                  </div>
                  <input type="hidden" name="empresaId" value={empresaId} />
                </>
              ) : (
                <select id="f-empresa" name="empresaId" className="bw-select" value={empresaId} onChange={(e) => setEmpresaId(e.target.value)}>
                  <option value="">— Sin empresa —</option>
                  {empresas.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="bw-label" htmlFor="f-template">
                Diseño de la tarjeta
              </label>
              <select id="f-template" name="templateId" className="bw-select" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
                <option value="">{empresaId ? "— Elige un diseño —" : "Elige antes la empresa"}</option>
                {templatesForEmpresa.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {state.error && <p style={{ color: "#ff6b6b", fontSize: 14 }}>{state.error}</p>}
      {state.ok && <p style={{ color: "var(--accent)", fontSize: 14 }}>Cambios guardados.</p>}

      <div>
        <Button type="submit" variant="primary" disabled={pending || compressing}>
          {compressing ? "Optimizando imagen…" : pending ? "Guardando…" : submitLabel}
        </Button>
      </div>
    </form>
  );

  if (!showPreview) return form;

  return (
    <div className="flex flex-col gap-8">
      {/* Formulario + vista previa. En escritorio la previa se alinea al fondo
          (items-end) y queda sticky, para verla junto al selector de diseño. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start lg:items-end">
        {form}

        <div className="lg:sticky lg:bottom-6">
          <p style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>
            Vista previa (tamaño real en móvil)
          </p>
          <div className="bw-surface" style={{ padding: 28, background: theme(live).bg }}>
            {/* Mismo ancho que la página pública: max-w-[420px] con px-4 → 388px. */}
            <div style={{ maxWidth: 388, margin: "0 auto" }}>
              {empresaLogo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc(empresaLogo)} alt="" style={{ maxHeight: 28, marginBottom: 20, display: "block" }} />
              )}
              {/* eslint-disable-next-line react-hooks/static-components -- resolveTemplate elige una plantilla del registro fijo (TEMPLATES), no crea un componente en cada render */}
              <Preview card={live} preview />
            </div>
          </div>
        </div>
      </div>

      {/* Métricas y wallet: debajo de todo (fuera de la columna de la previa). */}
      {previewAside}
    </div>
  );
}
