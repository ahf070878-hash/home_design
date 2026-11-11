"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";

type Palette = { foundation:string; wall:string; roof:string; accent:string; glass:string; rule:string; paper:string };

function House({ stage, palette }: { stage:number; palette:Palette }) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * .08; });
  return <group ref={ref} position={[0,-.7,0]}>
    <mesh position={[0,-.25,0]}><boxGeometry args={[4,.4,3]}/><meshStandardMaterial color={palette.foundation}/></mesh>
    {stage >= 1 && <>
      <mesh position={[-1.65,.8,0]}><boxGeometry args={[.25,2.2,3]}/><meshStandardMaterial color={palette.wall}/></mesh>
      <mesh position={[1.65,.8,0]}><boxGeometry args={[.25,2.2,3]}/><meshStandardMaterial color={palette.wall}/></mesh>
      <mesh position={[0,.8,-1.38]}><boxGeometry args={[3.2,2.2,.25]}/><meshStandardMaterial color={palette.wall}/></mesh>
    </>}
    {stage >= 2 && <mesh position={[0,2.15,0]} rotation={[0,Math.PI/4,0]}><coneGeometry args={[3.05,1.6,4]}/><meshStandardMaterial color={palette.roof}/></mesh>}
    {stage >= 3 && <>
      <mesh position={[0,.55,1.43]}><boxGeometry args={[1,1.6,.12]}/><meshStandardMaterial color={palette.accent}/></mesh>
      <mesh position={[-1.05,.9,1.44]}><boxGeometry args={[.8,.8,.12]}/><meshStandardMaterial color={palette.glass} metalness={.1} roughness={.2}/></mesh>
      <mesh position={[1.05,.9,1.44]}><boxGeometry args={[.8,.8,.12]}/><meshStandardMaterial color={palette.glass} metalness={.1} roughness={.2}/></mesh>
    </>}
  </group>;
}

export function HouseStage() {
  const [stage,setStage] = useState(0);
  const [palette,setPalette] = useState<Palette|null>(null);
  useEffect(()=>{const css=getComputedStyle(document.documentElement);const token=(name:string)=>css.getPropertyValue(name).trim();setPalette({foundation:token("--color-foundation"),wall:token("--color-wall"),roof:token("--color-roof"),accent:token("--color-accent"),glass:token("--color-glass"),rule:token("--color-rule"),paper:token("--color-paper-3")})},[]);
  const labels = ["Fondasi","Dinding","Atap","Selesai"];
  return <div className="hero-stage" aria-label="Model rumah 3D interaktif">
    <div className={`stage-fallback stage-${stage}`} aria-hidden="true"><span className="fallback-roof"/><span className="fallback-house"><i/><i/></span><span className="fallback-base"/></div>
    {palette&&<Canvas camera={{ position:[6,4.2,6], fov:42 }}>
      <ambientLight intensity={1.8}/><directionalLight position={[5,8,6]} intensity={2.2}/>
      <House stage={stage} palette={palette}/><gridHelper args={[14,14,palette.rule,palette.paper]}/><OrbitControls enablePan={false} minDistance={6} maxDistance={11}/>
    </Canvas>}
    <div className="stage-controls">{labels.map((label,index)=><button key={label} className={stage===index?"active":""} onClick={()=>setStage(index)}>{index+1}. {label}</button>)}</div>
  </div>;
}
