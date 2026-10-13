const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const source=fs.readFileSync(__dirname+'/dist/app.js','utf8');
for(const blocked of [false,true]){
 const elements=new Map(),data=new Map();
 const storage={getItem(k){if(blocked)throw Error('blocked');return data.get(k)||null},setItem(k,v){if(blocked)throw Error('blocked');data.set(k,v)},removeItem(k){if(blocked)throw Error('blocked');data.delete(k)}};
 const ctx=vm.createContext({Core:require('./dist/core.js'),localStorage:storage,sessionStorage:storage,document:{querySelector(s){if(!elements.has(s))elements.set(s,{innerHTML:'',style:{}});return elements.get(s)}},Intl,Date,setTimeout});
 vm.runInContext(source,ctx);
 for(const selected of ['Quản lý','Nhân viên','Chỉ xem']){
  const loginHTML=elements.get('#app').innerHTML;
  const handler=loginHTML.match(/onclick="([^"]+)">Vào không gian/)[1];
  elements.get('#role')||elements.set('#role',{});elements.get('#role').value=selected;
  // Inline handlers resolve element properties before global bindings.
  ctx.clickedButton={role:''};vm.runInContext('(function(){with(this){'+handler+'}}).call(clickedButton)',ctx);
  assert.equal(vm.runInContext('role',ctx),selected);
  assert.ok(elements.get('#app').innerHTML.includes('<main>'));
  assert.equal(vm.runInContext('canApprove()',ctx),selected==='Quản lý');
  assert.equal(vm.runInContext('canEdit()',ctx),selected!=='Chỉ xem');
  if(!blocked)assert.equal(data.get('storix-role'),selected);
  vm.runInContext('(function(){with(this){logout()}}).call(clickedButton)',ctx);
  assert.equal(vm.runInContext('role',ctx),null);
  assert.ok(elements.get('#app').innerHTML.includes('Vào không gian làm việc'));
 }
}
console.log('PASS: login/logout and permissions for all 3 roles; sessionStorage available and blocked.');
