<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    offset-y
    transition="scale-transition"
  >
    <template #activator="{ props }">
      <v-text-field
        v-model="formattedDate"
        v-bind="props"
        :class="componentProps.classField"
        :clearable="componentProps.clearable"
        density="compact"
        :error-messages="componentProps.errorMessages"
        :label="componentProps.label"
        maxlength="10"
        persistent-hint
        placeholder="dd/mm/aaaa"
        prepend-inner-icon="mdi-calendar"
        :readonly="componentProps.readonly"
        variant="outlined"
        @keypress="onlyNumbers"
      />
    </template>

    <!-- wrapper fixo para posicionamento livre -->
    <div ref="dragWrapper" :style="wrapperStyle" @pointerdown.stop>
      <!-- ícone de arraste no canto direito superior -->
      <v-icon
        ref="dragHandle"
        aria-label="Arrastar"
        class="absolute top-0 right-[-24px] w-8 h-8 text-gray-500 flex items-center justify-center cursor-grab"
        @pointerdown.prevent="startDrag"
        @pointerup="endPointer"
        type="button"
      >
        mdi-arrow-all
      </v-icon>

      <div>
        <v-date-picker
          v-model="date"
          border="sm"
          divided
          elevation="4"
          header-color="blue"
          :min="min"
          rounded="lg"
          @update:model-value="handleDateUpdate"
          :events="['2026-02-15']"
          event-color="red"
        >
          <template #day="{ props, item }">
            <v-btn
              v-bind="props"
              :class="[
                hasTravel(item.isoDate)
                  ? 'bg-ita-blue text-white font-bold'
                  : '',
              ]"
              variant="text"
            >
              {{ item.localized }}
            </v-btn>
          </template>
        </v-date-picker>
      </div>
    </div>
  </v-menu>
</template>

<script setup lang="ts">
import { format, isValid, parse, toDate } from "date-fns";
import { CSSProperties } from "vue";

const { onlyNumbers } = useOnlyNumbers();

type Position =
  | "bottom"
  | "top"
  | "bottom-left"
  | "top-left"
  | "center-left"
  | "center-right";
/* props: adiciona valueAsString para decidir se o componente emite string YYYY-MM-DD */
const componentProps = defineProps({
  label: { type: String, default: "Data" },
  errorMessages: { type: [String, Array] as any, default: null },
  modelValue: { type: [Date, String, null] as any, default: null },
  classDatePicker: { type: String, default: "" },
  readonly: { type: Boolean, default: false },
  classField: { type: String, required: false },
  clearable: { type: Boolean, required: false },
  position: {
    type: String as PropType<Position>,
    default: "bottom",
  },
  valueAsString: { type: Boolean, default: true }, // se true, emite "yyyy-MM-dd"
  min: { type: String },
  travelDates: { type: Array as PropType<string[]>, default: () => [] },
});

const emit = defineEmits(["update:modelValue"] as const);

/* estado */
const menu = ref(false);
const date = ref<Date | null>(null);
const dateInput = ref<string | null>(null);

/* ---------- utilitários seguros (date-only) ---------- */
/**
 * Converte input (Date | "dd/MM/yyyy" | "yyyy-MM-dd") para Date no fuso local,
 * evitando new Date("yyyy-mm-dd") que pode ser interpretado como UTC.
 */
function hasTravel(date: string) {
  return componentProps.travelDates.includes(date);
}
function parseDbOrLocaleStringToDate(
  s: string | Date | null | undefined,
): Date | null {
  if (s === null || s === undefined) return null;
  if (s instanceof Date) return s;
  const str = String(s).trim();

  // dd/MM/yyyy
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    const d = parse(str, "dd/MM/yyyy", new Date());
    return isValid(d) ? d : null;
  }

  // yyyy-MM-dd -> parse por partes (evita interpretação UTC)
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const [y, m, dd] = str.split("-").map(Number);
    if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(dd)) {
      return new Date(y, m - 1, dd);
    }
    return null;
  }

  // fallback: tenta toDate (pode interpretar, mas é última opção)
  try {
    const t = toDate(str);
    return isValid(t) ? t : null;
  } catch {
    return null;
  }
}

/** Date -> "yyyy-MM-dd" */
function dateToDbString(d: Date | null): string | null {
  if (!d) return null;
  return format(d, "yyyy-MM-dd");
}

/* ---------- formattedDate computed (string exibida no input) ---------- */
const formattedDate = computed<string>({
  get() {
    return dateInput.value ?? "";
  },
  set(v: string) {
    const masked = applyDateMask(v);
    dateInput.value = masked;
    if (masked?.length === 10) {
      const parsed = parse(masked, "dd/MM/yyyy", new Date());
      if (isValid(parsed)) {
        date.value = parsed;
        if (componentProps.valueAsString) {
          emit("update:modelValue", dateToDbString(parsed));
        } else {
          emit("update:modelValue", parsed);
        }
        return;
      }
    }
    // se máscara incompleta ou inválida
    date.value = null;
    emit("update:modelValue", null);
  },
});

