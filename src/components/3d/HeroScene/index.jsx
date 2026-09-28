import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

function Form({ mouse }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.12;
    ref.current.rotation.y += delta * 0.18;
    ref.current.rotation.y += (mouse.current.x * 0.4 - ref.current.rotation.y) * 0.04;
    ref.current.rotation.x += (mouse.current.y * 0.3 - ref.current.rotation.x) * 0.04;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.15, 1]} />
      <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.55} />
    </mesh>
  );
}

export default function HeroScene() {
  const mouse = useRef({ x: 0, y: 0 });

  return (
    <div
      className="absolute inset-y-0 right-0 hidden w-[42%] lg:block"
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouse.current.x = (event.clientX - rect.left) / rect.width - 0.5;
        mouse.current.y = (event.clientY - rect.top) / rect.height - 0.5;
      }}
    >
      <Canvas camera={{ position: [0, 0, 3.2], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Form mouse={mouse} />
      </Canvas>
    </div>
  );
}
