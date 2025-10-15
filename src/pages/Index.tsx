import { Leaf, Recycle, Shield } from "lucide-react";
import { WasteAnalyzer } from "@/components/WasteAnalyzer";
import { Chatbot } from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="w-full border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-[var(--shadow-soft)]">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  IlmiGreen
                </h1>
                <p className="text-xs text-muted-foreground">AI untuk Bumi yang Lebih Hijau</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Kenali Sampahmu,{" "}
            <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
              Selamatkan Bumi
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gunakan kekuatan AI untuk mengidentifikasi jenis sampah dan belajar cara mengelolanya dengan benar.
            Mari bersama wujudkan lingkungan yang lebih hijau!
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <div className="p-6 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-shadow">
              <Recycle className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Organik</h3>
              <p className="text-sm text-muted-foreground">
                Sisa makanan, daun, dan bahan alami yang bisa dikompos
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-shadow">
              <Leaf className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="font-semibold mb-2">Anorganik</h3>
              <p className="text-sm text-muted-foreground">
                Plastik, kertas, dan logam yang bisa didaur ulang
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-glow)] transition-shadow">
              <Shield className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h3 className="font-semibold mb-2">B3</h3>
              <p className="text-sm text-muted-foreground">
                Bahan berbahaya yang perlu penanganan khusus
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Analyzer Section */}
      <section className="container mx-auto px-4 pb-16">
        <WasteAnalyzer />
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-border/50 bg-card/80 backdrop-blur-sm py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            IlmiGreen — Bersama AI, Wujudkan Bumi yang Lebih Hijau 🌱
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Dibuat untuk Hackathon VibeCoding 2025
          </p>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Index;
