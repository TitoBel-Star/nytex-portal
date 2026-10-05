import React, { useState } from 'react';

export default function ComoTrabajamosConUsted() {
  const [openFaq, setOpenFaq] = useState([0, 1, 2]); // Todos abiertos por defecto como en la imagen

  const toggleFaq = (idx) => {
    setOpenFaq(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const steps = [
    {
      num: 1,
      title: 'Diagnóstico',
      desc: 'Entendemos su empresa y sus objetivos.',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      )
    },
    {
      num: 2,
      title: 'Alcance y propuesta',
      desc: 'Definimos la solución y el plan de trabajo.',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      num: 3,
      title: 'Implementación',
      desc: 'Configuramos, integramos y validamos.',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    },
    {
      num: 4,
      title: 'Capacitación',
      desc: 'Formamos a sus equipos en el uso de NyTEX.',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      num: 5,
      title: 'Seguimiento',
      desc: 'Acompañamos su evolución y nuevas necesidades.',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    }
  ];

  const faqs = [
    {
      q: '¿Quién provee las aplicaciones?',
      a: 'NyTEX desarrolla y es propietaria de la plataforma y sus aplicaciones.'
    },
    {
      q: '¿Quién implementa y brinda soporte?',
      a: 'Consultores NyT se encarga de la implementación, configuración, capacitación y soporte según el plan contratado.'
    },
    {
      q: '¿Puedo contratar módulos individuales?',
      a: 'Sí. Puede seleccionar uno o varios módulos según sus necesidades, en la modalidad A su Medida.'
    }
  ];

  return (
    <section className="mt-14 mb-24 space-y-10">
      
      {/* 1. CÓMO TRABAJAMOS CON USTED */}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A2540] tracking-tight">
            Cómo trabajamos con usted
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-1">
            Un proceso claro y colaborativo para lograr resultados.
          </p>
        </div>

        {/* Barra horizontal de 5 pasos */}
        <div className="bg-[#f8fafc] border border-blue-100/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-2 items-center">
            {steps.map((st, idx) => (
              <React.Fragment key={st.num}>
                <div className="flex items-start gap-3">
                  {/* Número azul circular */}
                  <span className="w-7 h-7 rounded-full bg-[#0066CC] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    {st.num}
                  </span>
                  
                  {/* Ícono azul */}
                  <div className="shrink-0 mt-0.5">
                    {st.icon}
                  </div>

                  {/* Textos */}
                  <div className="flex-1 pr-2">
                    <h4 className="font-extrabold text-sm text-[#0A2540] leading-snug">
                      {st.title}
                    </h4>
                    <p className="text-[11.5px] text-gray-500 font-normal mt-0.5 leading-snug">
                      {st.desc}
                    </p>
                  </div>

                  {/* Flecha hacia el siguiente paso (excepto el último) */}
                  {idx < steps.length - 1 && (
                    <span className="hidden md:inline-block text-gray-300 font-light text-xl self-center px-1">
                      ›
                    </span>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 2. TECNOLOGÍA NYTEX Y ACOMPAÑAMIENTO CONSULTORES NYT */}
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-[#0A2540] tracking-tight mb-3">
          Tecnología NyTEX. Acompañamiento de Consultores NyT.
        </h3>

        <div className="bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Bloque NyTEX */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-2xl sm:text-3xl font-black text-[#0066CC] tracking-tight">
              NyTEX
            </span>
            <span className="text-xs sm:text-sm text-gray-600 font-medium max-w-xs leading-snug">
              desarrolla y es propietaria de la plataforma.
            </span>
          </div>

          {/* Divisor vertical */}
          <div className="hidden md:block w-px h-10 bg-gray-200" />

          {/* Bloque Consultores NyT */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xl sm:text-2xl font-black text-[#0A2540] tracking-tight">
              Consultores NyT
            </span>
            <span className="text-xs sm:text-sm text-gray-600 font-medium max-w-sm leading-snug">
              comercializa e implementa soluciones y servicios empresariales.
            </span>
          </div>

          {/* Divisor vertical */}
          <div className="hidden md:block w-px h-10 bg-gray-200" />

          {/* Enlace */}
          <div className="w-full md:w-auto text-left md:text-right">
            <a 
              href="#red-partners"
              onClick={(e) => {
                e.preventDefault();
                alert("NyTEX ERP cuenta con una red de partners certificados encabezada por Consultores NyT para asesoría, implementación llave en mano y soporte continuo.");
              }}
              className="text-[#0066CC] hover:text-blue-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <span>Conocer NyTEX y su red de partners</span>
              <span className="group-hover:translate-x-1 transition-transform font-bold">➔</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. PREGUNTAS FRECUENTES */}
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-[#0A2540] tracking-tight mb-3">
          Preguntas frecuentes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {faqs.map((f, idx) => {
            const isOpen = openFaq.includes(idx);

            return (
              <div 
                key={idx}
                className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition-all"
              >
                <div>
                  <div 
                    onClick={() => toggleFaq(idx)}
                    className="flex items-center justify-between cursor-pointer select-none gap-2"
                  >
                    <h4 className="font-extrabold text-sm sm:text-base text-[#0A2540] leading-snug">
                      {f.q}
                    </h4>
                    <span className="text-gray-400 text-xs font-bold shrink-0">
                      {isOpen ? '⌃' : '⌄'}
                    </span>
                  </div>

                  {isOpen && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed font-normal">
                      {f.a}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
