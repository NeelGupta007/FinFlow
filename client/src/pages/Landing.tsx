import { Link } from "wouter";
import { ArrowRight, PieChart, Sparkles, ShieldCheck } from "lucide-react";

const heroImg = "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZpbmFuY2V8ZW58MHx8MHx8fDA%3D";

// Stock image note: Finance/Money abstract concept

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">SmartSpend</span>
          </div>
          <a
            href="/api/login"
            className="px-5 py-2.5 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition-opacity text-sm"
          >
            Log In
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] tracking-tight">
              Master your money with <span className="text-primary">AI magic.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto md:mx-0 leading-relaxed">
              Track expenses effortlessly. Just paste your receipts or texts, and let our AI categorize everything instantly.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <a
                href="/api/login"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow-xl shadow-primary/25 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </a>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-border text-foreground font-semibold hover:bg-muted transition-colors">
                View Demo
              </button>
            </div>
            
            <div className="pt-8 flex items-center justify-center md:justify-start gap-8 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>Bank-grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span>AI Powered</span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md md:max-w-full">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 rotate-3 hover:rotate-0 transition-transform duration-500">
              {/* Unsplash image: Person checking phone finance app */}
              <img src={heroImg} alt="App Dashboard" className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="font-bold text-lg">Smart Analysis</p>
                  <p className="text-white/80 text-sm">See where every penny goes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Why choose SmartSpend?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We ditched the complex spreadsheets for a clean, intelligent interface that does the heavy lifting for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI Parsing",
                desc: "Paste text from anywhere. We extract date, amount, and category instantly."
              },
              {
                icon: PieChart,
                title: "Visual Insights",
                desc: "Beautiful charts help you understand your spending habits at a glance."
              },
              {
                icon: ShieldCheck,
                title: "Secure & Private",
                desc: "Your financial data is encrypted and never shared with third parties."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-background p-8 rounded-2xl border hover:border-primary/50 transition-colors shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
