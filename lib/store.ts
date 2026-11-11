"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { designs, materials } from "./mock-data";

type PaymentStatus = "idle" | "pending" | "paid" | "failed" | "expired";
export type MarketplaceStore = {
  landWidth: number; landLength: number; city: string; selectedDesignId: string;
  facade: string; layout: string; selectedMaterials: Record<string,string>;
  contractorId?: string; customAdaptation: boolean; compareIds: string[];
  profile?: { fullName:string; phone:string; buildLocation:string; verified:boolean };
  paymentStatus: PaymentStatus; qrStatus: "active" | "redeemed" | "expired"; reissueCount: number;
  qrToken: string; demandLog: string[];
  setLand: (width:number,length:number,city:string)=>void; selectDesign:(id:string)=>void;
  setVariant:(kind:"facade"|"layout",value:string)=>void; selectMaterial:(category:string,id:string)=>void;
  setContractor:(id?:string)=>void; setCustomAdaptation:(value:boolean)=>void; toggleCompare:(id:string)=>void;
  saveProfile:(profile:MarketplaceStore["profile"])=>void; setPaymentStatus:(status:PaymentStatus)=>void;
  redeemQr:()=>void; reissueQr:()=>void; logDemand:(entry:string)=>void;
};

const defaultMaterials = Object.fromEntries([...new Set(materials.map(m=>m.category))].map(category => [category, materials.find(m=>m.category===category)!.id]));

export const useMarketplaceStore = create<MarketplaceStore>()(persist((set) => ({
  landWidth:8, landLength:15, city:"Bandung", selectedDesignId:designs[0].id,
  facade:designs[0].facadeVariants[0], layout:designs[0].layoutVariants[0], selectedMaterials:defaultMaterials,
  customAdaptation:false, compareIds:[], paymentStatus:"idle", qrStatus:"active", reissueCount:0,
  qrToken:"TB-HB001-2026-7X9K", demandLog:[],
  setLand:(landWidth,landLength,city)=>set({landWidth,landLength,city}),
  selectDesign:(selectedDesignId)=>set({selectedDesignId}),
  setVariant:(kind,value)=>set(kind==="facade"?{facade:value}:{layout:value}),
  selectMaterial:(category,id)=>set(s=>({selectedMaterials:{...s.selectedMaterials,[category]:id}})),
  setContractor:(contractorId)=>set({contractorId}), setCustomAdaptation:(customAdaptation)=>set({customAdaptation}),
  toggleCompare:(id)=>set(s=>({compareIds:s.compareIds.includes(id)?s.compareIds.filter(x=>x!==id):s.compareIds.length<3?[...s.compareIds,id]:s.compareIds})),
  saveProfile:(profile)=>set({profile}), setPaymentStatus:(paymentStatus)=>set({paymentStatus}),
  redeemQr:()=>set({qrStatus:"redeemed"}),
  reissueQr:()=>set(s=>s.reissueCount<1?{qrStatus:"active",reissueCount:1,qrToken:`${s.qrToken}-R1`}:{}),
  logDemand:(entry)=>set(s=>({demandLog:[...s.demandLog,entry]})),
}), { name:"hunibangun-guest-session" }));
