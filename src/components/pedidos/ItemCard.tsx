import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function ItemCard({ prod, imagenes: adminImagenes }: any) {
    // Prioridad de imágenes: 
    // 1. Imagen específica del item (imageUrl)
    // 2. Imagen del producto de catálogo (id_producto)
    // 3. Imagen del servicio (id_servicio) - Fallback
    const imagenOriginal =
        prod.imageUrl ||
        prod.customDetails?.referenceImage ||
        prod.id_producto?.imageUrl ||
        prod.id_producto?.image ||
        prod.id_servicio?.imageUrl ||
        prod.id_servicio?.image;

    // Combinar imagen original con las subidas por el admin
    const todasLasImagenes = [
        ...(imagenOriginal ? [{ url: imagenOriginal, _id: 'original', label: 'Original' }] : []),
        ...(adminImagenes || [])
    ];

    const [imagenSeleccionada, setImagenSeleccionada] = useState(todasLasImagenes[0]?.url ?? null);
    const [indiceImagenActual, setIndiceImagenActual] = useState(0);

    const esAdminFabricador = prod.id_servicio && (prod.id_servicio._id === '6999d686f21e5a62a1823865' || prod.id_servicio === '6999d686f21e5a62a1823865');
    const cleanDetalles = prod.detalles ? prod.detalles.replace('[Personalizado] ', '') : '';
    const displayDetalles = cleanDetalles.length > 40 ? cleanDetalles.substring(0, 40) + '...' : cleanDetalles;

    const nombreItem =
        prod.id_producto?.name ||
        (!esAdminFabricador && prod.id_servicio?.name) ||
        displayDetalles ||
        'Producto';

    // Manejar navegación de imágenes con flechas
    const handlePrevImage = () => {
        const newIndex = (indiceImagenActual - 1 + todasLasImagenes.length) % todasLasImagenes.length;
        setIndiceImagenActual(newIndex);
        setImagenSeleccionada(todasLasImagenes[newIndex].url);
    };

    const handleNextImage = () => {
        const newIndex = (indiceImagenActual + 1) % todasLasImagenes.length;
        setIndiceImagenActual(newIndex);
        setImagenSeleccionada(todasLasImagenes[newIndex].url);
    };

    return (
        <div className='border border-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col'
            style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.04)' }}>
            
            {/* Contenedor de imagen - Altura reducida */}
            <div className='relative h-40 flex items-center justify-center group overflow-hidden bg-gradient-to-br from-black/20 to-black/40'>
                {imagenSeleccionada ? (
                    <>
                        <img
                            src={imagenSeleccionada}
                            alt={nombreItem}
                            className='w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 p-3'
                        />

                        {/* Flechas de navegación - Aparecen al hover */}
                        {todasLasImagenes.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    className='absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10'
                                    aria-label="Imagen anterior"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10'
                                    aria-label="Siguiente imagen"
                                >
                                    <ChevronRight size={20} />
                                </button>

                                {/* Indicador de imágenes */}
                                <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 bg-black/40 px-2 py-1 rounded-full'>
                                    {todasLasImagenes.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setIndiceImagenActual(idx);
                                                setImagenSeleccionada(todasLasImagenes[idx].url);
                                            }}
                                            className={`w-2 h-2 rounded-full transition-all ${
                                                idx === indiceImagenActual
                                                    ? 'bg-[#C8A882] w-3'
                                                    : 'bg-white/50 hover:bg-white/80'
                                            }`}
                                            aria-label={`Ver imagen ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className='w-full h-full flex flex-col items-center justify-center text-white/30'>
                        <svg className='w-16 h-16 mb-2 opacity-30' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                        <p className='text-sm'>Sin imagen</p>
                    </div>
                )}
            </div>

            {/* Contenedor de información - Compacto */}
            <div className='px-4 py-3 border-t border-white/10 flex-shrink-0'>
                
                {/* Nombre del producto - PEQUEÑO */}
                <h3 className='font-medium text-xs text-white/80 leading-snug line-clamp-2'>
                    {nombreItem}
                </h3>

                {/* Miniaturas de imágenes - Debajo del nombre */}
                {todasLasImagenes.length > 1 && (
                    <div className='flex gap-2 justify-start flex-wrap mt-2'>
                        {todasLasImagenes.map((img: any, idx: number) => (
                            <div key={img._id} className='relative group'>
                                <img
                                    src={img.url}
                                    onClick={() => {
                                        setImagenSeleccionada(img.url);
                                        setIndiceImagenActual(idx);
                                    }}
                                    className={`w-10 h-10 object-cover rounded border-2 cursor-pointer transition-all ${
                                        imagenSeleccionada === img.url
                                            ? 'border-[#C8A882] shadow-md shadow-[#C8A882]/30'
                                            : 'border-white/10 hover:border-[#C8A882]/50'
                                    }`}
                                    alt={`Miniatura ${idx + 1}`}
                                />
                                {img._id === 'original' && (
                                    <span className='absolute -top-1.5 -right-1.5 bg-[#C8A882] text-white text-[8px] px-1.5 py-0.5 rounded-full pointer-events-none font-semibold shadow-md'>
                                        Ref
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItemCard;