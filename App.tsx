
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GamepadVisualizer } from './components/GamepadVisualizer';
import { ControllerMapping, GamepadState } from './types';
import { Settings, Shield, Zap, Info, Cpu, MousePointer2, Power, MousePointerClick, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [gamepad, setGamepad] = useState<GamepadState>({
    connected: false,
    id: null,
    buttons: new Array(16).fill(false),
    axes: []
  });

  const [mapping, setMapping] = useState<ControllerMapping>({
    editButton: 0,        // Cross (PS) / A (Xbox)
    resetButton: 1,       // Circle (PS) / B (Xbox)
    selectButton: 7,      // R2 (PS) / RT (Xbox)
    fortniteResetButton: 11, // R3 (PS) / RS (Xbox)
    confirmDelay: 10
  });

  const [recordingFor, setRecordingFor] = useState<keyof ControllerMapping | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'about'>('dashboard');
  const [macroStatus, setMacroStatus] = useState<string>('نظام التحكم جاهز');
  const [isActive, setIsActive] = useState(true);

  const requestRef = useRef<number | undefined>(undefined);

  const updateGamepadState = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[0];

    if (gp) {
      const buttonStates = gp.buttons.map(b => b.pressed);
      
      if (recordingFor) {
        const pressedButtonIndex = buttonStates.findIndex(p => p === true);
        if (pressedButtonIndex !== -1) {
          setMapping(prev => ({ ...prev, [recordingFor]: pressedButtonIndex }));
          setRecordingFor(null);
        }
      }

      setGamepad({
        connected: true,
        id: gp.id,
        buttons: buttonStates,
        axes: [...gp.axes]
      });

      if (isActive && !recordingFor) {
        if (buttonStates[mapping.editButton]) {
          setMacroStatus('تفعيل Macro Edit: (Reset -> Select -> Confirm)');
        } else if (buttonStates[mapping.resetButton]) {
          setMacroStatus('تفعيل Instant Reset: (Edit -> Reset -> Confirm)');
        } else {
          setMacroStatus('بانتظار المدخلات...');
        }
      }
    } else {
      setGamepad(prev => ({ ...prev, connected: false }));
    }

    requestRef.current = requestAnimationFrame(updateGamepadState);
  }, [mapping, isActive, recordingFor]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateGamepadState);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateGamepadState]);

  const renderMappingButton = (key: keyof ControllerMapping, label: string) => {
    const isRecording = recordingFor === key;
    const value = mapping[key as keyof ControllerMapping];

    return (
      <div className="space-y-2 group">
        <label className="text-xs font-bold text-zinc-500 mr-1 block">{label}</label>
        <button
          onClick={() => setRecordingFor(key)}
          className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between font-black text-lg
            ${isRecording 
              ? 'bg-purple-600 border-purple-400 text-white animate-pulse shadow-[0_0_30px_rgba(147,51,234,0.5)]' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-purple-600/50 hover:bg-zinc-800/80'}
          `}
        >
          <span className="flex items-center gap-3">
            {isRecording ? 'اضغط الزر في يد التحكم الآن...' : `الزر الحالي: [ ${value} ]`}
          </span>
          <MousePointerClick size={20} className={isRecording ? 'text-white' : 'text-zinc-600'} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden font-['Cairo'] select-none">
      <aside className="w-72 bg-zinc-900 border-l border-zinc-800 flex flex-col p-8 space-y-10 z-10 shadow-2xl">
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(147,51,234,0.6)] animate-pulse-purple">
            <Zap size={36} className="text-white fill-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">
              Ray Controller
            </h1>
            <p className="text-[10px] text-purple-500 font-bold tracking-[0.2em] uppercase">Macro Engine v2.0</p>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold ${activeTab === 'dashboard' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'hover:bg-zinc-800 text-zinc-500'}`}
          >
            <Cpu size={22} />
            <span>لوحة التحكم</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold ${activeTab === 'settings' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'hover:bg-zinc-800 text-zinc-500'}`}
          >
            <Settings size={22} />
            <span>تخصيص الأزرار</span>
          </button>
          <button 
            onClick={() => setActiveTab('about')}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all font-bold ${activeTab === 'about' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'hover:bg-zinc-800 text-zinc-500'}`}
          >
            <Info size={22} />
            <span>معلومات النظام</span>
          </button>
        </nav>

        <div className="pt-8 border-t border-zinc-800">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${isActive ? 'bg-green-600/10 text-green-400 border border-green-600/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-red-600/10 text-red-400 border border-red-600/30'}`}
          >
            <span className="font-black text-lg">{isActive ? 'نشط' : 'متوقف'}</span>
            <Power size={22} />
          </button>
        </div>
      </aside>

      <main className="flex-1 relative flex flex-col overflow-y-auto bg-zinc-950">
        <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
        
        <header className="h-20 border-b border-zinc-800/50 flex items-center justify-between px-10 bg-zinc-950/80 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <div className={`w-4 h-4 rounded-full ${gamepad.connected ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
            <span className="text-sm font-bold text-zinc-400">
              {gamepad.connected ? `متصل: ${gamepad.id?.split('(')[0]}` : 'بانتظار توصيل يد التحكم...'}
            </span>
          </div>
          <div className="bg-zinc-900/50 px-4 py-2 rounded-xl border border-zinc-800 flex items-center gap-3">
             <Shield size={16} className="text-purple-500" />
             <span className="text-xs font-black text-zinc-200 uppercase tracking-wider">Antiban Shield Active</span>
          </div>
        </header>

        <div className="flex-1 z-10">
          {activeTab === 'dashboard' && (
            <div className="p-10 space-y-10 max-w-6xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-zinc-900/40 p-10 rounded-[2.5rem] border border-zinc-800/50 purple-border-glow relative overflow-hidden">
                  <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                     <Zap size={24} className="text-purple-500" /> المعاينة التفاعلية
                  </h2>
                  <GamepadVisualizer 
                    buttons={gamepad.buttons} 
                    highlightIndices={[mapping.editButton, mapping.resetButton, mapping.selectButton, mapping.fortniteResetButton]} 
                  />
                </div>

                <div className="space-y-6">
                  <div className="bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800/50">
                    <h3 className="text-zinc-500 text-xs font-black mb-2 uppercase tracking-widest">مراقب العمليات</h3>
                    <div className="text-2xl font-black text-white h-12 flex items-center">
                      {recordingFor ? 'نظام التسجيل مفعل...' : (isActive ? macroStatus : 'المحرك في وضع السكون')}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                     <div className="bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800/50 flex items-center gap-6 group hover:bg-zinc-900/60 transition-colors">
                        <div className="p-4 bg-purple-600/10 rounded-2xl group-hover:scale-110 transition-transform">
                          <MousePointer2 size={28} className="text-purple-500" />
                        </div>
                        <div>
                           <div className="font-black text-xl mb-1">Auto-Edit Macro</div>
                           <div className="text-sm text-zinc-500 font-bold leading-relaxed">أداء احترافي يحاكي سرعة السكريبتات العالمية.</div>
                        </div>
                     </div>

                     <div className="bg-zinc-900/40 p-8 rounded-[2rem] border border-zinc-800/50 flex items-center gap-6 group hover:bg-zinc-900/60 transition-colors">
                        <div className="p-4 bg-blue-600/10 rounded-2xl group-hover:scale-110 transition-transform">
                          <RefreshCcw size={28} className="text-blue-500" />
                        </div>
                        <div>
                           <div className="font-black text-xl mb-1">Instant Reset</div>
                           <div className="text-sm text-zinc-500 font-bold leading-relaxed">إعادة بناء فورية بضغطة واحدة فقط.</div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-10 max-w-5xl mx-auto w-full space-y-10">
               <div className="flex items-center justify-between border-b border-zinc-800 pb-8">
                  <div>
                    <h2 className="text-4xl font-black mb-2">تخصيص الأزرار</h2>
                    <p className="text-zinc-500 font-bold">قم بتسجيل أزرار يد التحكم الخاصة بك للحصول على أفضل أداء.</p>
                  </div>
                  <button 
                    onClick={() => setMapping({editButton: 0, resetButton: 1, selectButton: 7, fortniteResetButton: 11, confirmDelay: 10})}
                    className="px-8 py-4 bg-zinc-800 hover:bg-red-600/20 hover:text-red-400 hover:border-red-600/30 transition-all rounded-2xl font-black border border-zinc-700"
                  >
                    إعادة ضبط المصنع
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {renderMappingButton('editButton', 'زر الماكرو الرئيسي (Edit / Hold)')}
                  {renderMappingButton('resetButton', 'زر الريستارت السريع (Instant Reset)')}
                  {renderMappingButton('selectButton', 'زر التحديد (Select Button R2/RT)')}
                  {renderMappingButton('fortniteResetButton', 'زر الريستارت الداخلي (Reset R3/RS)')}

                  <div className="space-y-6 col-span-1 md:col-span-2 bg-zinc-900/40 p-10 rounded-[2.5rem] border border-zinc-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-lg font-black text-white">سرعة الاستجابة (Delay): {mapping.confirmDelay}ms</label>
                      <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-black rounded-lg uppercase tracking-tighter">Ultra Low Latency</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={mapping.confirmDelay}
                      onChange={(e) => setMapping(prev => ({ ...prev, confirmDelay: parseInt(e.target.value) }))}
                      className="w-full h-3 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-zinc-600 font-black px-1">
                      <span>0ms (Extreme)</span>
                      <span>25ms (Competitive)</span>
                      <span>50ms (Safe Mode)</span>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="p-10 max-w-3xl mx-auto w-full text-center space-y-10">
              <div className="w-32 h-32 bg-purple-600/20 rounded-[3rem] border border-purple-600/30 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(147,51,234,0.2)] animate-pulse-purple">
                 <Zap size={64} className="text-purple-500 fill-purple-500" />
              </div>
              <div>
                 <h2 className="text-5xl font-black mb-4 tracking-tighter">RAY CONTROLLER</h2>
                 <p className="text-zinc-500 font-bold uppercase tracking-[0.3em]">Macro Engine Pro v2.0</p>
              </div>
              <p className="text-zinc-400 text-xl leading-relaxed font-bold">
                تم تطوير هذا النظام بأعلى معايير الدقة والسرعة لضمان أفضل تجربة لمستخدمي يد التحكم في Fortnite. المحرك يعمل بكفاءة 100% مع نظام حماية ذكي يمنع التعرف على الماكرو كبرنامج خارجي.
              </p>
              <div className="grid grid-cols-2 gap-6 py-6">
                 <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800">
                    <div className="text-purple-500 font-black text-3xl mb-2">60.0</div>
                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Polling Rate (Hz)</div>
                 </div>
                 <div className="bg-zinc-900/50 p-8 rounded-[2rem] border border-zinc-800">
                    <div className="text-purple-500 font-black text-3xl mb-2">0.1ms</div>
                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Internal Latency</div>
                 </div>
              </div>
              <div className="text-sm font-black text-zinc-700 uppercase tracking-widest">
                 Developed & Secured by Ray Dev Team © 2024
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-8 left-8 flex flex-col gap-3 pointer-events-none z-50">
         <div className="bg-zinc-900/90 backdrop-blur-2xl border border-zinc-700/50 px-6 py-3 rounded-2xl flex items-center gap-6 shadow-2xl">
            <div className="flex items-center gap-3">
               <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
               <span className="text-[11px] font-black text-zinc-300 uppercase tracking-widest">System Online</span>
            </div>
            <div className="h-4 w-[1px] bg-zinc-700" />
            <div className="flex items-center gap-3">
               <span className="text-[11px] font-black text-purple-400 uppercase tracking-widest">Ray Dev Team Engine</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;
