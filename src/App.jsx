import { Loader, PerformanceMonitor, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { Suspense, useState } from "react";
import { Experience } from "./components/Experience";
import { Leaderboard } from "./components/Leaderboard";
import { ConnectButton, useConnection } from 'arweave-wallet-kit'

function App() {
  const [downgradedPerformance, setDowngradedPerformance] = useState(false);
  const { connected } = useConnection();

  return (
    <>
      {
        connected ? (
          <>
            <Loader />
            <Leaderboard />
            <Canvas
              shadows
              camera={{ position: [0, 30, 0], fov: 30, near: 2 }}
              dpr={[1, 1.5]} // optimization to increase performance on retina/4k devices
            >
              <color attach="background" args={["#242424"]} />
              <SoftShadows size={42} />
              <PerformanceMonitor
                // Detect low performance devices
                onDecline={(fps) => {
                  setDowngradedPerformance(true);
                }}
              />
              <Suspense>
                <Physics>
                  <Experience downgradedPerformance={downgradedPerformance} />
                </Physics>
              </Suspense>
              {!downgradedPerformance && (
                // disable the postprocessing on low-end devices
                <EffectComposer disableNormalPass>
                  <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
                </EffectComposer>
              )}
            </Canvas>
          </>) : (
            <div className="flex justify-center items-center h-screen bg-slate-600 " >

          <ConnectButton profileModal={true} showBalance={true} showAddress={true} showProfilePicture={false} />
            </div>
        )
      }
    </>
  );
}

export default App;
