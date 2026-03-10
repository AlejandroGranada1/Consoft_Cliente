import { useState } from 'react';
import { ChevronLeft, ChevronRight, Palette, Ruler, Tag, DollarSign, Info, Box } from 'lucide-react';

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

    // Extraer datos adicionales con fallbacks robustos
    // Extraer datos adicionales con fallbacks robustos y "greedy"
    // Extraer datos adicionales con fallbacks robustos y "greedy"
    const color = prod.color || prod.customDetails?.color || prod.customDetails?.woodType || prod.id_producto?.color;
    const size = prod.size || prod.customDetails?.size || prod.customDetails?.dimensions || prod.id_producto?.dimensions;
    const material = prod.material || prod.customDetails?.material || prod.customDetails?.textura;
    const valor = prod.valor;
    const cantidad = prod.cantidad || prod.quantity || 1;

    const cleanDetalles = (prod.detalles || prod.customDetails?.description || '')
        .replace('[Personalizado] ', '');

    // Extracción ultra-robusta de detalles combinados
    const extractFromText = (marker: string) => {
        if (!cleanDetalles.toLowerCase().includes(marker.toLowerCase())) return null;
        const parts = cleanDetalles.split(new RegExp(`${marker}:?`, 'i'));
        if (parts.length < 2) return null;
        return parts[1].split('|')[0].trim();
    };

    const finalColor = color || extractFromText('color');
    const finalSize = size || extractFromText('tamaño') || extractFromText('talla');
    const finalMaterial = material || extractFromText('material');
    const displayDetalles = cleanDetalles;

    const nombreItemRaw =
        prod.id_producto?.name ||
        prod.id_producto?.nombre ||
        prod.product?.name ||
        prod.product?.nombre ||
        (!esAdminFabricador && (prod.id_servicio?.name || prod.id_servicio?.nombre)) ||
        prod.customDetails?.name ||
        'Producto';

    // Si todavía no tenemos nombre, usamos una parte de los detalles
    const finalNombre = nombreItemRaw === 'Producto' && cleanDetalles
        ? (cleanDetalles.split('|')[0]?.trim().substring(0, 30) || 'Producto')
        : nombreItemRaw;

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
        <div className='border border-white/10 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group/card'
            style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.04)' }}>

            {/* Contenedor de imagen */}
            <div className='relative h-48 flex items-center justify-center group overflow-hidden bg-gradient-to-br from-black/20 to-black/40'>
                {imagenSeleccionada ? (
                    <>
                        <img
                            src={imagenSeleccionada}
                            alt={finalNombre}
                            className='w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 p-4'
                        />

                        {/* Flechas de navegación - Aparecen al hover */}
                        {todasLasImagenes.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrevImage}
                                    className='absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 hover:bg-[#C8A882] text-white p-2 rounded-full z-10 backdrop-blur-sm'
                                    aria-label="Imagen anterior"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 hover:bg-[#C8A882] text-white p-2 rounded-full z-10 backdrop-blur-sm'
                                    aria-label="Siguiente imagen"
                                >
                                    <ChevronRight size={18} />
                                </button>

                                {/* Indicador de imágenes */}
                                <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-2 py-1.5 rounded-full backdrop-blur-md border border-white/5'>
                                    {todasLasImagenes.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setIndiceImagenActual(idx);
                                                setImagenSeleccionada(todasLasImagenes[idx].url);
                                            }}
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === indiceImagenActual
                                                ? 'bg-[#C8A882] w-4'
                                                : 'bg-white/30 hover:bg-white/60'
                                                }`}
                                            aria-label={`Ver imagen ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div className='w-full h-full flex flex-col items-center justify-center text-white/20'>
                        <Tag size={48} strokeWidth={1} className="mb-2" />
                        <p className='text-xs uppercase tracking-widest'>Sin imagen</p>
                    </div>
                )}

                {/* Badge de Precio en la imagen */}
                {valor > 0 && (
                    <div className="absolute top-3 right-3 bg-[#C8A882] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-lg flex items-center gap-1 backdrop-blur-sm">
                        <DollarSign size={10} />
                        {Number(valor).toLocaleString('es-CO')}
                    </div>
                )}
            </div>

            {/* Contenedor de información */}
            <div className='px-5 py-4 flex flex-col flex-1 space-y-3'>

                <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-[.15em] text-[#C8A882] font-semibold">Producto/Servicio</span>
                    <h3 className='font-serif text-base text-white/90 leading-tight group-hover/card:text-[#C8A882] transition-colors'>
                        {finalNombre}
                    </h3>
                </div>

                {/* Detalles técnicos */}
                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/5">
                    {finalColor && (
                        <div className="flex items-center gap-2 text-white/70 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                            <Palette size={12} className="text-[#C8A882]" />
                            <span className="text-[10px] truncate capitalize">{finalColor}</span>
                        </div>
                    )}
                    {finalSize && (
                        <div className="flex items-center gap-2 text-white/70 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                            <Ruler size={12} className="text-[#C8A882]" />
                            <span className="text-[10px] truncate uppercase">{finalSize}</span>
                        </div>
                    )}
                    {finalMaterial && (
                        <div className="flex items-center gap-2 text-white/70 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                            <Box size={12} className="text-[#C8A882]" />
                            <span className="text-[10px] truncate capitalize">{finalMaterial}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-white/70 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                        <Tag size={12} className="text-[#C8A882]" />
                        <span className="text-[10px]">Cant: {cantidad}</span>
                    </div>
                </div>

                {/* Descripción/Notas */}
                {cleanDetalles && (
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-white/30">
                            <Info size={11} />
                            <span className="text-[9px] uppercase tracking-wider font-medium">Especificaciones</span>
                        </div>
                        <p className="text-[11px] text-white/40 leading-relaxed italic line-clamp-6">
                            "{displayDetalles}"
                        </p>
                    </div>
                )}

                {/* Miniaturas de imágenes */}
                {todasLasImagenes.length > 1 && (
                    <div className='flex gap-2 justify-start flex-wrap mt-auto pt-2'>
                        {todasLasImagenes.map((img: any, idx: number) => (
                            <div key={img._id} className='relative group/thumb'>
                                <img
                                    src={img.url}
                                    onClick={() => {
                                        setImagenSeleccionada(img.url);
                                        setIndiceImagenActual(idx);
                                    }}
                                    className={`w-9 h-9 object-cover rounded-lg border-2 cursor-pointer transition-all duration-300 ${imagenSeleccionada === img.url
                                        ? 'border-[#C8A882] scale-105 shadow-md shadow-[#C8A882]/20'
                                        : 'border-white/5 hover:border-[#C8A882]/40'
                                        }`}
                                    alt={`Miniatura ${idx + 1}`}
                                />
                                {img._id === 'original' && (
                                    <span className='absolute -top-1.5 -right-1.5 bg-[#C8A882] text-white text-[7px] px-1.5 py-0.5 rounded-full pointer-events-none font-bold shadow-md uppercase'>
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