/* watch do modelValue — trata strings 'yyyy-MM-dd' e 'dd/MM/yyyy' sem interpretar como UTC */
watch(
  () => componentProps.modelValue,
  (nv) => {
    if (nv !== null && nv !== undefined && String(nv).length > 0) {
      const dv = parseDbOrLocaleStringToDate(nv as any);
      if (dv && isValid(dv)) {
        date.value = dv;
        dateInput.value = format(dv, "dd/MM/yyyy");
        return;
      }
    }
    date.value = null;
    dateInput.value = null;
  },
  { immediate: true },
);

/* handler do date-picker (quando o usuário escolhe direto no calendário) */
const handleDateUpdate = (val: any) => {
  menu.value = false;
  const dv = parseDbOrLocaleStringToDate(val);
  if (!dv) {
    // se não conseguimos parsear, limpa e sai
    date.value = null;
    dateInput.value = null;
    emit("update:modelValue", null);
    return;
  }
  date.value = dv;
  dateInput.value = format(dv, "dd/MM/yyyy");

  if (componentProps.valueAsString) {
    emit("update:modelValue", dateToDbString(dv));
  } else {
    emit("update:modelValue", dv);
  }
};

/* máscara simples para dd/MM/yyyy */
function applyDateMask(value: string) {
  if (!value) return "";
  const numbers = value.replace(/\D/g, "").substring(0, 8);
  if (numbers.length >= 5)
    return `${numbers.substring(0, 2)}/${numbers.substring(
      2,
      4,
    )}/${numbers.substring(4)}`;
  if (numbers.length >= 3)
    return `${numbers.substring(0, 2)}/${numbers.substring(2)}`;
  return numbers;
}

/* ---------- drag logic ---------- */
const startPosition = {
  bottom: { left: 0, top: 0 },
  "bottom-left": { left: -150, top: 0 },
  top: { left: 0, top: -550 },
  "top-left": { left: -150, top: -550 },
  "center-left": { left: -350, top: -225 },
  "center-right": { left: 350, top: -225 },
};

/*
  | "bottom"
  | "top"
  | "bottom-left"
  | "top-left"
  | "center-left"
  | "center-right";
*/
const dragWrapper = ref<HTMLElement | null>(null);
const dragHandle = ref<HTMLElement | null>(null);

const pos = ref(startPosition[componentProps.position]);
watch(
  () => componentProps.position,
  (newPos) => {
    pos.value = { ...startPosition[newPos] };
  },
  { immediate: true },
);

const dragging = ref(false);
const start = ref({ x: 0, y: 0, left: 0, top: 0 });

const wrapperStyle = computed(
  (): CSSProperties => ({
    position: "fixed",
    left: `${pos.value.left}px`,
    top: `${pos.value.top}px`,
    zIndex: 3000,
    minWidth: "260px",
  }),
);

// inicializa posição quando o menu abre para evitar "salto"
watch(menu, async (open) => {
  if (open) {
    await nextTick();
    const el = dragWrapper.value;
    if (el) {
      const r = el.getBoundingClientRect();
      // se pos ainda não foi setada, use a posição atual do wrapper
      if (pos.value.left === 0 && pos.value.top === 0) {
        pos.value.left = Math.max(8, Math.round(r.left));
        pos.value.top = Math.max(8, Math.round(r.top));
      }
    }
  }
});

function startDrag(e: PointerEvent) {
  // garante que pos começa na posição atual do wrapper renderizado
  if (pos.value.left === 0 && pos.value.top === 0 && dragWrapper.value) {
    const r = dragWrapper.value.getBoundingClientRect();
    pos.value.left = Math.max(8, Math.round(r.left));
    pos.value.top = Math.max(8, Math.round(r.top));
  }

  dragging.value = true;
  const target = (e.currentTarget as HTMLElement) || (e.target as HTMLElement);
  try {
    target.setPointerCapture?.(e.pointerId);
  } catch {}
  start.value = {
    x: e.clientX,
    y: e.clientY,
    left: pos.value.left,
    top: pos.value.top,
  };

  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", stopDrag);
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return;

  const dx = e.clientX - start.value.x;
  const dy = e.clientY - start.value.y;
  const margin = 16;

  const el = dragWrapper.value;
  if (!el) return;

  const candidateLeft = start.value.left + dx;
  const candidateTop = start.value.top + dy;

  if (!(e.clientX <= margin || e.clientX >= window.innerWidth - margin)) {
    pos.value.left = candidateLeft;
  }
  if (!(e.clientY <= margin || e.clientY >= window.innerHeight - margin)) {
    pos.value.top = candidateTop;
  }
}

function stopDrag(e: PointerEvent) {
  dragging.value = false;
  try {
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  } catch {}
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", stopDrag);
}

function endPointer(e: PointerEvent) {
  // pequena proteção para soltar pointer caso usuário solte diretamente no botão
  try {
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  } catch {}
  dragging.value = false;
}

onBeforeUnmount(() => {
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", stopDrag);
});
</script>

<style scoped>
/* garante que o botão de arraste não capture eventos do picker */
[ref="dragHandle"] {
  touch-action: none;
}
</style>
