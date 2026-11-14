import React from 'react';

export interface ArtistData {
  id?: string;
  [key: string]: any;
}

interface TajWindowProps {
  artist?: ArtistData;
  isCenter?: boolean;
  openProgress?: number;
  anticipationOffset?: number;
  settleOffset?: number;
  isSettled?: boolean;
}

export const TajWindow: React.FC<TajWindowProps> = ({
  isCenter = false,
}) => {
  return (
    <div
      className={`relative w-full max-w-[310px] sm:max-w-[330px] md:max-w-[340px] select-none transition-all duration-500 hover:-translate-y-2 ${
        isCenter
          ? 'z-10 md:-translate-y-6 lg:-translate-y-8'
          : 'z-0 md:translate-y-[18%] lg:translate-y-[20%]'
      }`}
    >
      {/* 
        ========================================================================
        SOLID REFINED GOLDEN FRAME (50% REDUCED THICKNESS)
        - Substantial ~7-8px solid metallic gold frame (50% of previous thickness)
        - Stepped bevel profile with metallic highlights and inner shadow groove
        - Deep recessed pure solid black interior
        - Dead center: "COMING SOON"
        ========================================================================
      */}
      <div
        className={`relative rounded-md overflow-hidden transition-shadow duration-500 ${
          isCenter
            ? 'shadow-[0_24px_50px_rgba(50,25,10,0.26)] hover:shadow-[0_30px_60px_rgba(217,119,6,0.35)]'
            : 'shadow-[0_18px_40px_rgba(50,25,10,0.18)] hover:shadow-[0_24px_50px_rgba(180,120,30,0.28)]'
        }`}
      >
        {/* Solid Metallic Gold Frame Body (Reduced 50% to ~7.5px) */}
        <div
          className="p-1.5 sm:p-2 rounded-md"
          style={{
            background: `
              linear-gradient(135deg, 
                #FFE7A8 0%, 
                #DEB84F 20%, 
                #946E19 45%, 
                #FCE292 70%, 
                #7A570C 100%
              )
            `,
            boxShadow: `
              inset 0 1px 1px rgba(255, 255, 255, 0.75),
              inset 0 -1px 1.5px rgba(0, 0, 0, 0.45),
              0 4px 12px rgba(0, 0, 0, 0.16)
            `,
          }}
        >
          {/* Inner Golden Bevel Molding Step */}
          <div
            className="p-[1px] rounded-[3px]"
            style={{
              background: `
                linear-gradient(135deg, 
                  #7A570C 0%, 
                  #B8912E 35%, 
                  #F3D075 70%, 
                  #FFE7A8 100%
                )
              `,
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Recessed Pure Solid Black Interior */}
            <div
              className="relative rounded-[2px] bg-[#000000] aspect-[10/14] flex items-center justify-center p-6 overflow-hidden"
              style={{
                boxShadow: `
                  inset 0 5px 18px rgba(0, 0, 0, 0.98),
                  inset 0 0 6px rgba(0, 0, 0, 0.9)
                `,
              }}
            >
              {/* Dead Center: Clean, Letterspaced Luxury "COMING SOON" */}
              <div className="relative z-10 flex items-center justify-center">
                <span className="text-xs sm:text-sm font-sub tracking-[0.42em] uppercase text-[#fef3c7]/90 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  COMING SOON
                </span>
              </div>

              {/* Ultra-subtle inner glass reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.035] pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
