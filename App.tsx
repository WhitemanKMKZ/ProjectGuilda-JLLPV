import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "home" | "book" | "shop" | "cart";
type BookingStep = 1 | 2 | 3 | 4;
type WigCategory = "todas" | "lisas" | "cacheadas" | "crespas" | "coloridas";

interface CartItem {
  id: number;
  name: string;
  price: number;
  img: string;
  qty: number;
  type: "wig" | "service";
  detail?: string;
}

interface Wig {
  id: number;
  name: string;
  length: string;
  price: number;
  category: WigCategory;
  img: string;
  badge?: string;
}

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
  icon: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SERVICES: Service[] = [
  { id: 1, name: "Corte & Estilo",       duration: "60 min", price: 120, icon: "✂️" },
  { id: 2, name: "Coloração",            duration: "120 min", price: 250, icon: "🎨" },
  { id: 3, name: "Hidratação Profunda",  duration: "90 min",  price: 180, icon: "💧" },
  { id: 4, name: "Tranças",              duration: "180 min", price: 300, icon: "🌿" },
  { id: 5, name: "Aplicação de Peruca",  duration: "60 min",  price: 150, icon: "👑" },
  { id: 6, name: "Penteado",             duration: "45 min",  price: 90,  icon: "✨" },
];

const PROFESSIONALS = [
  { id: 1, name: "Camila Souza",   role: "Especialista em cor",    avatar: "CS" },
  { id: 2, name: "Renata Lima",    role: "Mestre em perucas",      avatar: "RL" },
  { id: 3, name: "Jéssica Moura", role: "Especialista em tranças", avatar: "JM" },
];

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

const UNAVAILABLE_SLOTS = ["09:00", "10:30", "14:00", "16:00"];

