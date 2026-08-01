"use client";
import {useCallback, useState, useId, useRef, useEffect, type FormEvent} from "react";
import { Turnstile } from "./turnstile";
const initial={company:"",contact:"",email:"",phone:"",address:"",city:"",state:"CA",zip:"",service:"Compliance Testing",inspectionType:"Routine inspection",preferredDate:"",preferredTime:"",preferredMeridiem:"AM",message:"",privacy:false,website:""};
export function InspectionForm(){const [form,setForm]=useState(initial),[status,setStatus]=useState(""),[captchaToken,setCaptchaToken]=useState("");const [captchaReady,setCaptchaReady]=useState(false);const onToken=useCallback((token:string)=>setCaptchaToken(token),[]);const change=(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>)=>setForm({...form,[e.target.name]:e.target.type==='checkbox'?(e.target as HTMLInputElement).checked:e.target.value});async function submit(e:FormEvent){e.preventDefault();setStatus("Submitting securely…");try{const response=await fetch('/api/inspection',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,captchaToken})});const data=await response.json();setStatus(response.ok?`Request received. Your reference is ${data.reference}.`:(data.error||'We could not submit the request. Please call us.'));if(response.ok){setForm(initial);setCaptchaToken("")}}catch{setStatus('Connection issue. Please call (650) 651-6452.')}}return <form className="form" onSubmit={submit}><h2>Request an inspection</h2><p className="lede">Tell us about your site. We’ll follow up with next steps.</p>{status&&<p className={'notice '+(status.includes('could')||status.includes('issue')?'error':'')} role="status">{status}</p>}<div className="fields"><Field label="Company name" name="company" value={form.company} onChange={change} required/><Field label="Contact name" name="contact" value={form.contact} onChange={change} required/><Field label="Work email" name="email" type="email" value={form.email} onChange={change} required/><Field label="Phone" name="phone" type="tel" value={form.phone} onChange={change} required/><Field label="Job site address" name="address" value={form.address} onChange={change} required full/><Field label="City" name="city" value={form.city} onChange={change} required/><Field label="ZIP code" name="zip" value={form.zip} onChange={change} required/><Select label="Requested service" name="service" value={form.service} onChange={change} options={['Compliance Testing','Installation','Repair','Maintenance','Emergency Service']}/><Select label="Inspection type" name="inspectionType" value={form.inspectionType} onChange={change} options={['Routine inspection','Compliance inspection','Pre-construction assessment','Emergency assessment']}/><Field label="Preferred date" name="preferredDate" type="date" value={form.preferredDate} onChange={change}/><div className="field time-group"><label>Preferred time</label><div className="time-row"><input id="preferredTime" name="preferredTime" value={form.preferredTime} onChange={change} type="time"/><div className="ampm" role="group" aria-label="AM or PM">
          <button type="button" className={"ampm-btn "+(form.preferredMeridiem==='AM'?"active":"")} onClick={()=>setForm(prev=>({...prev,preferredMeridiem:'AM'}))}>AM</button>
          <button type="button" className={"ampm-btn "+(form.preferredMeridiem==='PM'?"active":"")} onClick={()=>setForm(prev=>({...prev,preferredMeridiem:'PM'}))}>PM</button>
        </div></div></div><div className="field full"><label htmlFor="message">Project details</label><textarea id="message" name="message" value={form.message} onChange={change} maxLength={2000}/></div><div className="field full" style={{display:'none'}} aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" value={form.website} onChange={change} tabIndex={-1}/></div><label className="field full" style={{display:'flex',gridTemplateColumns:'auto 1fr',gap:10,alignItems:'start'}}><input type="checkbox" name="privacy" checked={form.privacy} onChange={change} required/> <span>I agree to the <a href="/privacy-policy">Privacy Policy</a> and consent to Mojo Petroleum contacting me about this request.</span></label><div className="field full"><label className="sr-only">Human verification</label><Turnstile onToken={onToken} onReady={setCaptchaReady}/></div></div><button className="btn primary" type="submit" disabled={Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)&&!captchaToken&&captchaReady}>Send inspection request →</button></form>}
function Field({label,name,value,onChange,type='text',required=false,full=false}:{label:string;name:string;value:string;onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;type?:string;required?:boolean;full?:boolean}){return <div className={'field '+(full?'full':'')}><label htmlFor={name}>{label}</label><input id={name} name={name} value={value} onChange={onChange} type={type} required={required}/></div>};function CustomSelect({label,name,value,onChange,options}:{label:string;name:string;value:string;onChange:(e:React.ChangeEvent<HTMLSelectElement>)=>void;options:string[]}){
  const id = useId()
  const [open,setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement|null>(null)
  useEffect(()=>{
    function onDoc(e:MouseEvent){
      if(!rootRef.current) return
      if(!rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return ()=>document.removeEventListener('click', onDoc)
  },[])

  const handleSelect = (val:string)=>{
    const fake = {target:{name, value:val}} as unknown as React.ChangeEvent<HTMLSelectElement>
    onChange(fake)
    setOpen(false)
  }

  useEffect(()=>{
    if(!open) return
    function onKey(e:KeyboardEvent){
      if(!rootRef.current) return
      const opts = Array.from(rootRef.current.querySelectorAll<HTMLElement>('.cs-option'))
      if(e.key === 'Escape'){
        setOpen(false)
        const btn = rootRef.current.querySelector<HTMLButtonElement>('.cs-trigger')
        btn?.focus()
        return
      }
      if(e.key === 'ArrowDown' || e.key === 'ArrowUp'){
        e.preventDefault()
        if(opts.length===0) return
        const activeIndex = opts.findIndex(o=>o.getAttribute('aria-selected')==='true' || document.activeElement === o)
        let next = 0
        if(e.key === 'ArrowDown') next = activeIndex < opts.length-1 ? activeIndex+1 : 0
        else next = activeIndex > 0 ? activeIndex-1 : opts.length-1
        opts[next].focus()
        return
      }
      if(e.key === 'Enter' && document.activeElement && (document.activeElement as HTMLElement).classList.contains('cs-option')){
        const val = (document.activeElement as HTMLElement).textContent || ''
        handleSelect(val)
      }
    }
    document.addEventListener('keydown', onKey)
    return ()=>document.removeEventListener('keydown', onKey)
  },[open])

  return (
    <div className="field custom-select" ref={rootRef}>
      <label htmlFor={id}>{label}</label>
      <button type="button" id={id} aria-haspopup="listbox" aria-expanded={open} className="cs-trigger" onClick={()=>setOpen(v=>!v)}>
        <span className="cs-value">{value}</span>
        <svg className="cs-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="#24421c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <ul role="listbox" aria-labelledby={id} tabIndex={-1} className="cs-list">
          {options.map(o=> (
            <li key={o} role="option" aria-selected={o===value} className={"cs-option "+(o===value?"selected":"")} onClick={()=>handleSelect(o)} onKeyDown={(e)=>{if(e.key==='Enter') handleSelect(o)}} tabIndex={0}>{o}</li>
          ))}
        </ul>
      )}
      <select aria-hidden style={{display:'none'}} name={name} value={value} onChange={onChange}>
        {options.map(x=><option key={x}>{x}</option>)}
      </select>
    </div>
  )
}

const Select = CustomSelect

