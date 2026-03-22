import { useState, useEffect } from "react";
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import HomePage from "./pages/HomePage";
import TrainersPage from "./pages/TrainersPage";
import TrainerProfile from "./pages/TrainerProfile";
import BecomeCoachPage from "./pages/BecomeCoachPage";
import DashboardPage from "./pages/DashboardPage";
import TrainerPricingPage from "./pages/TrainerPricingPage";
import TrainerSetupPage from "./pages/TrainerSetupPage";
import TrainerDashboard from "./pages/TrainerDashboard";
import PaymentCheckoutPage from "./pages/PaymentCheckoutPage";
import BookingModal from "./components/Modals/BookingModal";
import AuthModal from "./components/Modals/AuthModal";
import { supabase } from "./lib/supabase";

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [goalFilter, setGoalFilter] = useState("");
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);

  // Trainer-specific state
  const [trainerProfile, setTrainerProfile] = useState(null);
  const [trainerSubscription, setTrainerSubscription] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("free");

  const navTo = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Load trainer profile + subscription for the logged-in user
  const loadTrainerData = async (userId) => {
    if (!supabase || !userId) return;

    const [{ data: profile }, { data: subscription }] = await Promise.all([
      supabase.from("trainer_profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("trainer_subscriptions").select("*").eq("user_id", userId).maybeSingle(),
    ]);

    setTrainerProfile(profile || null);
    setTrainerSubscription(subscription || null);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // ── Handle Stripe subscription success redirect ──────────────────────────
    const subscriptionSuccess = params.get("subscription_success");
    const plan = params.get("plan");
    const stripeSessionId = params.get("session_id");

    if (subscriptionSuccess && plan) {
      window.history.replaceState({}, document.title, window.location.pathname);

      // Save the plan in state; upsert subscription after we have the user
      setSelectedPlan(plan);

      // We'll upsert the subscription once auth resolves (in the auth listener below)
      // Store pending plan in sessionStorage so auth listener can pick it up
      sessionStorage.setItem("pending_subscription_plan", plan);
      sessionStorage.setItem("pending_stripe_session", stripeSessionId || "");
    }

    // ── Handle Stripe booking success redirect ───────────────────────────────
    const bookingSuccess = params.get("booking_success");
    const payloadStr = params.get("booking_payload");

    if (bookingSuccess && payloadStr) {
      try {
        const payload = JSON.parse(decodeURIComponent(payloadStr));
        window.history.replaceState({}, document.title, window.location.pathname);
        handleBook({ ...payload, id: Date.now(), status: "Paid Confirmed" });
      } catch (e) {
        console.error("Booking payload error", e);
      }
    }

    // ── Handle ?page= cancel redirect from Stripe ────────────────────────────
    const pageParam = params.get("page");
    if (pageParam) {
      window.history.replaceState({}, document.title, window.location.pathname);
      navTo(pageParam);
    }

    // ── Fetch bookings for authenticated user ────────────────────────────────
    const fetchBookings = async (userEmail) => {
      if (supabase && userEmail) {
        const { data } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_email", userEmail)
          .order("created_at", { ascending: false });
        if (data) setBookings(data);
      }
    };

    // ── Auth listener ────────────────────────────────────────────────────────
    if (supabase) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u?.email) fetchBookings(u.email);
        if (u?.id) {
          await loadTrainerData(u.id);

          // Process any pending subscription (from Stripe redirect)
          const pendingPlan = sessionStorage.getItem("pending_subscription_plan");
          const pendingSession = sessionStorage.getItem("pending_stripe_session");
          if (pendingPlan) {
            sessionStorage.removeItem("pending_subscription_plan");
            sessionStorage.removeItem("pending_stripe_session");
            await upsertSubscription(u.id, pendingPlan, pendingSession);
          }
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u?.email) fetchBookings(u.email);
        else {
          setBookings([]);
          setTrainerProfile(null);
          setTrainerSubscription(null);
        }
        if (u?.id) {
          await loadTrainerData(u.id);

          // Process any pending subscription (from Stripe redirect)
          const pendingPlan = sessionStorage.getItem("pending_subscription_plan");
          const pendingSession = sessionStorage.getItem("pending_stripe_session");
          if (pendingPlan) {
            sessionStorage.removeItem("pending_subscription_plan");
            sessionStorage.removeItem("pending_stripe_session");
            await upsertSubscription(u.id, pendingPlan, pendingSession);
          }
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  // After successful Stripe subscription: upsert subscription record, then navigate
  const upsertSubscription = async (userId, plan, stripeSessionId) => {
    if (!supabase) return;

    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const { data: sub } = await supabase
      .from("trainer_subscriptions")
      .upsert([{
        user_id: userId,
        plan,
        status: "active",
        stripe_session_id: stripeSessionId,
        current_period_end: periodEnd.toISOString(),
        bookings_this_month: 0,
        booking_reset_date: new Date().toISOString().split("T")[0],
      }], { onConflict: "user_id" })
      .select()
      .single();

    if (sub) {
      setTrainerSubscription(sub);
      setSelectedPlan(plan);
    }

    // Navigate: setup if no profile yet, dashboard if profile exists
    const { data: profile } = await supabase
      .from("trainer_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    navTo(profile ? "trainer-dashboard" : "trainer-setup");
  };

  const handleBook = async (bookingData) => {
    if (supabase) {
      const { data, error } = await supabase.from("bookings").insert([bookingData]).select();
      if (error) {
        alert("Failed to confirm booking: " + error.message);
        return;
      }
      setBookings([data[0], ...bookings]);
    } else {
      setBookings([bookingData, ...bookings]);
    }
    setShowBooking(false);
    navTo("dashboard");
  };

  const handleProfileCreated = (profile) => {
    setTrainerProfile(profile);
  };

  const handleSubscriptionComplete = (sub) => {
    setTrainerSubscription(sub);
  };

  return (
    <div className="app-container">
      <Navbar
        page={page}
        setPage={navTo}
        setShowAuth={setShowAuth}
        hasBookings={user || bookings.length > 0}
        user={user}
        isTrainer={!!trainerProfile}
      />

      {page === "home" && (
        <HomePage setPage={navTo} setSelectedTrainer={setSelectedTrainer} setGoalFilter={setGoalFilter} />
      )}
      {page === "trainers" && (
        <TrainersPage
          setPage={navTo}
          setSelectedTrainer={setSelectedTrainer}
          goalFilter={goalFilter}
          setGoalFilter={setGoalFilter}
        />
      )}
      {page === "trainer-profile" && (
        <TrainerProfile trainer={selectedTrainer} setShowBooking={setShowBooking} />
      )}
      {page === "become-coach" && <BecomeCoachPage />}
      {page === "dashboard" && <DashboardPage bookings={bookings} navTo={navTo} />}

      {/* ── Trainer subscription & portal pages ── */}
      {page === "trainer-pricing" && (
        <TrainerPricingPage
          user={user}
          setShowAuth={setShowAuth}
          setPage={navTo}
          setSelectedPlan={setSelectedPlan}
          trainerSubscription={trainerSubscription}
        />
      )}
      {page === "trainer-setup" && (
        <TrainerSetupPage
          user={user}
          selectedPlan={selectedPlan}
          setPage={navTo}
          onProfileCreated={handleProfileCreated}
        />
      )}
      {page === "trainer-dashboard" && (
        <TrainerDashboard
          trainerProfile={trainerProfile}
          trainerSubscription={trainerSubscription}
          setPage={navTo}
        />
      )}
      {page === "payment-checkout" && (
        <PaymentCheckoutPage
          user={user}
          selectedPlan={selectedPlan}
          trainerProfile={trainerProfile}
          setPage={navTo}
          onSubscriptionComplete={handleSubscriptionComplete}
        />
      )}

      {showBooking && selectedTrainer && (
        <BookingModal
          trainer={selectedTrainer}
          onClose={() => setShowBooking(false)}
          onSubmit={handleBook}
        />
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <Footer />
    </div>
  );
}
