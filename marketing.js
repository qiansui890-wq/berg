/* Berg PC — shared marketing page behavior */
(function(){
  var nav=document.getElementById('nav');
  if(nav) addEventListener('scroll',function(){nav.classList.toggle('scrolled',scrollY>40);},{passive:true});

  var els=[].slice.call(document.querySelectorAll('.reveal'));
  function chk(){var tr=innerHeight*0.86;for(var i=els.length-1;i>=0;i--){if(els[i].getBoundingClientRect().top<tr){els[i].classList.add('in');els.splice(i,1);}}}
  addEventListener('scroll',chk,{passive:true});addEventListener('resize',chk);chk();

  var c=document.getElementById('net'); if(!c) return;
  var x=c.getContext('2d'),W,H,nodes,DPR=Math.min(devicePixelRatio||1,2),LINK=160;
  function size(){var r=c.getBoundingClientRect();W=r.width;H=r.height;c.width=W*DPR;c.height=H*DPR;x.setTransform(DPR,0,0,DPR,0,0);
    var n=Math.min(90,Math.round(W*H/15000));
    nodes=Array.from({length:n},function(){return{x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.36,vy:(Math.random()-.5)*.36,r:Math.random()*1.7+1.3,gold:Math.random()>.8};});}
  size();addEventListener('resize',size);
  var pulses=[];setInterval(function(){if(!nodes||nodes.length<2)return;var a=nodes[(Math.random()*nodes.length)|0],b=null,bd=LINK;for(var k=0;k<nodes.length;k++){var m=nodes[k];if(m===a)continue;var d=Math.hypot(m.x-a.x,m.y-a.y);if(d<bd){bd=d;b=m;}}if(b)pulses.push({a:a,b:b,t:0,sp:.013+Math.random()*.012});},300);
  function tick(){x.clearRect(0,0,W,H);
    for(var i=0;i<nodes.length;i++){var a=nodes[i];a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
      for(var j=i+1;j<nodes.length;j++){var b=nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<LINK){var o=(1-d/LINK)*.5;x.strokeStyle='rgba(120,150,186,'+o+')';x.lineWidth=1;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}}}
    for(var p=0;p<nodes.length;p++){var n=nodes[p];x.beginPath();x.arc(n.x,n.y,n.r,0,7);x.fillStyle=n.gold?'rgba(214,180,108,1)':'rgba(160,180,205,.85)';x.fill();if(n.gold){x.beginPath();x.arc(n.x,n.y,n.r+4,0,7);x.fillStyle='rgba(203,168,92,.2)';x.fill();}}
    for(var q=pulses.length-1;q>=0;q--){var pp=pulses[q];pp.t+=pp.sp;if(pp.t>=1){pulses.splice(q,1);continue;}var px=pp.a.x+(pp.b.x-pp.a.x)*pp.t,py=pp.a.y+(pp.b.y-pp.a.y)*pp.t;x.beginPath();x.arc(px,py,3,0,7);x.fillStyle='rgba(220,186,110,1)';x.fill();x.beginPath();x.arc(px,py,9,0,7);x.fillStyle='rgba(203,168,92,.26)';x.fill();}
    requestAnimationFrame(tick);}
  tick();
})();