const WIGS: Wig[] = [
  { id: 1, name: "Ondas Naturais",       length: "60 cm", price: 890,  category: "cacheadas", img: "https://images.unsplash.com/photo-1663582816158-42354522fe15?w=400&h=500&fit=crop&auto=format", badge: "Mais vendida" },
  { id: 2, name: "Liso Sedoso",          length: "50 cm", price: 750,  category: "lisas",     img: "https://images.unsplash.com/photo-1663582816168-916ea1456edc?w=400&h=500&fit=crop&auto=format" },
  { id: 3, name: "Cachos Afro",          length: "30 cm", price: 680,  category: "crespas",   img: "https://images.unsplash.com/photo-1664293272875-2cfa64e687c7?w=400&h=500&fit=crop&auto=format", badge: "Novidade" },
  { id: 4, name: "Comprida Premium",     length: "80 cm", price: 1200, category: "lisas",     img: "https://images.unsplash.com/photo-1663582816260-ea903f9441eb?w=400&h=500&fit=crop&auto=format", badge: "Premium" },
  { id: 5, name: "Ruiva Intensa",        length: "45 cm", price: 980,  category: "coloridas", img: "https://images.unsplash.com/photo-1663582815337-52558dc2f9fd?w=400&h=500&fit=crop&auto=format" },
  { id: 6, name: "Crespo Volumoso",      length: "25 cm", price: 620,  category: "crespas",   img: "https://images.unsplash.com/photo-1737510087712-bf804b2cdd36?w=400&h=500&fit=crop&auto=format", badge: "Promoção" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTHS_PT = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAYS_PT = ["D","S","T","Q","Q","S","S"];

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState<Tab>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wigCategory, setWigCategory] = useState<WigCategory>("todas");
  const [bookingStep, setBookingStep] = useState<BookingStep>(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPro, setSelectedPro] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [bookingDone, setBookingDone] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const filteredWigs = useMemo(() =>
    wigCategory === "todas" ? WIGS : WIGS.filter((w) => w.category === wigCategory),
    [wigCategory]
  );

  function addToCart(item: Omit<CartItem, "qty">) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id && c.type === item.type);
      if (existing) return prev.map((c) => c.id === item.id && c.type === item.type ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
    showNotification("Adicionado ao carrinho ✓");
  }

  function removeFromCart(id: number, type: string) {
    setCart((prev) => prev.filter((c) => !(c.id === id && c.type === type)));
  }

  function changeQty(id: number, type: string, delta: number) {
    setCart((prev) =>
      prev.map((c) => {
        if (c.id === id && c.type === type) {
          const newQty = c.qty + delta;
          return newQty <= 0 ? null : { ...c, qty: newQty };
        }
        return c;
      }).filter(Boolean) as CartItem[]
    );
  }

  function showNotification(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  }

  function confirmBooking() {
    if (selectedService) {
      addToCart({
        id: Date.now(),
        name: selectedService.name,
        price: selectedService.price,
        img: "",
        type: "service",
        detail: `${PROFESSIONALS.find((p) => p.id === selectedPro)?.name ?? ""} · ${MONTHS_PT[calMonth].slice(0,3)} ${selectedDate} às ${selectedTime}`,
      });
      setBookingDone(true);
    }
  }

  function resetBooking() {
    setBookingStep(1); setSelectedService(null); setSelectedPro(null);
    setSelectedDate(null); setSelectedTime(null); setBookingDone(false);
  }

  const today = new Date().getDate();
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--color-cream)", fontFamily: "var(--font-sans)", position: "relative" }}>

      {/* Notification toast */}
      {notification && (
        <div style={{
          position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)",
          background: "var(--color-deep)", color: "white", padding: "10px 20px",
          borderRadius: 100, fontSize: 13, fontWeight: 500, zIndex: 9999,
          animation: "fadeIn 0.2s ease",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}>
          {notification}
        </div>
      )}

      {/* Header */}
      <header style={{
        background: "var(--color-deep)", padding: "14px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--color-gold)", fontStyle: "italic", lineHeight: 1 }}>
            Lumora
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em", marginTop: 2 }}>
            SALÃO DE BELEZA
          </div>
        </div>
        <button
          onClick={() => setTab("cart")}
          style={{ position: "relative", background: "transparent", border: "none", cursor: "pointer", padding: 6 }}
        >
          <CartIcon />
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: 0, right: 0,
              background: "var(--color-gold)", color: "var(--color-deep)",
              fontSize: 10, fontWeight: 700, borderRadius: 100,
              width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </header>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        {tab === "home" && <HomeTab setTab={setTab} addToCart={addToCart} />}
        {tab === "book" && (
          <BookTab
            step={bookingStep} setStep={setBookingStep}
            selectedService={selectedService} setSelectedService={setSelectedService}
            selectedPro={selectedPro} setSelectedPro={setSelectedPro}
            selectedDate={selectedDate} setSelectedDate={setSelectedDate}
            selectedTime={selectedTime} setSelectedTime={setSelectedTime}
            calMonth={calMonth} calYear={calYear}
            setCalMonth={setCalMonth} setCalYear={setCalYear}
            today={today} todayMonth={todayMonth} todayYear={todayYear}
            confirmBooking={confirmBooking}
            bookingDone={bookingDone} resetBooking={resetBooking}
          />
        )}
        {tab === "shop" && (
          <ShopTab
            wigs={filteredWigs} category={wigCategory}
            setCategory={setWigCategory} addToCart={addToCart}
          />
        )}
        {tab === "cart" && (
          <CartTab
            cart={cart} total={cartTotal}
            removeFromCart={removeFromCart} changeQty={changeQty}
            setTab={setTab}
          />
        )}
      </div>

      {/* Bottom Nav */}
      <nav style={{
        background: "var(--color-surface)", borderTop: "1px solid var(--color-border)",
        display: "flex", flexShrink: 0,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {([
          { id: "home", label: "Início",    Icon: HomeIcon },
          { id: "book", label: "Agendar",   Icon: CalIcon },
          { id: "shop", label: "Perucas",   Icon: ShopIcon },
          { id: "cart", label: "Carrinho",  Icon: CartIcon },
        ] as const).map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              flex: 1, border: "none", background: "transparent",
              padding: "10px 0 8px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              color: tab === id ? "var(--color-gold)" : "var(--color-muted)",
              transition: "color 0.15s",
            }}
          >
            <Icon active={tab === id} />
            <span style={{ fontSize: 10, fontWeight: tab === id ? 600 : 400, letterSpacing: "0.02em" }}>
              {label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────
function HomeTab({ setTab, addToCart }: { setTab: (t: Tab) => void; addToCart: (i: Omit<CartItem,"qty">) => void }) {
  const featured = WIGS.slice(0, 3);
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: "var(--color-deep)",
        padding: "32px 20px 40px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.15,
          backgroundImage: `url(https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=600&h=300&fit=crop&auto=format)`,
          backgroundSize: "cover", backgroundPosition: "center",
        }} />
        <div style={{ position: "relative" }}>
          <p style={{ color: "var(--color-gold)", fontSize: 12, letterSpacing: "0.15em", marginBottom: 8 }}>
            BEM-VINDA DE VOLTA
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: 28, lineHeight: 1.2, margin: "0 0 8px" }}>
            Sua beleza,<br />
            <em style={{ color: "var(--color-gold)" }}>nossa arte.</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
            Agende seu horário ou encontre a peruca perfeita para você.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setTab("book")}
              style={{
                background: "var(--color-gold)", color: "var(--color-deep)",
                border: "none", borderRadius: 100, padding: "12px 20px",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}
            >
              Agendar Horário
            </button>
            <button
              onClick={() => setTab("shop")}
              style={{
                background: "transparent", color: "white",
                border: "1px solid rgba(255,255,255,0.3)", borderRadius: 100,
                padding: "12px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer",
              }}
            >
              Ver Perucas
            </button>
          </div>
        </div>
      </div>

      {/* Quick Services */}
      <div style={{ padding: "24px 20px 0" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, margin: "0 0 16px" }}>Nossos Serviços</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {SERVICES.slice(0, 6).map((s) => (
            <button
              key={s.id}
              onClick={() => setTab("book")}
              style={{
                background: "var(--color-surface)", border: "1px solid var(--color-border)",
                borderRadius: 16, padding: "14px 10px", cursor: "pointer",
                textAlign: "center", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-gold)"; e.currentTarget.style.background = "var(--color-gold-light)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.background = "var(--color-surface)"; }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: "var(--color-deep)", lineHeight: 1.3 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: "var(--color-gold)", marginTop: 2, fontWeight: 500 }}>{fmt(s.price)}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Wigs */}
      <div style={{ padding: "28px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, margin: 0 }}>Perucas em Destaque</h3>
          <button onClick={() => setTab("shop")} style={{ background: "none", border: "none", color: "var(--color-gold)", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
            Ver todas →
          </button>
        </div>
        <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4 }}>
          {featured.map((w) => (
            <WigCard key={w.id} wig={w} onAdd={addToCart} compact />
          ))}
        </div>
      </div>

      {/* Promo banner */}
      <div style={{ margin: "0 20px 32px", background: "var(--color-gold-light)", border: "1px solid var(--color-gold-border)", borderRadius: 20, padding: "20px" }}>
        <p style={{ fontSize: 11, color: "var(--color-gold)", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 4 }}>PROMOÇÃO DA SEMANA</p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--color-deep)", margin: "0 0 6px" }}>
          20% off em <em>Hidratação Profunda</em>
        </p>
        <p style={{ fontSize: 13, color: "var(--color-muted)", margin: "0 0 14px" }}>Válido até domingo. Aproveite!</p>
        <button
          onClick={() => setTab("book")}
          style={{ background: "var(--color-gold)", color: "white", border: "none", borderRadius: 100, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          Aproveitar Oferta
        </button>
      </div>
    </div>
  );
}

// ─── Book Tab ─────────────────────────────────────────────────────────────────
function BookTab({
  step, setStep, selectedService, setSelectedService,
  selectedPro, setSelectedPro, selectedDate, setSelectedDate,
  selectedTime, setSelectedTime, calMonth, calYear,
  setCalMonth, setCalYear, today, todayMonth, todayYear,
  confirmBooking, bookingDone, resetBooking,
}: any) {

  if (bookingDone) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "0 0 12px" }}>Agendado!</h2>
        <p style={{ color: "var(--color-muted)", fontSize: 15, lineHeight: 1.6, marginBottom: 8 }}>
          <strong style={{ color: "var(--color-deep)" }}>{selectedService?.name}</strong>
        </p>
        <p style={{ color: "var(--color-muted)", fontSize: 14, marginBottom: 32 }}>
          {PROFESSIONALS.find((p) => p.id === selectedPro)?.name} · {MONTHS_PT[calMonth].slice(0,3)} {selectedDate} às {selectedTime}
        </p>
        <div style={{ background: "var(--color-gold-light)", border: "1px solid var(--color-gold-border)", borderRadius: 16, padding: "16px 20px", marginBottom: 32, width: "100%" }}>
          <p style={{ fontSize: 13, color: "var(--color-muted)", margin: "0 0 4px" }}>Total reservado</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--color-gold)", margin: 0 }}>{fmt(selectedService?.price ?? 0)}</p>
        </div>
        <button
          onClick={resetBooking}
          style={{ background: "var(--color-deep)", color: "white", border: "none", borderRadius: 100, padding: "14px 32px", fontSize: 15, fontWeight: 500, cursor: "pointer" }}
        >
          Novo Agendamento
        </button>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const isCurrentMonth = calMonth === todayMonth && calYear === todayYear;

  const canAdvance = step === 1 ? !!selectedService
    : step === 2 ? !!selectedPro
    : step === 3 ? (!!selectedDate && !!selectedTime)
    : false;

  return (
    <div style={{ padding: "0 0 24px" }}>
      {/* Progress */}
      <div style={{ padding: "16px 20px 0", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "0 0 16px" }}>Agendar Horário</h2>
        <div style={{ display: "flex", gap: 0 }}>
          {["Serviço", "Profissional", "Data & Hora", "Confirmar"].map((label, i) => {
            const s = i + 1;
            const active = step === s;
            const done = step > s;
            return (
              <div key={label} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                {i < 3 && (
                  <div style={{
                    position: "absolute", top: 11, left: "50%", width: "100%", height: 2,
                    background: done ? "var(--color-gold)" : "var(--color-border)",
                    zIndex: 0,
                  }} />
                )}
                <div style={{
                  width: 24, height: 24, borderRadius: 100,
                  background: done ? "var(--color-gold)" : active ? "var(--color-deep)" : "var(--color-border)",
                  color: done || active ? "white" : "var(--color-muted)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, position: "relative", zIndex: 1, marginBottom: 4,
                }}>
                  {done ? "✓" : s}
                </div>
                <div style={{ fontSize: 10, color: active ? "var(--color-deep)" : "var(--color-muted)", fontWeight: active ? 600 : 400 }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ height: 16 }} />
      </div>

      <div style={{ padding: "20px" }}>
        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Escolha o serviço</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SERVICES.map((s) => {
                const sel = selectedService?.id === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s)}
                    style={{
                      background: sel ? "var(--color-gold-light)" : "var(--color-surface)",
                      border: `${sel ? 2 : 1}px solid ${sel ? "var(--color-gold)" : "var(--color-border)"}`,
                      borderRadius: 16, padding: "14px 16px",
                      display: "flex", alignItems: "center", gap: 14,
                      cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{s.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-deep)", marginBottom: 2 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: "var(--color-muted)" }}>{s.duration}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: sel ? "var(--color-gold)" : "var(--color-deep)" }}>{fmt(s.price)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Professional */}
        {step === 2 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Escolha a profissional</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PROFESSIONALS.map((p) => {
                const sel = selectedPro === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPro(p.id)}
                    style={{
                      background: sel ? "var(--color-gold-light)" : "var(--color-surface)",
                      border: `${sel ? 2 : 1}px solid ${sel ? "var(--color-gold)" : "var(--color-border)"}`,
                      borderRadius: 16, padding: "16px", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: sel ? "var(--color-gold)" : "var(--color-deep)",
                      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700, flexShrink: 0,
                    }}>
                      {p.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--color-deep)" }}>{p.name}</div>
                      <div style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 2 }}>{p.role}</div>
                      <div style={{ fontSize: 11, color: "var(--color-gold)", marginTop: 4, fontWeight: 500 }}>⭐ 4.9 · 120 atendimentos</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <div>
            {/* Calendar */}
            <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 20, padding: "16px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-muted)", fontSize: 16 }}>‹</button>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500 }}>
                  {MONTHS_PT[calMonth]} {calYear}
                </span>
                <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--color-muted)", fontSize: 16 }}>›</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, textAlign: "center" }}>
                {DAYS_PT.map((d, i) => (
                  <div key={i} style={{ fontSize: 11, color: "var(--color-muted)", padding: "4px 0", fontWeight: 600 }}>{d}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isPast = isCurrentMonth && day < today;
                  const isSel = selectedDate === day;
                  const isToday = isCurrentMonth && day === today;
                  const isSunday = new Date(calYear, calMonth, day).getDay() === 0;
                  const disabled = isPast || isSunday;
                  return (
                    <button
                      key={day}
                      disabled={disabled}
                      onClick={() => { setSelectedDate(day); setSelectedTime(null); }}
                      style={{
                        border: isSel ? "2px solid var(--color-gold)" : isToday ? "1px solid var(--color-gold)" : "1px solid transparent",
                        borderRadius: 100, padding: "6px 0", fontSize: 13, cursor: disabled ? "default" : "pointer",
                        background: isSel ? "var(--color-gold)" : "transparent",
                        color: isSel ? "white" : disabled ? "var(--color-border)" : "var(--color-deep)",
                        fontWeight: isToday ? 700 : 400,
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "var(--color-muted)" }}>
                  Horários disponíveis — {selectedDate} de {MONTHS_PT[calMonth]}
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                  {TIME_SLOTS.map((t) => {
                    const unavail = UNAVAILABLE_SLOTS.includes(t);
                    const sel = selectedTime === t;
                    return (
                      <button
                        key={t}
                        disabled={unavail}
                        onClick={() => setSelectedTime(t)}
                        style={{
                          padding: "10px 0", borderRadius: 10, fontSize: 13, fontWeight: 500,
                          cursor: unavail ? "default" : "pointer",
                          border: sel ? "2px solid var(--color-gold)" : "1px solid var(--color-border)",
                          background: sel ? "var(--color-gold)" : unavail ? "var(--color-cream-dark)" : "var(--color-surface)",
                          color: sel ? "white" : unavail ? "var(--color-border)" : "var(--color-deep)",
                          textDecoration: unavail ? "line-through" : "none",
                        }}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Confirmar Agendamento</h3>
            {[
              { label: "Serviço",        value: selectedService?.name },
              { label: "Duração",        value: selectedService?.duration },
              { label: "Profissional",   value: PROFESSIONALS.find((p) => p.id === selectedPro)?.name },
              { label: "Data",           value: `${selectedDate} de ${MONTHS_PT[calMonth]} de ${calYear}` },
              { label: "Horário",        value: selectedTime },
            ].map((r) => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--color-border)" }}>
                <span style={{ fontSize: 14, color: "var(--color-muted)" }}>{r.label}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-deep)" }}>{r.value}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", marginTop: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--color-gold)" }}>{fmt(selectedService?.price ?? 0)}</span>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          {step > 1 && (
            <button
              onClick={() => setStep((step - 1) as BookingStep)}
              style={{ flex: 1, padding: "14px", borderRadius: 100, border: "1px solid var(--color-border)", background: "transparent", fontSize: 15, cursor: "pointer", color: "var(--color-deep)", fontWeight: 500 }}
            >
              Voltar
            </button>
          )}
          <button
            disabled={!canAdvance}
            onClick={() => { if (step < 4) setStep((step + 1) as BookingStep); else confirmBooking(); }}
            style={{
              flex: 2, padding: "14px", borderRadius: 100, border: "none",
              background: canAdvance ? "var(--color-deep)" : "var(--color-border)",
              color: canAdvance ? "white" : "var(--color-muted)",
              fontSize: 15, fontWeight: 600, cursor: canAdvance ? "pointer" : "default",
              transition: "all 0.15s",
            }}
          >
            {step === 4 ? "Confirmar Agendamento" : "Continuar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shop Tab ─────────────────────────────────────────────────────────────────
const CAT_LABELS: Record<WigCategory, string> = {
  todas: "Todas", lisas: "Lisas", cacheadas: "Cacheadas", crespas: "Crespas", coloridas: "Coloridas",
};

function ShopTab({ wigs, category, setCategory, addToCart }: {
  wigs: Wig[]; category: WigCategory;
  setCategory: (c: WigCategory) => void; addToCart: (i: Omit<CartItem,"qty">) => void;
}) {
  return (
    <div>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "0 0 16px" }}>Perucas Naturais</h2>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16 }}>
          {(Object.keys(CAT_LABELS) as WigCategory[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                padding: "7px 14px", borderRadius: 100, fontSize: 13, fontWeight: 500,
                border: category === c ? "none" : "1px solid var(--color-border)",
                background: category === c ? "var(--color-deep)" : "transparent",
                color: category === c ? "white" : "var(--color-muted)",
                cursor: "pointer", flexShrink: 0, transition: "all 0.15s",
              }}
            >
              {CAT_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ padding: "16px 12px 32px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {wigs.map((w) => <WigCard key={w.id} wig={w} onAdd={addToCart} />)}
      </div>
    </div>
  );
}

// ─── Wig Card ─────────────────────────────────────────────────────────────────
function WigCard({ wig, onAdd, compact }: { wig: Wig; onAdd: (i: Omit<CartItem,"qty">) => void; compact?: boolean }) {
  return (
    <div style={{
      background: "var(--color-surface)", borderRadius: 20,
      border: "1px solid var(--color-border)", overflow: "hidden",
      flexShrink: compact ? 0 : undefined,
      width: compact ? 160 : undefined,
      transition: "box-shadow 0.15s",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ position: "relative", background: "var(--color-cream-dark)", aspectRatio: compact ? "4/5" : "3/4", overflow: "hidden" }}>
        <img
          src={wig.img} alt={wig.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {wig.badge && (
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: wig.badge === "Premium" ? "var(--color-deep)" : wig.badge === "Promoção" ? "var(--color-rose)" : "var(--color-gold)",
            color: "white", fontSize: 10, fontWeight: 700,
            padding: "3px 8px", borderRadius: 100, letterSpacing: "0.04em",
          }}>
            {wig.badge}
          </span>
        )}
      </div>
      <div style={{ padding: compact ? "10px 12px 12px" : "12px 14px 14px" }}>
        <div style={{ fontSize: compact ? 12 : 14, fontWeight: 600, color: "var(--color-deep)", marginBottom: 2, lineHeight: 1.3 }}>{wig.name}</div>
        <div style={{ fontSize: 11, color: "var(--color-muted)", marginBottom: 8 }}>{wig.length}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: compact ? 14 : 16, color: "var(--color-gold)", fontWeight: 600 }}>{fmt(wig.price)}</span>
          <button
            onClick={() => onAdd({ id: wig.id, name: wig.name, price: wig.price, img: wig.img, type: "wig", detail: wig.length })}
            style={{
              background: "var(--color-deep)", color: "white", border: "none",
              borderRadius: 100, width: compact ? 28 : 32, height: compact ? 28 : 32,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-deep)")}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Tab ─────────────────────────────────────────────────────────────────
function CartTab({ cart, total, removeFromCart, changeQty, setTab }: {
  cart: CartItem[]; total: number;
  removeFromCart: (id: number, type: string) => void;
  changeQty: (id: number, type: string, delta: number) => void;
  setTab: (t: Tab) => void;
}) {
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🛍️</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "0 0 12px" }}>Pedido Confirmado!</h2>
        <p style={{ color: "var(--color-muted)", fontSize: 14, lineHeight: 1.6, marginBottom: 32 }}>
          Seu pedido foi recebido. Entraremos em contato em breve para confirmar a entrega.
        </p>
        <button onClick={() => { setDone(false); setTab("home"); }}
          style={{ background: "var(--color-deep)", color: "white", border: "none", borderRadius: 100, padding: "14px 32px", fontSize: 15, cursor: "pointer" }}>
          Voltar ao início
        </button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "0 0 8px" }}>Carrinho vazio</h3>
        <p style={{ color: "var(--color-muted)", fontSize: 14, marginBottom: 24 }}>Adicione perucas ou serviços para continuar.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setTab("shop")} style={{ background: "var(--color-deep)", color: "white", border: "none", borderRadius: 100, padding: "12px 20px", fontSize: 14, cursor: "pointer" }}>Ver Perucas</button>
          <button onClick={() => setTab("book")} style={{ background: "transparent", color: "var(--color-deep)", border: "1px solid var(--color-border)", borderRadius: 100, padding: "12px 20px", fontSize: 14, cursor: "pointer" }}>Agendar Serviço</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "20px 20px 0" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "0 0 20px" }}>Meu Carrinho</h2>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
        {cart.map((item) => (
          <div key={`${item.type}-${item.id}`} style={{
            background: "var(--color-surface)", border: "1px solid var(--color-border)",
            borderRadius: 16, padding: "12px 14px", marginBottom: 10,
            display: "flex", gap: 12, alignItems: "center",
          }}>
            {item.type === "wig" ? (
              <div style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden", background: "var(--color-cream-dark)", flexShrink: 0 }}>
                <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--color-gold-light)", border: "1px solid var(--color-gold-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                ✂️
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-deep)", marginBottom: 2 }}>{item.name}</div>
              {item.detail && <div style={{ fontSize: 11, color: "var(--color-muted)" }}>{item.detail}</div>}
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-gold)", marginTop: 4 }}>{fmt(item.price)}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
              {item.type === "wig" && (
                <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid var(--color-border)", borderRadius: 100, overflow: "hidden" }}>
                  <button onClick={() => changeQty(item.id, item.type, -1)} style={{ width: 26, height: 26, border: "none", background: "none", cursor: "pointer", fontSize: 14, color: "var(--color-muted)" }}>−</button>
                  <span style={{ fontSize: 13, fontWeight: 600, padding: "0 4px", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => changeQty(item.id, item.type, 1)} style={{ width: 26, height: 26, border: "none", background: "none", cursor: "pointer", fontSize: 14, color: "var(--color-muted)" }}>+</button>
                </div>
              )}
              <button onClick={() => removeFromCart(item.id, item.type)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-rose)", fontSize: 12, fontWeight: 500 }}>
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ padding: "16px 20px 20px", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 14, color: "var(--color-muted)" }}>Subtotal</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{fmt(total)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--color-border)" }}>
          <span style={{ fontSize: 14, color: "var(--color-muted)" }}>Entrega</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-gold)" }}>Grátis</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Total</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--color-gold)", fontWeight: 600 }}>{fmt(total)}</span>
        </div>
        <button
          onClick={() => { setChecking(true); setTimeout(() => { setChecking(false); setDone(true); }, 1500); }}
          disabled={checking}
          style={{
            width: "100%", padding: "15px", borderRadius: 100, border: "none",
            background: checking ? "var(--color-gold)" : "var(--color-deep)",
            color: "white", fontSize: 15, fontWeight: 600, cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {checking ? "Processando..." : "Finalizar Pedido"}
        </button>
      </div>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function HomeIcon({ active = false }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
        stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} opacity={active ? 0.15 : 1} />
      <path d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
        stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M7.5 18v-5h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CalIcon({ active = false }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.1 : 0} />
      <path d="M7 2v3M13 2v3M3 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="7" cy="12" r="1" fill="currentColor" />
      <circle cx="10" cy="12" r="1" fill="currentColor" />
      <circle cx="13" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function ShopIcon({ active = false }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6 9V6a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="2" y="9" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.1 : 0} />
    </svg>
  );
}

function CartIcon({ active = false }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2 3h2l2.5 9h9L18 6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="16" r="1.5" fill="currentColor" />
      <circle cx="15" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}
