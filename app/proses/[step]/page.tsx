import { ConsumerFlow } from "@/components/consumer-flow";
import { Footer, FlowStrip, SiteNav } from "@/components/site-shell";

export default async function ProcessPage({ params }:{params:Promise<{step:string}>}) { const {step}=await params; const current=Math.min(10,Math.max(2,Number(step)||2)); return <><SiteNav/><FlowStrip active={current}/><ConsumerFlow step={current}/><Footer/></>; }
