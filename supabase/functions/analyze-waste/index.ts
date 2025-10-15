import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, content } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY tidak dikonfigurasi");
    }

    const systemPrompt = `Kamu adalah asisten AI bernama IlmiGreen yang ahli dalam mengenali dan mengklasifikasikan sampah.
Tugasmu adalah menganalisis ${type === "image" ? "gambar" : "deskripsi"} sampah dan memberikan:
1. Jenis sampah: Organik, Anorganik, atau B3 (Bahan Berbahaya dan Beracun)
2. Penjelasan singkat tentang jenis sampah tersebut
3. Tips pengelolaan atau cara daur ulang yang praktis

Format responmu dalam JSON dengan struktur:
{
  "jenis": "Organik/Anorganik/B3",
  "penjelasan": "penjelasan singkat",
  "tips": "tips pengelolaan atau daur ulang"
}

Berikan jawaban dalam Bahasa Indonesia yang ramah dan edukatif.`;

    let messages;
    if (type === "image") {
      // Analisis gambar
      messages = [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            { type: "text", text: "Analisis gambar sampah ini dan identifikasi jenisnya." },
            { type: "image_url", image_url: { url: content } }
          ]
        }
      ];
    } else {
      // Analisis teks
      messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Analisis sampah berikut: ${content}` }
      ];
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Terlalu banyak permintaan, coba lagi nanti." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Kredit habis, silakan tambahkan kredit di workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Terjadi kesalahan pada AI gateway" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
