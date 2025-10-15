import { useState } from "react";
import { Upload, FileText, Loader2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface AnalysisResult {
  jenis: string;
  penjelasan: string;
  tips: string;
}

export const WasteAnalyzer = () => {
  const [analysisType, setAnalysisType] = useState<"image" | "text">("image");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file terlalu besar! Maksimal 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (analysisType === "image" && !imagePreview) {
      toast.error("Silakan upload gambar terlebih dahulu");
      return;
    }
    if (analysisType === "text" && !textInput.trim()) {
      toast.error("Silakan masukkan deskripsi sampah");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-waste`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            type: analysisType,
            content: analysisType === "image" ? imagePreview : textInput,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal menganalisis");
      }

      const data = await response.json();
      setResult(data);
      toast.success("Analisis berhasil!");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const getWasteIcon = (jenis: string) => {
    if (jenis.toLowerCase().includes("organik")) return "🌿";
    if (jenis.toLowerCase().includes("anorganik")) return "♻️";
    if (jenis.toLowerCase().includes("b3")) return "⚠️";
    return "🗑️";
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <Card className="p-6 md:p-8 shadow-[var(--shadow-soft)] border-border/50 bg-card/80 backdrop-blur-sm">
        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={analysisType === "image" ? "default" : "outline"}
            onClick={() => setAnalysisType("image")}
            className="flex-1 min-w-0"
          >
            <Upload className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Upload Gambar</span>
          </Button>
          <Button
            variant={analysisType === "text" ? "default" : "outline"}
            onClick={() => setAnalysisType("text")}
            className="flex-1 min-w-0"
          >
            <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">Tulis Deskripsi</span>
          </Button>
        </div>

        {/* Input Area */}
        {analysisType === "image" ? (
          <div className="space-y-4">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG (Maks. 5MB)</p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        ) : (
          <Textarea
            placeholder="Contoh: Sisa kulit pisang, botol plastik bekas, atau baterai bekas..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="min-h-[200px] resize-none"
          />
        )}

        {/* Analyze Button */}
        <Button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-primary to-primary-light hover:shadow-[var(--shadow-glow)] transition-all"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Menganalisis...
            </>
          ) : (
            <>
              <Leaf className="w-5 h-5 mr-2" />
              Deteksi Sampah
            </>
          )}
        </Button>

        {/* Result Display */}
        {result && (
          <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/20">
              <span className="text-4xl">{getWasteIcon(result.jenis)}</span>
              <div>
                <p className="text-sm text-muted-foreground">Jenis Sampah</p>
                <p className="text-xl font-bold text-primary">{result.jenis}</p>
              </div>
            </div>

            <Card className="p-4 bg-muted/30">
              <h3 className="font-semibold mb-2 text-foreground">Penjelasan</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.penjelasan}</p>
            </Card>

            <Card className="p-4 bg-accent/10 border border-accent/20">
              <h3 className="font-semibold mb-2 text-foreground flex items-center gap-2">
                💡 Tips Pengelolaan
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.tips}</p>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};
