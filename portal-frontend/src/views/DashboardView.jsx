import React from 'react';
import { Link } from 'react-router-dom';

const DashboardView = () => {
  return (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden relative">
      
      {/* Background Graphic (User Provided Image) */}
      <div 
        className="absolute inset-0 w-full h-full bg-no-repeat bg-contain bg-right-bottom pointer-events-none"
        style={{ backgroundImage: "url('/dashboard-bg.png')" }}
      ></div>

      {/* Content Overlay */}
      <div className="relative w-full h-full flex justify-center items-center px-8 lg:px-16 mix-blend-multiply">
        <div className="w-full max-w-[1600px] flex flex-col lg:flex-row items-center justify-between">
          
          {/* Left Side: Welcome Text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center lg:pr-10">
            <p className="text-nytex-blue-dark font-bold text-[14px] 2xl:text-[18px] tracking-[0.3em] uppercase mb-2">BIENVENIDO(A)</p>
            <h1 className="text-[56px] 2xl:text-[80px] font-extrabold text-nytex-navy-dark mb-4 leading-none">Administrador</h1>
            <p className="text-[18px] 2xl:text-[24px] text-nytex-text font-normal mb-8 max-w-xl">
              Gestiona, controla y haz crecer tu negocio con NyTEX ERP.
            </p>
            <div className="flex gap-4 mb-24">
              <Link to="/portal" className="bg-nytex-navy hover:bg-nytex-blue transition-colors text-white font-bold py-3 px-8 rounded-full shadow-lg">
                Ir a mis Módulos
              </Link>
            </div>
            <div className="w-[80px] h-[4px] bg-nytex-cyan mb-8 rounded-full"></div>

            {/* Three Icons Row */}
            <div className="flex items-center">
              {/* Item 1 */}
              <div className="flex flex-col items-center text-center w-[150px] group cursor-default">
                <div className="w-20 h-20 flex items-center justify-center text-nytex-cyan text-[56px] mb-4 group-hover:scale-105 transition-transform">
                  <i className="fas fa-cog"></i>
                </div>
                <h3 className="text-nytex-navy-dark font-extrabold text-[14px] 2xl:text-[16px] tracking-widest mt-2">INTEGRA</h3>
                <p className="text-nytex-silver text-[14px] 2xl:text-[16px] font-medium mt-1">Tus procesos</p>
              </div>
              
              {/* Divider 1 */}
              <div className="w-px h-20 bg-nytex-border mx-6"></div>

              {/* Item 2 */}
              <div className="flex flex-col items-center text-center w-[150px] group cursor-default">
                <div className="w-20 h-20 flex items-center justify-center text-nytex-cyan text-[56px] mb-4 group-hover:scale-105 transition-transform">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <h3 className="text-nytex-navy-dark font-extrabold text-[14px] 2xl:text-[16px] tracking-widest mt-2">OPTIMIZA</h3>
                <p className="text-nytex-silver text-[14px] 2xl:text-[16px] font-medium mt-1">Tus recursos</p>
              </div>

              {/* Divider 2 */}
              <div className="w-px h-20 bg-nytex-border mx-6"></div>

              {/* Item 3 */}
              <div className="flex flex-col items-center text-center w-[150px] group cursor-default">
                <div className="w-20 h-20 flex items-center justify-center text-nytex-cyan text-[56px] mb-4 group-hover:scale-105 transition-transform">
                  <i className="fas fa-users"></i>
                </div>
                <h3 className="text-nytex-navy-dark font-extrabold text-[14px] 2xl:text-[16px] tracking-widest mt-2">HAZ CRECER</h3>
                <p className="text-nytex-silver text-[14px] 2xl:text-[16px] font-medium mt-1">Tu negocio</p>
              </div>
            </div>
          </div>

          {/* Right Side: Big Logo */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center lg:items-end mt-16 lg:mt-0">
            <img 
              src="/nytex-logo.png?v=3" 
              alt="NyTEX ERP Logo Big" 
              className="w-full max-w-[1000px] object-contain relative -left-8 2xl:-left-16" 
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
