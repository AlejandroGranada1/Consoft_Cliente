import { Paintbrush, Ruler, Home, Wrench } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="relative bg-[#fff9f4] py-16">
      {/* Título */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">
          ¿Qué ofrecemos?
        </h2>
      </div>

      {/* Contenedor con grid */}
      <div className="relative grid grid-cols-2 gap-30 max-w-6xl mx-auto px-6">
        {/* Arriba izquierda */}
        <div className="bg-yellow-100 rounded-2xl shadow-md p-6 flex flex-col items-start">
          <Ruler className="text-yellow-600 w-6 h-6 mb-2" />
          <h3 className="font-bold text-lg text-gray-800">
            Diseño Personalizado
          </h3>
          <p className="text-gray-600 text-sm">
            Creamos muebles a medida que se adaptan a tu estilo y espacio.
          </p>
        </div>

        {/* Arriba derecha */}
        <div className="bg-yellow-100 rounded-2xl shadow-md p-6 flex flex-col items-start">
          <Home className="text-yellow-600 w-6 h-6 mb-2" />
          <h3 className="font-bold text-lg text-gray-800">
            Revisión a Domicilio
          </h3>
          <p className="text-gray-600 text-sm">
            Vamos y revisamos tu producto en tu hogar.
          </p>
        </div>

        {/* Abajo izquierda */}
        <div className="bg-yellow-100 rounded-2xl shadow-md p-6 flex flex-col items-start">
          <Paintbrush className="text-yellow-600 w-6 h-6 mb-2" />
          <h3 className="font-bold text-lg text-gray-800">
            Lacado y Pintura
          </h3>
          <p className="text-gray-600 text-sm">
            Dale un nuevo acabado a tus muebles con técnicas profesionales.
          </p>
        </div>

        {/* Abajo derecha */}
        <div className="bg-yellow-100 rounded-2xl shadow-md p-6 flex flex-col items-start">
          <Wrench className="text-yellow-600 w-6 h-6 mb-2" />
          <h3 className="font-bold text-lg text-gray-800">Restauración</h3>
          <p className="text-gray-600 text-sm">
            Reparamos y devolvemos la vida a piezas antiguas o dañadas.
          </p>
        </div>
      </div>

      {/* Imagen central */}
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none mt-17.5">
        <img
          src="/SillaLanding.png"
          alt="Silla"
          className="w-40 md:w-52 lg:w-64 object-contain drop-shadow-lg"
        />
      </div>
    </section>
  );
}