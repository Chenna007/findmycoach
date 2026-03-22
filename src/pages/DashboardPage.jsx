import React from 'react';
import Section from '../components/UI/Section';
import SectionTitle from '../components/UI/SectionTitle';
import GlassCard from '../components/UI/GlassCard';
import Badge from '../components/UI/Badge';
import Button from '../components/UI/Button';
import { downloadReceipt } from '../lib/pdfGenerator';

const DashboardPage = ({ bookings, navTo }) => {
  return (
    <div style={{ paddingTop: 96, minHeight: "100vh" }}>
      <Section>
        <SectionTitle sub="Dashboard" title="My Upcoming Sessions" />
        
        {bookings.length === 0 ? (
          <GlassCard style={{ padding: 60, textAlign: "center" }} hover={false}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>📅</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, marginBottom: 12 }}>No bookings yet</h3>
            <p style={{ fontSize: 16, color: "var(--text2)", marginBottom: 24 }}>You haven't requested any coaching sessions yet.</p>
            <Button variant="primary" size="lg" onClick={() => navTo("trainers")}>Browse Trainers</Button>
          </GlassCard>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {bookings.map((b) => (
              <GlassCard key={b.id} hover={false} style={{ padding: 24 }} className="slide-r">
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <img src={b.trainer.img} alt={b.trainer.name} style={{ width: 80, height: 80, borderRadius: 16, objectFit: "cover", border: "2px solid var(--border)" }} />
                    <div>
                      <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 4 }}>Booking ID: {b.id.toString().slice(-6)}</div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>{b.trainer.name}</h3>
                      <div style={{ fontSize: 14, color: "var(--accent)", fontWeight: 500, marginTop: 4 }}>{b.goal}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>📅</span>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>Date</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{b.date || "To be decided"}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>⏰</span>
                      <div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>Time</div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{b.time || "To be decided"}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                    <Badge variant={b.status === "Pending Confirmation" ? "default" : "accent"}>
                      {b.status}
                    </Badge>
                    <div style={{ fontSize: 18, fontFamily: "var(--font-display)", fontWeight: 800 }}>
                      {b.trainer.price} <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 400 }}>AED</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => downloadReceipt(b)}>
                      Download Invoice PDF
                    </Button>
                  </div>
                  
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
};

export default DashboardPage;
