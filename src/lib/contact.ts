type ContactInput = {name:string;email:string;message:string};
type DraftResult = {ok:true;href:string}|{ok:false;error:string};
export function createContactDraft(input:ContactInput, recipient:string):DraftResult {
  const name=input.name.trim().replace(/[\r\n]+/g,' '), email=input.email.trim(), message=input.message.trim();
  if(!name||name.length>100)return {ok:false,error:'Please enter a name of 1–100 characters.'};
  if(email.length>200||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email))return {ok:false,error:'Please enter a valid email address.'};
  if(message.length<10||message.length>3000)return {ok:false,error:'Please enter a message of 10–3,000 characters, excluding surrounding spaces.'};
  const subject=encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body=encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  return {ok:true,href:`mailto:${recipient}?subject=${subject}&body=${body}`};
}
