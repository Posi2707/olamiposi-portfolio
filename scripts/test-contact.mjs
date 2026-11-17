import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createContactDraft } from '../src/lib/contact.ts';
const recipient='portfolio@example.com';
const valid={name:'  Ada & Co  ',email:'  ada@example.com  ',message:'  Let’s discuss a project & its scope.  '};
test('mailto safely encodes user text and preserves the real recipient',()=>{
 const result=createContactDraft(valid,recipient);assert(result.ok);const url=new URL(result.href);
 assert.equal(url.pathname,recipient);assert.equal(url.searchParams.get('subject'),'Portfolio enquiry from Ada & Co');
 assert.equal(url.searchParams.get('body'),'Name: Ada & Co\nEmail: ada@example.com\n\nLet’s discuss a project & its scope.');assert.equal([...url.searchParams.keys()].length,2);
});
test('rejects whitespace-only and short trimmed messages',()=>{for(const message of ['          ','       Hello       '])assert.equal(createContactDraft({...valid,message},recipient).ok,false);});
test('rejects invalid email and excessive text',()=>{assert.equal(createContactDraft({...valid,email:'invalid'},recipient).ok,false);assert.equal(createContactDraft({...valid,name:'A'.repeat(101)},recipient).ok,false);assert.equal(createContactDraft({...valid,message:'A'.repeat(3001)},recipient).ok,false);});
test('normalizes line breaks in the subject name',()=>{const result=createContactDraft({...valid,name:'Ada\r\nBcc:someone@example.com'},recipient);assert(result.ok);assert(!new URL(result.href).searchParams.get('subject').includes('\n'));});
