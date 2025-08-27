export default function HeroSection() {
  return (
    <section
      className="relative w-full h-[75vh] flex items-center justify-center text-center bg-cover bg-center"
      style={{ backgroundImage: "url('\Banner.png')" }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 text-white max-w-2xl px-4">
        <h1 className="text-5xl font-bold mb-6">
          Estilo y calidad para tu hogar
        </h1>
        <button className="bg-[#8B5E3C] text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-[#6F452A] transition">
          Agenda tu cita
        </button>
      </div>
    </section>
  );
}