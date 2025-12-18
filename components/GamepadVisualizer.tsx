
import React from 'react';

interface GamepadVisualizerProps {
  buttons: boolean[];
  highlightIndices: number[];
}

export const GamepadVisualizer: React.FC<GamepadVisualizerProps> = ({ buttons, highlightIndices }) => {
  // Simplified layout for demonstration
  return (
    <div className="relative w-full max-w-md mx-auto aspect-[16/10] bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent pointer-events-none rounded-3xl" />
      
      {/* Controller Body Simulation */}
      <div className="flex justify-between items-center h-full">
        {/* Left Side (D-Pad/Joystick) */}
        <div className="space-y-4">
          <div className={`w-12 h-12 rounded-full border-2 ${buttons[12] || buttons[13] || buttons[14] || buttons[15] ? 'border-purple-500 bg-purple-500/20' : 'border-zinc-700'} flex items-center justify-center`}>
            <div className="w-4 h-4 bg-zinc-600 rounded-sm" />
          </div>
          <div className={`w-16 h-16 rounded-full border-4 ${highlightIndices.includes(10) ? 'border-purple-400' : 'border-zinc-800'} bg-zinc-800 shadow-inner`} />
        </div>

        {/* Center Buttons */}
        <div className="flex flex-col gap-2">
           <div className="w-10 h-4 bg-zinc-800 rounded-full" />
           <div className="w-12 h-6 bg-zinc-800 rounded-lg flex items-center justify-center text-[10px] text-zinc-500 font-bold">RAY</div>
        </div>

        {/* Right Side (ABXY / Shapes) */}
        <div className="grid grid-cols-2 gap-2">
          {[3, 0, 2, 1].map((idx) => (
            <div 
              key={idx}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-75
                ${buttons[idx] ? 'bg-purple-600 scale-95 shadow-[0_0_15px_rgba(147,51,234,0.6)]' : 'bg-zinc-800 text-zinc-400'}
                ${highlightIndices.includes(idx) ? 'ring-2 ring-purple-400' : ''}
              `}
            >
              {idx === 0 ? 'X' : idx === 1 ? 'O' : idx === 2 ? '▢' : '△'}
            </div>
          ))}
        </div>
      </div>

      {/* Shoulder Buttons */}
      <div className="absolute top-[-20px] left-10 w-24 h-6 bg-zinc-800 rounded-t-xl border-t border-zinc-700" />
      <div className="absolute top-[-20px] right-10 w-24 h-6 bg-zinc-800 rounded-t-xl border-t border-zinc-700" />
    </div>
  );
};
